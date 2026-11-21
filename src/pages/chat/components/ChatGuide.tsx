import { useState } from 'react';
import iconBook from '@/shared/assets/svg/icon-book.svg';
import iconChevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
import { cn } from '@/shared/utils/cn';

interface ChatGuideProps {
  text: string;
}

// 피그마 Property 1: 접힘(한 줄 말줄임) / open(전체 문장). 누를 때마다 바뀝니다.
function ChatGuide({ text }: ChatGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full shrink-0 gap-2 rounded-[4px] bg-gray-100 pr-5 pl-6 text-left',
        isOpen ? 'items-start pt-[15px] pb-[14px]' : 'items-center',
      )}
    >
      <img src={iconBook} alt="" className="size-6 shrink-0" />
      <p
        className={cn(
          'min-w-0 flex-1 font-pretendard text-body-regular-l text-primary-green-900',
          !isOpen && 'truncate py-[15px]',
        )}
      >
        {text}
      </p>
      <img src={iconChevronDown} alt="" className="size-5 shrink-0" />
    </button>
  );
}

export default ChatGuide;
