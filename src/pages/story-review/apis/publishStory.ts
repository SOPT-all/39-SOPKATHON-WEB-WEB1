import { client } from '@/shared/apis/client';
import { STORY_CATEGORY_LABELS, type RecordedStoryDraft } from '@/shared/types/storyDraft';

export type PublishStoryRequest = Omit<RecordedStoryDraft, 'recordUuid'>;
export type PublishStoryResponse = {
  code: string;
  message: string;
  data: { storyId: number };
};

const FIELD_LIMITS = [
  ['transcript', '원문', 5000],
  ['title', '제목', 20],
  ['summary', '소개문', 200],
  ['setting', '배경', 200],
  ['characters', '인물', 100],
  ['coreEvent', '사건', 500],
] as const;

export function validatePublication(request: PublishStoryRequest) {
  for (const [field, label, limit] of FIELD_LIMITS) {
    if (!request[field].trim()) return `${label}을 입력해주세요.`;
    if (Array.from(request[field]).length > limit)
      return `${label}은 ${limit}자까지 입력할 수 있어요.`;
  }
  if (!Object.hasOwn(STORY_CATEGORY_LABELS, request.category)) return '카테고리를 선택해주세요.';
  return null;
}

export async function publishStory(draft: RecordedStoryDraft, signal: AbortSignal) {
  const { recordUuid, ...request } = draft;
  const error = validatePublication(request);
  if (error) throw new Error(error);
  const { data } = await client.post<PublishStoryResponse>('/api/v1/stories', request, {
    headers: { 'Idempotency-Key': recordUuid },
    signal,
    timeout: 120_000,
  });
  if (!Number.isSafeInteger(data.data?.storyId) || data.data.storyId <= 0)
    throw new Error('등록 결과를 확인하지 못했어요. 같은 내용으로 다시 시도해주세요.');
  return data.data;
}
