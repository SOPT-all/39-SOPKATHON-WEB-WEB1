import recordingBackground from '@/shared/assets/svg/img-recording-background.svg';
import { cn } from '@/shared/utils/cn';

type RecordingBackgroundProps = {
  className?: string;
};

function RecordingBackground({ className }: RecordingBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative size-[702px] shrink-0 select-none', className)}
    >
      <img
        src={recordingBackground}
        alt=""
        width={702}
        height={702}
        className="absolute inset-0 block max-w-none"
      />
    </div>
  );
}

export default RecordingBackground;
