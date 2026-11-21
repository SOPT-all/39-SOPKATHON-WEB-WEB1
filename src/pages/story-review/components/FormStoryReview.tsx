import { useId } from 'react';

import type { StoryReview } from '@/pages/story-review/types/storyReview';
import editIcon from '@/shared/assets/svg/icon-story-edit.svg';
import chevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
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
          'flex w-[335px] max-w-full flex-col gap-8 rounded-3xl bg-[#fafafa] p-5 font-pretendard font-medium text-[#0a0a0a]',
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          {STORY_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={`${id}-${key}`} className="px-1 text-base leading-[1.3]">
                {label}
              </label>
              <div className="relative">
                {key === 'category' ? (
                  <>
                    <select
                      id={`${id}-${key}`}
                      value={story[key]}
                      onChange={(event) => props.onChange({ ...story, [key]: event.target.value })}
                      className="h-[42px] w-full appearance-none rounded-lg border border-[#e6e6e6] bg-white pr-10 pl-4 text-xs leading-[1.3] focus-visible:outline-2 focus-visible:outline-[#81b261]"
                    >
                      {['공포', '로맨스', '스릴러', '액션', '판타지', '기타'].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <img
                      src={chevronDown}
                      alt=""
                      width={20}
                      height={20}
                      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                    />
                  </>
                ) : (
                  <div className="flex min-h-[42px] items-center justify-between gap-4 rounded-lg border border-[#e6e6e6] bg-white p-3 focus-within:outline-2 focus-within:outline-[#81b261]">
                    {key === 'plot' ? (
                      <textarea
                        id={`${id}-${key}`}
                        value={story[key]}
                        onChange={(event) =>
                          props.onChange({ ...story, [key]: event.target.value })
                        }
                        rows={4}
                        className="block [field-sizing:content] min-h-16 w-[240px] min-w-0 shrink resize-none bg-transparent text-xs leading-[1.3] outline-none"
                      />
                    ) : (
                      <input
                        id={`${id}-${key}`}
                        value={story[key]}
                        onChange={(event) =>
                          props.onChange({ ...story, [key]: event.target.value })
                        }
                        className="h-4 w-[240px] min-w-0 shrink bg-transparent text-xs leading-[1.3] outline-none"
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
        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#81b261] p-2.5 text-base leading-[1.3] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52733c]"
        >
          내용 저장하기
        </button>
      </form>
    );
  }
  return (
    <section
      aria-label="이야기 내용 확인"
      className={cn(
        'flex w-[335px] max-w-full flex-col gap-6 overflow-hidden rounded-3xl bg-[#fafafa] p-5 font-pretendard leading-[1.3] font-medium wrap-break-word',
        className,
      )}
    >
      <dl className="flex flex-col gap-3">
        {STORY_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className={cn(
              'flex flex-col gap-2 pb-4',
              key !== 'plot' && 'border-b border-[#d6d6d6]',
            )}
          >
            <dt className="px-0.5 text-xs leading-[1.3] text-[#a5a5a5]">{label}</dt>
            <dd className="text-base leading-[1.3] whitespace-pre-wrap text-[#0a0a0a]">
              {story[key]}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={props.onEdit}
          className="cursor-pointer text-xs leading-[1.3] text-[#767676] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          내용 수정하기
        </button>
      </div>
    </section>
  );
}

export default FormStoryReview;
