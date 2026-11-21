import { client } from '@/shared/apis/client';

export const STORY_CATEGORIES = {
  HORROR: '공포',
  ROMANCE: '로맨스',
  THRILLER: '스릴러',
  ACTION: '액션',
  FANTASY: '판타지',
  ETC: '기타',
} as const;

interface StoryListEntry {
  storyId: number;
  title: string;
  summary: string;
  imageUrl: string | null;
  category: keyof typeof STORY_CATEGORIES;
}

interface StoryDetail extends StoryListEntry {
  setting: string;
  characters: string;
}

interface StoryResponse<T> {
  code: string;
  data: T | null;
  message: string;
}

const STORIES_PATH = '/api/v1/stories';

async function getStoryData<T>(path: string, signal: AbortSignal) {
  const { data } = await client.get<StoryResponse<T>>(path, { signal });

  if (data.code !== 'SUCCESS' || data.data === null) {
    throw new Error(data.message);
  }

  return data.data;
}

export const getStories = async (signal: AbortSignal) => {
  const { items } = await getStoryData<{ items: StoryListEntry[] }>(STORIES_PATH, signal);
  return items;
};

export const getStory = (storyId: string, signal: AbortSignal) =>
  getStoryData<StoryDetail>(`${STORIES_PATH}/${encodeURIComponent(storyId)}`, signal);
