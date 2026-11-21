import { client } from '@/shared/apis/client';
import type { StoryDraft } from '@/shared/types/storyDraft';

export type CreateStoryDraftRequest = { transcript: string };
export type CreateStoryDraftResponse = {
  code: string;
  message: string;
  data: StoryDraft;
};

export function validateTranscript(transcript: string) {
  if (!transcript.trim()) return '인식된 내용이 없어요. 다시 녹음해주세요.';
  if (Array.from(transcript).length > 5000)
    return '이야기는 5,000자까지 만들 수 있어요. 조금 짧게 다시 녹음해주세요.';
  return null;
}

export async function createStoryDraft(request: CreateStoryDraftRequest, signal: AbortSignal) {
  const validationError = validateTranscript(request.transcript);
  if (validationError) throw new Error(validationError);
  const { data } = await client.post<CreateStoryDraftResponse>('/api/v1/story-drafts', request, {
    signal,
    timeout: 120_000,
  });
  if (!data.data) throw new Error('이야기 초안을 받지 못했어요. 다시 시도해주세요.');
  return data.data;
}
