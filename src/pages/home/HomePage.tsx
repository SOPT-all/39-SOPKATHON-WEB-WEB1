import { useNavigate } from 'react-router';
import RoleCard from '@/pages/home/components/role-card';
import childIcon from '@/shared/assets/svg/icon-role-child.svg';
import elderIcon from '@/shared/assets/svg/icon-role-elder.svg';
import Header from '@/shared/components/header';

const ROLE_OPTIONS = [
  {
    label: '어르신을 위한',
    title: '내 추억 들려주기',
    description: '내가 기억하는 옛날이야기를 목소리로 남겨요.',
    icon: elderIcon,
    to: '/recording',
  },
  {
    label: '초등학생을 위한',
    title: '이야기 안으로 들어가기',
    description: '세계관을 골라 이야기의 주인공이 되어 봐요.',
    icon: childIcon,
    to: '/worlds',
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Header className="absolute inset-x-0 top-0" />
      <main
        lang="ko"
        className="flex min-h-dvh flex-col justify-between gap-8 px-5 pt-[160px] pb-10 text-gray-900"
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
          {ROLE_OPTIONS.map(({ label, title, description, icon, to }) => (
            <li key={title}>
              <RoleCard
                label={label}
                title={title}
                description={description}
                icon={icon}
                onClick={() => void navigate(to)}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default HomePage;
