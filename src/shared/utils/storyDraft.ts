import type { RecordedStoryDraft } from '@/shared/types/storyDraft';

// Keep the original and unpublished draft in memory for this app session.
let storyDraft: RecordedStoryDraft | null = null;

export function getStoryDraft() {
  return storyDraft;
}

export function setStoryDraft(draft: RecordedStoryDraft | null) {
  if (storyDraft?.recordUuid !== draft?.recordUuid) publication = null;
  storyDraft = draft;
}

// Once sent, preserve the exact body for retries even if the review page is remounted.
let publication: { draft: RecordedStoryDraft; storyId: number | null } | null = null;

export function getStoryPublication() {
  return publication?.draft.recordUuid === storyDraft?.recordUuid ? publication : null;
}

export function startStoryPublication(draft: RecordedStoryDraft) {
  const existing = getStoryPublication();
  if (existing) return existing;
  publication = { draft: { ...draft }, storyId: null };
  return publication;
}

export function completeStoryPublication(recordUuid: string, storyId: number) {
  if (publication?.draft.recordUuid === recordUuid) publication.storyId = storyId;
}
