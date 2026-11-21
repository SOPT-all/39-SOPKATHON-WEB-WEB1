import { useState } from 'react';

import FormStoryReview from '@/pages/story-review/components/FormStoryReview';
import { MOCK_STORY_REVIEW } from '@/pages/story-review/constants/mockStoryReview';
import Header from '@/shared/components/header';

function StoryReviewPage() {
  const [story, setStory] = useState(MOCK_STORY_REVIEW);
  const [draft, setDraft] = useState(MOCK_STORY_REVIEW);
  const [isEditing, setIsEditing] = useState(false);

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
              setStory(draft);
              setIsEditing(false);
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
