import { useState } from 'react';

import FormStoryReview from '@/pages/story-review/components/FormStoryReview';
import { MOCK_STORY_REVIEW } from '@/pages/story-review/constants/mockStoryReview';

function StoryReviewPage() {
  const [story, setStory] = useState(MOCK_STORY_REVIEW);
  const [draft, setDraft] = useState(MOCK_STORY_REVIEW);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="flex min-h-dvh justify-center px-5 py-10">
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
  );
}

export default StoryReviewPage;
