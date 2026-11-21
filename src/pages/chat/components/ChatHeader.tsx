import iconArrowBack from '@/shared/assets/svg/icon-arrow-back.svg';

interface ChatHeaderProps {
  title: string;
  onBack: () => void;
}

function ChatHeader({ title, onBack }: ChatHeaderProps) {
  return (
    <header className="flex h-[44px] shrink-0 items-center border-b border-[#f5f5f5] pr-[14px]">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="relative size-[44px] shrink-0"
      >
        <img
          src={iconArrowBack}
          alt=""
          className="absolute top-1/2 left-[calc(50%-4px)] size-6 -translate-x-1/2 -translate-y-1/2"
        />
      </button>
      <h1 className="min-w-0 flex-1 truncate font-[Pretendard] text-[20px] leading-[1.3] font-semibold text-[#191f28]">
        {title}
      </h1>
    </header>
  );
}

export default ChatHeader;
