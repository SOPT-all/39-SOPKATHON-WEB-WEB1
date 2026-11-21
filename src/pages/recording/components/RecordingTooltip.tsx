import type { ComponentPropsWithoutRef } from 'react';

import tooltipTail from '@/shared/assets/svg/icon-tooltip-tail.svg';
import { cn } from '@/shared/utils/cn';

type RecordingTooltipProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'> & {
  children?: string;
};

function RecordingTooltip({
  children = '녹음을 끝내려면 버튼을 눌러주세요.',
  className,
  ...props
}: RecordingTooltipProps) {
  return (
    <div {...props} role="tooltip" className={cn('flex w-fit flex-col items-center', className)}>
      <div className="flex w-full items-center justify-center rounded-xl bg-[#d6d6d6] px-3 py-2">
        <p className="max-w-[247px] text-center font-['Pretendard',sans-serif] text-[10px] leading-[1.3] font-medium whitespace-nowrap text-[#292929]">
          {children}
        </p>
      </div>
      <img src={tooltipTail} alt="" width={20.853} height={8.03584} className="block shrink-0" />
    </div>
  );
}

export default RecordingTooltip;
