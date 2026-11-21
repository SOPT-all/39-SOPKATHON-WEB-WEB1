import type { RecordedStoryDraft } from '@/shared/types/storyDraft';

// Keep the original and unpublished draft in memory for this app session.
let storyDraft: RecordedStoryDraft | null = null;

export function getStoryDraft() {
  return storyDraft;
}

export function setStoryDraft(draft: RecordedStoryDraft | null) {
  storyDraft = draft;
}
