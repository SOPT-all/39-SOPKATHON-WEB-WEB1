import recordingBackground from '@/shared/assets/svg/img-recording-background.svg';
import { cn } from '@/shared/utils/cn';

type BgRecordingCirclesProps = {
  className?: string;
};

function BgRecordingCircles({ className }: BgRecordingCirclesProps) {
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

export default BgRecordingCircles;
