import { cn } from '@/shared/utils/cn';

type RecordingTranscriptProps = {
  text: string;
  interimText?: string;
  className?: string;
};

function RecordingTranscript({ text, interimText = '', className }: RecordingTranscriptProps) {
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6 text-right text-title-semibold-s wrap-break-word whitespace-pre-wrap text-primary-green-700',
        className,
      )}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {interimText && (
        <p aria-label="인식 중인 내용" className="opacity-60">
          {interimText}
        </p>
      )}
    </div>
  );
}

export default RecordingTranscript;
