import { Route, Routes } from 'react-router';
import ChatPage from '@/pages/chat/ChatPage';
import HomePage from '@/pages/home/HomePage';
import RecordingPage from '@/pages/recording/RecordingPage';
import StoryReviewPage from '@/pages/story-review/StoryReviewPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recording" element={<RecordingPage />} />
      <Route path="/story-review" element={<StoryReviewPage />} />
      <Route path="/stories/:worldId" element={<ChatPage />} />
      <Route path="*" element={<main>페이지를 찾을 수 없습니다.</main>} />
    </Routes>
  );
}

export default AppRoutes;
