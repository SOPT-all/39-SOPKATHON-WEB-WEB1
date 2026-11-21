import { cn } from '@/shared/utils/cn';

const DEFAULT_TOPIC = '학창시절에 있었던 재밌는 이야기를 들려주세요.';

type RecordingPromptProps = {
  message?: string;
  topic?: string;
  className?: string;
  compact?: boolean;
};

function RecordingPrompt({
  message = '녹음이 시작됐어요.',
  topic = DEFAULT_TOPIC,
  className,
  compact = false,
}: RecordingPromptProps) {
  return (
    <header
      className={cn(
        'flex w-[335px] max-w-full flex-col wrap-break-word transition-[gap,opacity] duration-700 ease-out motion-reduce:transition-none',
        compact ? 'gap-1 opacity-20' : 'gap-2 opacity-100',
        className,
      )}
    >
      <p
        className={cn(
          'text-gray-500 transition-[font-size,line-height] duration-700 ease-out motion-reduce:transition-none',
          compact ? 'text-label-medium-s' : 'text-body-medium-m',
        )}
      >
        {message}
      </p>
      <h1
        className={cn(
          'text-gray-900 transition-[font-size,line-height] duration-700 ease-out motion-reduce:transition-none',
          compact ? 'text-title-semibold-s' : 'text-title-semibold-l',
        )}
      >
        {topic === DEFAULT_TOPIC ? (
          <>
            학창시절에 있었던 재밌는 이야기를
            <br />
            들려주세요.
          </>
        ) : (
          topic
        )}
      </h1>
    </header>
  );
}

export default RecordingPrompt;
