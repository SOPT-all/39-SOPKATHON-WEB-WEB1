import { useEffect, useId, useRef, useState } from 'react';

import chevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
import chevronUp from '@/shared/assets/svg/icon-story-chevron-up.svg';
import editIcon from '@/shared/assets/svg/icon-story-field-edit.svg';
import { cn } from '@/shared/utils/cn';

const GENRES = ['공포', '로맨스', '스릴러', '액션', '판타지', '기타'];

type SelectStoryGenreProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'default' | 'story-field';
};

function SelectStoryGenre({
  id,
  value,
  onChange,
  className,
  variant = 'default',
}: SelectStoryGenreProps) {
  const isStoryField = variant === 'story-field';
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [isOpen]);

  const focusOption = (index: number) => {
    optionRefs.current[(index + GENRES.length) % GENRES.length]?.focus();
  };

  return (
    <div
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
      className={cn(
        'relative flex w-full flex-col rounded-lg border border-gray-200 bg-white text-gray-900',
        isStoryField && 'rounded-[10px]',
        isOpen && 'z-10 rounded-b-none border-b-transparent',
        className,
      )}
    >
      <button
        id={id}
        ref={triggerRef}
        type="button"
        aria-label={`카테고리: ${value}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
            requestAnimationFrame(() => focusOption(Math.max(0, GENRES.indexOf(value))));
          }
        }}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-4 text-left text-body-medium-s focus-visible:outline-2 focus-visible:outline-primary-green-700',
          isStoryField && 'h-auto rounded-[10px] px-3.5 py-2.5',
        )}
      >
        <span>{value}</span>
        <img
          src={isStoryField ? editIcon : isOpen ? chevronUp : chevronDown}
          alt=""
          width={isStoryField ? 24 : 20}
          height={isStoryField ? 24 : 20}
          className="shrink-0"
        />
      </button>
      {isOpen && (
        <div
          id={listId}
          role="listbox"
          aria-label="카테고리"
          className="absolute top-full -right-px -left-px z-10 flex flex-col gap-2 rounded-b-lg border border-t-0 border-gray-200 bg-white px-4 pt-1 pb-4"
        >
          {GENRES.map((genre, index) => (
            <button
              key={genre}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={genre === value}
              tabIndex={-1}
              onClick={() => {
                onChange(genre);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(event) => {
                if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                  event.preventDefault();
                  focusOption(
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? GENRES.length - 1
                        : index + (event.key === 'ArrowDown' ? 1 : -1),
                  );
                }
              }}
              className="w-full cursor-pointer rounded-sm text-left text-label-medium-m focus-visible:bg-primary-green-50 focus-visible:outline-2 focus-visible:outline-primary-green-700"
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectStoryGenre;
