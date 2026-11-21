import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { getChatHistory, getStory, sendMessage } from '@/pages/chat/apis/chatApi';
import type { ChatMessage, ChatStatus, ServerMessage, StoryDetail } from '@/pages/chat/types/chat';

const ROLE_BY_TYPE: Record<ServerMessage['type'], ChatMessage['role']> = {
  STORY: 'ai',
  STUDENT: 'user',
  FEEDBACK: 'correction',
};

const toChatMessage = ({ messageId, type, text }: ServerMessage): ChatMessage => ({
  id: String(messageId),
  role: ROLE_BY_TYPE[type],
  text,
});

const getLastMessageId = (messages: ServerMessage[]) => messages.at(-1)?.messageId;

export function useChat(storyId: string) {
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('starting');
  const [draft, setDraft] = useState('');
  // 서버가 마지막으로 보여 준 메시지 id. 같은 이야기의 대화는 모두가 함께 쓰므로 전송할 때 함께 보냅니다.
  const lastMessageIdRef = useRef(0);

  const applyHistory = (history: ServerMessage[]) => {
    setMessages(history.map(toChatMessage));
    lastMessageIdRef.current = getLastMessageId(history) ?? 0;
  };

  useEffect(() => {
    let ignore = false;

    // 명세: 네트워크·AI 실패 처리는 이번 범위가 아니라, 실패하면 로딩만 멈춥니다.
    Promise.all([getStory(storyId), getChatHistory(storyId)])
      .then(([storyDetail, history]) => {
        if (ignore) return;
        setStory(storyDetail);
        applyHistory(history);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setStatus('idle');
      });

    return () => {
      ignore = true;
    };
  }, [storyId]);

  const send = async () => {
    const text = draft.trim();
    if (!text || status === 'sending' || status === 'starting') return;

    // 응답을 기다리는 동안 내 문장을 먼저 보여 주고, 응답이 오면 서버 메시지로 바꿉니다.
    const pendingId = `pending-${Date.now()}`;
    setMessages((prev) => [...prev, { id: pendingId, role: 'user', text }]);
    setDraft('');
    setStatus('sending');

    try {
      const response = await sendMessage(storyId, {
        text,
        lastSeenMessageId: lastMessageIdRef.current,
      });

      setMessages((prev) => [
        ...prev.filter(({ id }) => id !== pendingId),
        ...response.messages.map(toChatMessage),
      ]);
      lastMessageIdRef.current = getLastMessageId(response.messages) ?? lastMessageIdRef.current;

      if (response.result === 'NEEDS_REVISION') {
        // 기획 합의: 틀린 부분만 고칠 수 있도록 보냈던 문장을 입력칸에 다시 채워 둡니다.
        setDraft(text);
        setStatus('rewrite');
        return;
      }

      setStatus('idle');
    } catch (error) {
      setMessages((prev) => prev.filter(({ id }) => id !== pendingId));
      setDraft(text);

      // 다른 친구가 먼저 문장을 보냈으면(409 CHAT_OUTDATED) 최신 대화를 다시 불러옵니다.
      if (isAxiosError(error) && error.response?.status === 409) {
        try {
          applyHistory(await getChatHistory(storyId));
        } catch {
          // 다시 불러오기도 실패하면 지금 대화를 그대로 둡니다.
        }
      }

      setStatus('idle');
    }
  };

  return { story, messages, status, draft, setDraft, send };
}
