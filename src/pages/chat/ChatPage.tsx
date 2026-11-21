import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import ChatBubble from '@/pages/chat/components/ChatBubble';
import ChatGuide from '@/pages/chat/components/ChatGuide';
import ChatInput from '@/pages/chat/components/ChatInput';
import CorrectionCard from '@/pages/chat/components/CorrectionCard';
import TypingBubble from '@/pages/chat/components/TypingBubble';
import { useChat } from '@/pages/chat/hooks/useChat';
import Header from '@/shared/components/header';
import { cn } from '@/shared/utils/cn';

interface ChatLocationState {
  worldTitle?: string;
}

function ChatPage() {
  const { worldId = '' } = useParams();
  // 세계관 상세에서 넘겨준 제목을 먼저 쓰고, 없으면 이야기 상세 응답의 제목을 씁니다.
  const locationState = useLocation().state as ChatLocationState | null;
  const { story, messages, status, draft, setDraft, send } = useChat(worldId);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isWaiting = status === 'starting' || status === 'sending';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, status]);

  return (
    <main className="flex h-dvh flex-col bg-white pt-[env(safe-area-inset-top)]">
      <Header
        variant="story_title"
        title={locationState?.worldTitle ?? story?.title ?? ''}
        // 채팅 주소로 바로 들어와도 앱 밖으로 나가지 않도록, 뒤로가기는 항상 세계관 상세로 보냅니다.
        backTo={worldId ? `/worlds/${worldId}` : '/worlds'}
        className="shrink-0 border-b border-gray-100"
      />

      <section
        className={cn(
          'flex flex-1 flex-col gap-[14px] overflow-y-auto pb-4',
          // 이야기 상세 응답 전에는 안내 띠가 없어서, 로딩 점이 헤더에 붙지 않도록 위 여백을 줍니다.
          !story && 'pt-5',
        )}
      >
        {story && <ChatGuide text={story.setting} />}

        <div className="flex flex-col gap-[14px] px-5">
          {messages.map((message) =>
            message.role === 'correction' ? (
              <CorrectionCard key={message.id} text={message.text} />
            ) : (
              <ChatBubble key={message.id} role={message.role} text={message.text} />
            ),
          )}
          {isWaiting && <TypingBubble />}
        </div>
        <div ref={bottomRef} />
      </section>

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSubmit={send}
        isRewrite={status === 'rewrite'}
        disabled={isWaiting}
      />
    </main>
  );
}

export default ChatPage;
