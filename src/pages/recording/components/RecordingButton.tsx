import type { ComponentPropsWithoutRef } from 'react';

import microphoneIcon from '@/shared/assets/svg/icon-microphone-recording.svg';
import { cn } from '@/shared/utils/cn';

type RecordingButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  'aria-label': string;
};

function RecordingButton({ className, type = 'button', ...props }: RecordingButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        'inline-flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e6e6e6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#575757] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#575757]">
        <img src={microphoneIcon} alt="" width={48} height={48} />
      </span>
    </button>
  );
}

export default RecordingButton;
