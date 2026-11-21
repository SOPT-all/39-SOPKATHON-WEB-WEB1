import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

interface MetadataTagProps extends ComponentPropsWithoutRef<'span'> {
  variant: 'metadata';
}

interface GenreTagProps extends ComponentPropsWithoutRef<'button'> {
  variant: 'genre';
  selected?: boolean;
}

const Tag = (props: MetadataTagProps | GenreTagProps) => {
  if (props.variant === 'metadata') {
    const { variant, className, ...spanProps } = props;

    return (
      <span
        {...spanProps}
        data-variant={variant}
        className={cn(
          'inline-flex items-center rounded-md bg-primary-green-50 px-2 py-[5px] font-pretendard text-body-medium-s whitespace-nowrap text-gray-600',
          className,
        )}
      />
    );
  }

  const { variant, selected = false, type = 'button', className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      data-variant={variant}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg p-2 font-pretendard whitespace-nowrap',
        selected
          ? 'bg-gray-900 text-body-medium-l text-gray-100'
          : 'bg-gray-100 text-body-regular-l text-gray-500',
        className,
      )}
    />
  );
};

export default Tag;
