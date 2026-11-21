import { useEffect, useState } from 'react';
import { sendMessageMock, startStoryMock } from '@/pages/chat/apis/chatMock';
import type { ChatMessage, ChatStatus, StoryStartResponse } from '@/pages/chat/types/chat';

const createId = () => crypto.randomUUID();

export function useChat(worldId: string) {
  const [story, setStory] = useState<StoryStartResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('starting');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let ignore = false;

    // 명세: 네트워크·AI 실패 처리는 이번 범위가 아니라 별도 처리하지 않습니다.
    startStoryMock(worldId).then((response) => {
      if (ignore) return;
      setStory(response);
      setMessages([{ id: createId(), role: 'ai', text: response.firstScene }]);
      setStatus('idle');
    });

    return () => {
      ignore = true;
    };
  }, [worldId]);

  const send = async () => {
    const text = draft.trim();
    if (!text || status === 'sending' || status === 'starting') return;

    setMessages((prev) => [...prev, { id: createId(), role: 'user', text }]);
    setDraft('');
    setStatus('sending');

    const response = await sendMessageMock(text);

    if (response.type === 'correction') {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'correction', correction: response.correction },
      ]);
      // 기획 합의: 틀린 부분만 고칠 수 있도록 보냈던 문장을 입력칸에 다시 채워 둡니다.
      setDraft(text);
      setStatus('rewrite');
      return;
    }

    setMessages((prev) => [...prev, { id: createId(), role: 'ai', text: response.scene }]);
    setStatus('idle');
  };

  return { story, messages, status, draft, setDraft, send };
}
