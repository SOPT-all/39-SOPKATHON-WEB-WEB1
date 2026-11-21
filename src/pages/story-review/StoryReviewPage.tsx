import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';

import FormStoryReview from '@/pages/story-review/components/FormStoryReview';
import type { StoryReview } from '@/pages/story-review/types/storyReview';
import { STORY_CATEGORY_LABELS } from '@/shared/types/storyDraft';
import { getStoryDraft } from '@/shared/utils/storyDraft';
import useStoryPublication from '@/pages/story-review/hooks/useStoryPublication';
import Header from '@/shared/components/header';

function StoryReviewPage() {
  const navigate = useNavigate();
  const { publish, isPublishing, isLocked, error } = useStoryPublication();
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

  const handlePublish = async (review: StoryReview) => {
    const category = (
      Object.keys(STORY_CATEGORY_LABELS) as Array<keyof typeof STORY_CATEGORY_LABELS>
    ).find((code) => STORY_CATEGORY_LABELS[code] === review.category);
    if (!category) return;
    const storyId = await publish({
      ...generatedDraft,
      title: review.title,
      category,
      setting: review.setting,
      characters: review.characters,
      coreEvent: review.plot,
    });
    if (storyId === null) return;
    setStory(review);
    void navigate('/story-finish', { state: { story: review, storyId }, replace: true });
  };

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
        {error && (
          <p role="alert" className="mb-4 text-body-medium-m text-gray-700">
            {error}
          </p>
        )}
        {isLocked && !isPublishing && (
          <p role="status" className="mb-4 text-body-medium-m text-gray-500">
            등록을 요청한 내용으로 다시 확인할 수 있어요.
          </p>
        )}
        {isEditing ? (
          <FormStoryReview
            mode="editing"
            story={draft}
            onChange={setDraft}
            onSave={() => void handlePublish(draft)}
            isPublishing={isPublishing}
            isLocked={isLocked}
            className="self-start"
          />
        ) : (
          <FormStoryReview
            story={story}
            onSave={() => void handlePublish(story)}
            isPublishing={isPublishing}
            isLocked={isLocked}
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
