import { useState } from 'react';
import RoleCard from '@/pages/home/components/role-card';
import childIcon from '@/shared/assets/svg/icon-role-child.svg';
import elderIcon from '@/shared/assets/svg/icon-role-elder.svg';

const ROLE_OPTIONS = [
  {
    label: '어르신을 위한',
    title: '내 추억 들려주기',
    description: '내가 기억하는 옛날이야기를 목소리로 남겨요.',
    icon: elderIcon,
    unavailableMessage: '녹음 화면은 준비 중이에요.',
  },
  {
    label: '초등학생을 위한',
    title: '이야기 안으로 들어가기',
    description: '세계관을 골라 이야기의 주인공이 되어 봐요.',
    icon: childIcon,
    unavailableMessage: '세계관 목록은 준비 중이에요.',
  },
];

function HomePage() {
  const [status, setStatus] = useState('');

  return (
    <main
      lang="ko"
      className="relative flex min-h-dvh flex-col justify-between gap-8 px-5 pt-[160px] pb-10 text-gray-900"
    >
      <div className="space-y-4">
        <h1 className="text-heading-semibold-s">
          오늘은 <br />
          무엇을 하고 싶나요?
        </h1>
        <p className="text-title-medium-m text-gray-500">
          두 가지 방법으로 이야기를 <br />
          시작할 수 있어요.
        </p>
      </div>

      <ul className="space-y-4">
        {ROLE_OPTIONS.map(({ label, title, description, icon, unavailableMessage }) => (
          <li key={title}>
            <RoleCard
              label={label}
              title={title}
              description={description}
              icon={icon}
              onClick={() => setStatus(unavailableMessage)}
            />
          </li>
        ))}
      </ul>

      <p
        role="status"
        className="absolute right-5 bottom-2 left-5 text-body-regular-m text-gray-600"
      >
        {status}
      </p>
    </main>
  );
}

export default HomePage;
