import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'heading-medium-s',
        'heading-semibold-s',
        'title-medium-l',
        'title-medium-m',
        'title-medium-s',
        'title-semibold-l',
        'title-semibold-m',
        'title-semibold-s',
        'body-regular-l',
        'body-regular-m',
        'body-regular-s',
        'body-medium-l',
        'body-medium-m',
        'body-medium-s',
        'label-medium-l',
        'label-medium-m',
        'label-medium-s',
        'label-semibold-l',
        'label-semibold-m',
        'label-semibold-s',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
