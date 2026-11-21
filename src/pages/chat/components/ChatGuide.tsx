import { useState } from 'react';
import iconBook from '@/shared/assets/svg/icon-book.svg';
import iconChevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
import { cn } from '@/shared/utils/cn';

interface ChatGuideProps {
  text: string;
}

// 피그마 Property 1: 접힘(한 줄 말줄임) / open(전체 문장). 누를 때마다 바뀝니다.
// 아이콘은 두 상태 모두 첫 줄 글자 높이(1.3em)의 가운데에 맞춰, 펼치거나 접을 때 움직이지 않게 했습니다.
function ChatGuide({ text }: ChatGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full shrink-0 items-start gap-2 rounded-[4px] bg-gray-100 pt-[15px] pr-5 pl-6 text-left font-pretendard text-body-regular-l',
        isOpen ? 'pb-[14px]' : 'pb-[15px]',
      )}
    >
      <span className="flex h-[1.3em] shrink-0 items-center">
        <img src={iconBook} alt="" className="size-6" />
      </span>
      <p className={cn('min-w-0 flex-1 text-primary-green-900', !isOpen && 'truncate')}>{text}</p>
      <span className="flex h-[1.3em] shrink-0 items-center">
        <img
          src={iconChevronDown}
          alt=""
          className={cn('size-5 transition-transform', isOpen && 'rotate-180')}
        />
      </span>
    </button>
  );
}

export default ChatGuide;
