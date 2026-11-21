import { useRef, useState } from 'react';
import CarouselCard from '@/pages/world-list/components/CarouselCard';
import StoryListCard from '@/pages/world-list/components/StoryListCard';
import StoryListItem from '@/pages/world-list/components/StoryListItem';
import chevronRight from '@/shared/assets/svg/icon-chevron-right.svg';
import Header from '@/shared/components/header';
import Tag from '@/shared/components/Tag';
import { SAMPLE_STORIES } from '@/shared/constants/sampleStories';

const GENRES = ['전체', '미스터리', '모험', '판타지'] as const;

const WorldListPage = () => {
  const [genre, setGenre] = useState<(typeof GENRES)[number]>('전체');
  const genreListRef = useRef<HTMLUListElement>(null);
  const visibleStories = SAMPLE_STORIES.filter(
    (story) => genre === '전체' || story.genre === genre,
  );

  return (
    <>
      <Header variant="brand_title" backTo="/" />
      <main lang="ko" className="space-y-6 pt-2 pb-6">
        <section aria-labelledby="featured-worlds" className="space-y-4">
          <h1 id="featured-worlds" className="px-5 text-title-semibold-m">
            오늘의 세계관
          </h1>
          <CarouselCard stories={SAMPLE_STORIES} labelledBy="featured-worlds" />
        </section>

        <section aria-labelledby="browse-worlds" className="space-y-4 pl-5">
          <div className="flex items-center justify-between pr-5">
            <h2 id="browse-worlds" className="text-title-semibold-m">
              세계관 둘러보기
            </h2>
            <img src={chevronRight} alt="" width={24} height={24} />
          </div>
          <div role="group" aria-label="세계관 장르" className="flex flex-wrap gap-2 pl-0.5">
            {GENRES.map((option) => (
              <Tag
                key={option}
                variant="genre"
                selected={genre === option}
                onClick={() => {
                  setGenre(option);
                  if (genreListRef.current) genreListRef.current.scrollLeft = 0;
                }}
              >
                {option}
              </Tag>
            ))}
          </div>
          <ul
            ref={genreListRef}
            aria-labelledby="browse-worlds"
            tabIndex={0}
            className="flex [scrollbar-width:none] gap-2 overflow-x-auto pr-5"
          >
            {visibleStories.map(({ id, title, author }) => (
              <StoryListItem
                key={id}
                title={title}
                author={author}
                to={`/worlds/${id}`}
                className="shrink-0"
              />
            ))}
          </ul>
        </section>

        <section aria-labelledby="popular-worlds" className="space-y-4 px-5">
          <div className="flex items-center justify-between">
            <h2 id="popular-worlds" className="text-title-semibold-m">
              인기 세계관
            </h2>
            <img src={chevronRight} alt="" width={24} height={24} />
          </div>
          <ul className="space-y-2">
            {SAMPLE_STORIES.slice(0, 2).map(({ id, title, description }) => (
              <StoryListCard
                key={id}
                title={title}
                description={description}
                to={`/worlds/${id}`}
              />
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default WorldListPage;
