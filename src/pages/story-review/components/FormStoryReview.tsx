import { useId } from 'react';

import type { StoryReview } from '@/pages/story-review/types/storyReview';
import editIcon from '@/shared/assets/svg/icon-story-edit.svg';
import SelectStoryGenre from '@/pages/story-review/components/SelectStoryGenre';
import Button from '@/shared/components/Button';
import { cn } from '@/shared/utils/cn';

const STORY_FIELDS = [
  { key: 'title', label: '제목' },
  { key: 'category', label: '카테고리' },
  { key: 'setting', label: '배경' },
  { key: 'characters', label: '인물' },
  { key: 'plot', label: '사건' },
] as const;

type FormStoryReviewProps = {
  story: StoryReview;
  className?: string;
} & (
  | { mode?: 'preview'; onEdit: () => void }
  | { mode: 'editing'; onChange: (story: StoryReview) => void; onSave: () => void }
);

function FormStoryReview(props: FormStoryReviewProps) {
  const { story, className } = props;
  const id = useId();
  if (props.mode === 'editing') {
    return (
      <form
        aria-label="이야기 내용 수정"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSave();
        }}
        className={cn(
          'flex w-[335px] max-w-full flex-col gap-8 rounded-3xl bg-gray-50 p-5 text-gray-900',
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          {STORY_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={`${id}-${key}`} className="px-1 text-body-medium-l">
                {label}
              </label>
              <div className="relative">
                {key === 'category' ? (
                  <SelectStoryGenre
                    id={`${id}-${key}`}
                    value={story.category}
                    onChange={(category) => props.onChange({ ...story, category })}
                  />
                ) : (
                  <div className="flex min-h-[42px] items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 focus-within:outline-2 focus-within:outline-primary-green-700">
                    {key === 'plot' ? (
                      <textarea
                        id={`${id}-${key}`}
                        value={story[key]}
                        onChange={(event) =>
                          props.onChange({ ...story, [key]: event.target.value })
                        }
                        rows={4}
                        className="block [field-sizing:content] min-h-16 w-[240px] min-w-0 shrink resize-none bg-transparent text-body-medium-s outline-none"
                      />
                    ) : (
                      <input
                        id={`${id}-${key}`}
                        value={story[key]}
                        onChange={(event) =>
                          props.onChange({ ...story, [key]: event.target.value })
                        }
                        className="h-4 w-[240px] min-w-0 shrink bg-transparent text-body-medium-s outline-none"
                      />
                    )}
                    <img
                      src={editIcon}
                      alt=""
                      width={13}
                      height={13}
                      className="pointer-events-none shrink-0"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="save"
          type="submit"
          className="cursor-pointer bg-primary-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-green-900"
        >
          내용 저장하기
        </Button>
      </form>
    );
  }
  return (
    <section
      aria-label="이야기 내용 확인"
      className={cn(
        'flex w-[335px] max-w-full flex-col gap-6 overflow-hidden rounded-3xl bg-gray-50 p-5 wrap-break-word',
        className,
      )}
    >
      <dl className="flex flex-col gap-3">
        {STORY_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className={cn('flex flex-col gap-2 pb-4', key !== 'plot' && 'border-b border-gray-300')}
          >
            <dt className="px-0.5 text-body-medium-s text-gray-400">{label}</dt>
            <dd className="text-body-medium-l whitespace-pre-wrap text-gray-900">{story[key]}</dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={props.onEdit}
          className="cursor-pointer text-body-medium-s text-gray-500 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          내용 수정하기
        </button>
      </div>
    </section>
  );
}

export default FormStoryReview;
