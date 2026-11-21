import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import StoryDetailSummary from '@/pages/world-detail/components/StoryDetailSummary';
import StoryStartBar from '@/pages/world-detail/components/StoryStartBar';
import coverPlaceholder from '@/shared/assets/images/img-story-cover-placeholder.png';
import Card from '@/shared/components/Card';
import Header from '@/shared/components/header';
import { SAMPLE_STORIES } from '@/shared/constants/sampleStories';

const WorldDetailPage = () => {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const story = SAMPLE_STORIES.find(({ id }) => id === worldId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [worldId]);

  return (
    <>
      <Header variant="brand_title" backTo="/worlds" />
      <main lang="ko" className="flex min-h-[calc(100dvh-44px)] flex-col">
        {story ? (
          <>
            <div className="flex justify-center bg-gray-100 px-5 py-11">
              <div className="h-[279px] w-[191px] bg-[#e3e3e3]">
                <img
                  src={coverPlaceholder}
                  alt=""
                  width={191}
                  height={279}
                  className="size-full object-contain opacity-20"
                />
              </div>
            </div>
            <div className="px-5 py-5">
              <StoryDetailSummary
                genre={story.genre}
                setting={story.setting}
                title={story.title}
                author={story.author}
                description={story.description}
              />
              <Card
                variant="storyRoles"
                title="이야기 속 역할"
                entries={[
                  { label: '등장인물', description: story.characters },
                  { label: '이야기 속 내 역할', description: story.readerRole },
                ]}
              />
            </div>
            <StoryStartBar
              onStart={() => {
                void navigate(`/stories/${story.id}`, { state: { worldTitle: story.title } });
              }}
            />
          </>
        ) : (
          <h1 className="p-5 text-title-semibold-m">세계관을 찾을 수 없어요.</h1>
        )}
      </main>
    </>
  );
};

export default WorldDetailPage;
