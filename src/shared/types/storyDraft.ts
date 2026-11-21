export const STORY_CATEGORY_LABELS = {
  HORROR: '공포',
  ROMANCE: '로맨스',
  THRILLER: '스릴러',
  ACTION: '액션',
  FANTASY: '판타지',
  ETC: '기타',
} as const;

export type StoryDraft = {
  recordUuid: string;
  title: string;
  summary: string;
  setting: string;
  characters: string;
  category: keyof typeof STORY_CATEGORY_LABELS;
  coreEvent: string;
};

export type RecordedStoryDraft = StoryDraft & { transcript: string };
