import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import FormStoryReview from '@/pages/story-review/components/FormStoryReview';
import type { StoryReview } from '@/pages/story-review/types/storyReview';
import { STORY_CATEGORY_LABELS } from '@/shared/types/storyDraft';
import { getStoryDraft, setStoryDraft } from '@/shared/utils/storyDraft';
import Header from '@/shared/components/header';

function StoryReviewPage() {
  const navigate = useNavigate();
  const [generatedDraft] = useState(getStoryDraft);
  const [story, setStory] = useState<StoryReview>(() => ({
    title: generatedDraft?.title ?? '',
    category: generatedDraft ? STORY_CATEGORY_LABELS[generatedDraft.category] : '',
    setting: generatedDraft?.setting ?? '',
    characters: generatedDraft?.characters ?? '',
    plot: generatedDraft?.coreEvent ?? '',
  }));
  const [draft, setDraft] = useState(story);
  const [isEditing, setIsEditing] = useState(false);

  if (!generatedDraft) return <Navigate to="/recording" replace />;

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="shrink-0 pt-[env(safe-area-inset-top)]">
        <Header backTo="/recording" />
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-[26px] pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-body-medium-m text-gray-500">
            들려주신 추억을 하나의 이야기로 정리했어요.
          </p>
          <h1 className="text-title-semibold-l text-gray-900">세계관 내용을 확인해주세요.</h1>
        </div>
        {isEditing ? (
          <FormStoryReview
            mode="editing"
            story={draft}
            onChange={setDraft}
            onSave={() => {
              const category =
                (
                  Object.keys(STORY_CATEGORY_LABELS) as Array<keyof typeof STORY_CATEGORY_LABELS>
                ).find((code) => STORY_CATEGORY_LABELS[code] === draft.category) ??
                generatedDraft.category;
              setStoryDraft({
                ...generatedDraft,
                title: draft.title,
                category,
                setting: draft.setting,
                characters: draft.characters,
                coreEvent: draft.plot,
              });
              setStory(draft);
              setIsEditing(false);
              void navigate('/story-finish', { state: { story: draft } });
            }}
            className="self-start"
          />
        ) : (
          <FormStoryReview
            story={story}
            onEdit={() => {
              setDraft(story);
              setIsEditing(true);
            }}
            className="self-start"
          />
        )}
      </main>
    </div>
  );
}

export default StoryReviewPage;
