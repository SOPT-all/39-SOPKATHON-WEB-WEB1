import type { ComponentProps } from 'react';

import BadgeRecordTime from '@/pages/recording/components/BadgeRecordTime';
import BtnRecordCircle from '@/pages/recording/components/BtnRecordCircle';
import { cn } from '@/shared/utils/cn';

type BarRecordControlsBottomProps = {
  elapsedSeconds: number;
  isRecording?: boolean;
  buttonProps: ComponentProps<typeof BtnRecordCircle>;
  className?: string;
};

function BarRecordControlsBottom({
  elapsedSeconds,
  isRecording = true,
  buttonProps,
  className,
}: BarRecordControlsBottomProps) {
  return (
    <div
      className={cn(
        'flex w-[375px] max-w-full flex-col items-center gap-2.5 px-2.5 pt-2.5 pb-10',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-[17px]">
        <BtnRecordCircle {...buttonProps} />
        <BadgeRecordTime elapsedSeconds={elapsedSeconds} isRecording={isRecording} />
      </div>
    </div>
  );
}

export default BarRecordControlsBottom;
