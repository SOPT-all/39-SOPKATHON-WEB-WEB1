import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

const BUTTON_VARIANTS = {
  confirm:
    'h-14 max-w-[335px] rounded-2xl bg-primary-green-700 p-2.5 text-title-semibold-s text-white',
  save: 'h-12 max-w-[295px] rounded-lg bg-gray-600 p-2.5 text-body-medium-l text-white',
  categorySave:
    'h-10 max-w-[293px] rounded-lg border border-primary-green-700 bg-primary-green-700 px-3 text-body-regular-l/none text-gray-100',
  categoryCancel:
    'h-10 max-w-[293px] rounded-lg border border-gray-400 bg-white px-3 text-body-regular-l/none text-gray-900',
};

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant: keyof typeof BUTTON_VARIANTS;
}

const Button = ({ variant, type = 'button', className, children, ...props }: ButtonProps) => (
  <button
    {...props}
    type={type}
    className={cn(
      'inline-flex w-full items-center justify-center overflow-clip text-center font-pretendard',
      BUTTON_VARIANTS[variant],
      className,
    )}
  >
    {variant === 'confirm' || variant === 'save' ? (
      <span className="h-[22px] min-w-0">{children}</span>
    ) : (
      children
    )}
  </button>
);

export default Button;
