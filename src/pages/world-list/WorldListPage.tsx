import { useEffect, useRef, useState } from 'react';
import CarouselCard from '@/pages/world-list/components/CarouselCard';
import StoryListCard from '@/pages/world-list/components/StoryListCard';
import StoryListItem from '@/pages/world-list/components/StoryListItem';
import { useHorizontalDrag } from '@/pages/world-list/hooks/useHorizontalDrag';
import { getStories, STORY_CATEGORIES } from '@/shared/apis/stories';
import chevronRight from '@/shared/assets/svg/icon-chevron-right.svg';
import Header from '@/shared/components/header';
import Tag from '@/shared/components/Tag';

const GENRES = [['ALL', '전체'], ...Object.entries(STORY_CATEGORIES)] as const;

const WorldListPage = () => {
  const [genre, setGenre] = useState('ALL');
  const [stories, setStories] = useState<Awaited<ReturnType<typeof getStories>> | null>(null);
  const [hasError, setHasError] = useState(false);
  const genreListRef = useRef<HTMLUListElement>(null);
  const dragHandlers = useHorizontalDrag<HTMLUListElement>();
  useEffect(() => {
    const controller = new AbortController();
    getStories(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setStories(items);
      })
      .catch(() => {
        if (!controller.signal.aborted) setHasError(true);
      });

    return () => controller.abort();
  }, []);

  if (!stories?.length) {
    return (
      <>
        <Header variant="brand_title" backTo="/" />
        <main lang="ko" className="p-5 text-body-medium-l">
          {hasError ? (
            <p role="alert">이야기 목록을 불러오지 못했어요.</p>
          ) : (
            <p role="status">
              {stories ? '아직 등록된 이야기가 없어요.' : '이야기를 불러오고 있어요.'}
            </p>
          )}
        </main>
      </>
    );
  }

  const visibleStories = stories.filter((story) => genre === 'ALL' || story.category === genre);
  const storiesWithCovers = stories.filter((story): story is typeof story & { imageUrl: string } =>
    Boolean(story.imageUrl),
  );
  // 인기순 API가 연결되기 전에는 서버 목록의 표지 있는 이야기로 채웁니다.
  const popularStories = storiesWithCovers.slice(0, 2);

  return (
    <>
      <Header variant="brand_title" backTo="/" />
      <main lang="ko" className="space-y-6 pt-2 pb-6">
        {storiesWithCovers.length > 0 && (
          <section aria-labelledby="featured-worlds" className="space-y-4">
            <h2 id="featured-worlds" className="px-5 text-title-semibold-m">
              오늘의 세계관
            </h2>
            <CarouselCard stories={storiesWithCovers.slice(0, 3)} labelledBy="featured-worlds" />
          </section>
        )}

        <section aria-labelledby="browse-worlds" className="space-y-4 pl-5">
          <div className="flex items-center justify-between pr-5">
            <h1 id="browse-worlds" className="text-title-semibold-m">
              세계관 둘러보기
            </h1>
            <img src={chevronRight} alt="" width={24} height={24} />
          </div>
          <div role="group" aria-label="세계관 장르" className="flex flex-wrap gap-2 pl-0.5">
            {GENRES.map(([option, label]) => (
              <Tag
                key={option}
                variant="genre"
                selected={genre === option}
                onClick={() => {
                  setGenre(option);
                  if (genreListRef.current) genreListRef.current.scrollLeft = 0;
                }}
              >
                {label}
              </Tag>
            ))}
          </div>
          {visibleStories.length > 0 ? (
            <ul
              {...dragHandlers}
              ref={genreListRef}
              aria-labelledby="browse-worlds"
              tabIndex={0}
              className="flex [scrollbar-width:none] gap-2 overflow-x-auto pr-5 select-none data-[dragging=true]:cursor-grabbing"
            >
              {visibleStories.map(({ storyId, title, imageUrl }) => (
                <StoryListItem
                  key={storyId}
                  title={title}
                  coverUrl={imageUrl ?? undefined}
                  to={`/worlds/${storyId}`}
                  className="shrink-0"
                />
              ))}
            </ul>
          ) : (
            <p role="status" className="pr-5 text-body-regular-m text-gray-500">
              아직 등록된 이야기가 없어요.
            </p>
          )}
        </section>
        {popularStories.length > 0 && (
          <section aria-labelledby="popular-worlds" className="space-y-4 px-5">
            <div className="flex items-center justify-between">
              <h2 id="popular-worlds" className="text-title-semibold-m">
                인기 세계관
              </h2>
              <img src={chevronRight} alt="" width={24} height={24} />
            </div>
            <ul className="space-y-2">
              {popularStories.map(({ storyId, title, summary, imageUrl }) => (
                <StoryListCard
                  key={storyId}
                  title={title}
                  description={summary}
                  coverUrl={imageUrl}
                  to={`/worlds/${storyId}`}
                />
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
};

export default WorldListPage;
