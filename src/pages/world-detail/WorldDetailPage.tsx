import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import StoryDetailSummary from '@/pages/world-detail/components/StoryDetailSummary';
import StoryStartBar from '@/pages/world-detail/components/StoryStartBar';
import { getStory, STORY_CATEGORIES } from '@/shared/apis/stories';
import Card from '@/shared/components/Card';
import Header from '@/shared/components/header';
import { cn } from '@/shared/utils/cn';

const STORY_ERROR_MESSAGES = {
  400: '올바르지 않은 세계관 주소예요.',
  404: '세계관을 찾을 수 없어요.',
} as const;

type StoryResult =
  { id: string; story: Awaited<ReturnType<typeof getStory>> } | { id: string; error: string };

const WorldDetailPage = () => {
  const { worldId = '' } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<StoryResult>();
  const current = result?.id === worldId ? result : undefined;
  const story = current && 'story' in current ? current.story : undefined;
  const error = current && 'error' in current ? current.error : undefined;
  const [characters = '', readerRole] = story?.characters.split(/\s*\/\s*내 역할\s*:\s*/, 2) ?? [];
  const roleEntries = [{ label: '등장인물', description: characters }];
  if (readerRole) roleEntries.push({ label: '내 역할', description: readerRole });

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    getStory(worldId, controller.signal)
      .then((story) => {
        if (!controller.signal.aborted) setResult({ id: worldId, story });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        const status = isAxiosError(cause) ? cause.response?.status : undefined;
        const error =
          status === 400 || status === 404
            ? STORY_ERROR_MESSAGES[status]
            : '세계관을 불러오지 못했어요.';
        setResult({ id: worldId, error });
      });

    return () => controller.abort();
  }, [worldId]);

  return (
    <>
      <Header variant="brand_title" backTo="/worlds" />
      <main lang="ko" className="flex min-h-[calc(100dvh-44px)] flex-col">
        {story ? (
          <>
            {story.imageUrl && (
              <div className="flex justify-center bg-gray-400 px-5 pt-11 pb-16">
                <img
                  src={story.imageUrl}
                  alt=""
                  width={191}
                  height={279}
                  className="h-[279px] w-[191px] rounded-2xl object-cover shadow-md"
                />
              </div>
            )}
            <div className={cn('bg-white px-5 py-5', story.imageUrl && '-mt-5 rounded-t-2xl')}>
              <StoryDetailSummary
                genre={STORY_CATEGORIES[story.category] ?? story.category}
                setting={story.setting}
                title={story.title}
                description={story.summary}
              />
              <Card variant="storyRoles" title="이야기 속 역할" entries={roleEntries} />
            </div>
            <StoryStartBar
              onStart={() => {
                void navigate(`/stories/${story.storyId}`, { state: { worldTitle: story.title } });
              }}
            />
          </>
        ) : (
          <p role={error ? 'alert' : 'status'} className="p-5 text-body-medium-l">
            {error ?? '세계관을 불러오고 있어요.'}
          </p>
        )}
      </main>
    </>
  );
};

export default WorldDetailPage;
