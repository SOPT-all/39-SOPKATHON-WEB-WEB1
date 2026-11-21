import { useEffect } from 'react';
import { useParams } from 'react-router';
import coverPlaceholder from '@/shared/assets/images/img-story-cover-placeholder.png';
import Header from '@/shared/components/header';
import Tag from '@/shared/components/Tag';
import { SAMPLE_STORIES } from '@/shared/constants/sampleStories';

const WorldDetailPage = () => {
  const { worldId } = useParams();
  const story = SAMPLE_STORIES.find(({ id }) => id === worldId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [worldId]);

  return (
    <>
      <Header variant="brand_title" backTo="/worlds" />
      <main lang="ko">
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
            <div className="space-y-2 px-5 py-5">
              <Tag variant="metadata">{story.genre}</Tag>
              <h1 className="text-title-semibold-l">{story.title}</h1>
              <p className="text-body-regular-m text-gray-500">{story.author}</p>
              <p className="text-body-medium-l">{story.description}</p>
            </div>
          </>
        ) : (
          <h1 className="p-5 text-title-semibold-m">세계관을 찾을 수 없어요.</h1>
        )}
      </main>
    </>
  );
};

export default WorldDetailPage;
