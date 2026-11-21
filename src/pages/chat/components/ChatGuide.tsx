import { useState } from 'react';
import iconBook from '@/shared/assets/svg/icon-book.svg';
import iconChevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
import { cn } from '@/shared/utils/cn';

interface ChatGuideProps {
  text: string;
}

// 피그마에는 접힌 상태(한 줄 말줄임)만 있어서, 누르면 전체 문장을 펼쳐 보이도록 했습니다.
function ChatGuide({ text }: ChatGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full shrink-0 gap-2 rounded-[4px] bg-gray-100 pr-5 pl-6 text-left',
        isOpen ? 'items-start' : 'items-center',
      )}
    >
      {/* 펼쳤을 때는 아이콘을 첫 줄 높이에 맞춥니다. */}
      <img src={iconBook} alt="" className={cn('size-6 shrink-0', isOpen && 'mt-[13px]')} />
      <p
        className={cn(
          'min-w-0 flex-1 py-[15px] font-pretendard text-body-regular-l text-primary-green-900',
          isOpen ? 'break-keep' : 'truncate',
        )}
      >
        {text}
      </p>
      <img
        src={iconChevronDown}
        alt=""
        className={cn('size-5 shrink-0 transition-transform', isOpen && 'mt-[15px] rotate-180')}
      />
    </button>
  );
}

export default ChatGuide;
