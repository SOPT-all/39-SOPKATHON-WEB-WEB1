import recordingIndicator from '@/shared/assets/svg/icon-recording-indicator.svg';
import { cn } from '@/shared/utils/cn';

type RecordingTimerProps = {
  elapsedSeconds: number;
  isRecording?: boolean;
  className?: string;
};

function RecordingTimer({ elapsedSeconds, isRecording = true, className }: RecordingTimerProps) {
  const seconds = Number.isFinite(elapsedSeconds) ? Math.max(0, Math.floor(elapsedSeconds)) : 0;
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsText = String(seconds % 60).padStart(2, '0');

  return (
    <div
      role="timer"
      aria-label={`${isRecording ? '녹음 중' : '녹음 정지'} ${Math.floor(seconds / 60)}분 ${seconds % 60}초`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#767676] px-3 py-1',
        className,
      )}
    >
      <span className="relative size-2.5 shrink-0" aria-hidden="true">
        <img
          src={recordingIndicator}
          alt=""
          width={13}
          height={13}
          className="absolute -top-[1.5px] -left-[1.5px]"
        />
      </span>
      <span className="font-['Pretendard',sans-serif] text-xs leading-[1.3] font-medium whitespace-nowrap text-[#fafafa]">
        {isRecording ? '녹음 중' : '녹음 정지'} · {minutesText}:{secondsText}
      </span>
    </div>
  );
}

export default RecordingTimer;
