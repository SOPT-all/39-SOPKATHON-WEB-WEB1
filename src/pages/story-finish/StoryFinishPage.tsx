import { Navigate, useLocation, useNavigate } from 'react-router';

import chevronDown from '@/shared/assets/svg/icon-story-chevron-down.svg';
import BgRecordingCircles from '@/shared/components/BgRecordingCircles';
import Button from '@/shared/components/Button';
import Header from '@/shared/components/header';

function getStorySummary(state: unknown) {
  if (!state || typeof state !== 'object' || !('story' in state)) return null;
  const story = state.story;
  if (!story || typeof story !== 'object' || !('title' in story) || !('category' in story))
    return null;
  if (typeof story.title !== 'string' || typeof story.category !== 'string') return null;
  return { title: story.title, category: story.category };
}

function StoryFinishPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const story = getStorySummary(location.state);

  if (!story) return <Navigate to="/story-review" replace />;

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-white">
      <BgRecordingCircles className="absolute -bottom-[371px] left-1/2 -z-10 -translate-x-1/2" />

      <div className="shrink-0 bg-white pt-[env(safe-area-inset-top)]">
        <Header backTo="/story-review" />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-[66px] pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-body-medium-m text-gray-500">내용이 저장됐어요.</p>
          <h1 className="text-title-semibold-l text-gray-900">새로운 세계관이 등록됐어요.</h1>
        </div>

        <section
          aria-label="저장된 세계관"
          className="mt-6 flex items-start justify-between gap-3 rounded-3xl bg-gray-50 p-5"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="text-title-semibold-s wrap-anywhere text-gray-900">{story.title}</h2>
            <p className="text-body-medium-m wrap-anywhere text-gray-500">{story.category}</p>
          </div>
          <img src={chevronDown} alt="" width={20} height={20} className="shrink-0" />
        </section>
      </main>

      <div className="shrink-0 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="px-5 pt-2.5 pb-5">
          <Button
            variant="confirm"
            onClick={() => {
              void navigate('/worlds');
            }}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-green-900"
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StoryFinishPage;
