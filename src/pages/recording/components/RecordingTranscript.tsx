import { cn } from '@/shared/utils/cn';

type RecordingTranscriptProps = {
  text: string;
  className?: string;
};

function RecordingTranscript({ text, className }: RecordingTranscriptProps) {
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 text-right font-['Pretendard',sans-serif] text-lg leading-[1.3] font-semibold wrap-break-word whitespace-pre-wrap text-[#81b261]",
        className,
      )}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default RecordingTranscript;
