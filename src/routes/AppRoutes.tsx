import { Route, Routes } from 'react-router';
import HeaderPreviewPage from '@/pages/header-preview/HeaderPreviewPage';
import HomePage from '@/pages/home/HomePage';
import RecordingPage from '@/pages/recording/RecordingPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recording" element={<RecordingPage />} />
      {import.meta.env.DEV && <Route path="/header-preview" element={<HeaderPreviewPage />} />}
      <Route path="*" element={<main>페이지를 찾을 수 없습니다.</main>} />
    </Routes>
  );
}

export default AppRoutes;
