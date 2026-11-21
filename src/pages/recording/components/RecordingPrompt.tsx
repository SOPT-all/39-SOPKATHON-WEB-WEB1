import { cn } from '@/shared/utils/cn';

type RecordingPromptProps = {
  message?: string;
  topic?: string;
  className?: string;
};

function RecordingPrompt({
  message = '녹음이 시작됐어요.',
  topic = '학창시절에 있었던 재밌는 이야기를 들려주세요.',
  className,
}: RecordingPromptProps) {
  return (
    <header
      className={cn(
        "flex w-[335px] max-w-full flex-col gap-2 font-['Pretendard',sans-serif] leading-[1.3] wrap-break-word",
        className,
      )}
    >
      <p className="text-sm leading-[1.3] font-medium text-[#767676]">{message}</p>
      <h1 className="text-2xl leading-[1.3] font-semibold text-[#0a0a0a]">{topic}</h1>
    </header>
  );
}

export default RecordingPrompt;
