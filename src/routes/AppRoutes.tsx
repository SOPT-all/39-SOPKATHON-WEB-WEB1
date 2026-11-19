import { Route, Routes } from 'react-router';
import HomePage from '@/pages/home/HomePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<main>페이지를 찾을 수 없습니다.</main>} />
    </Routes>
  );
}

export default AppRoutes;
