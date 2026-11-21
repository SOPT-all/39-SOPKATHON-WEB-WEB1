import { useState } from 'react';
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
      className="relative flex min-h-dvh flex-col justify-between gap-8 px-5 pt-[160px] pb-10 font-pretendard leading-[1.3] text-[#0a0a0a]"
    >
      <div className="space-y-4">
        <h1 className="text-[36px] font-semibold">
          오늘은 <br />
          무엇을 하고 싶나요?
        </h1>
        <p className="text-xl/[1.3] font-medium text-[#767676]">
          두 가지 방법으로 이야기를 <br />
          시작할 수 있어요.
        </p>
      </div>

      <ul className="space-y-4">
        {ROLE_OPTIONS.map(({ label, title, description, icon, unavailableMessage }) => (
          <li key={title}>
            <button
              type="button"
              onClick={() => setStatus(unavailableMessage)}
              className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border border-[#a9df86] bg-[#ebffde] px-5 pt-4 pb-5 text-left shadow-[0_4px_4px_rgba(0,0,0,0.03)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#575757] active:bg-[#ebffde]/75"
            >
              <span className="rounded-full bg-white px-2 py-1 text-[12px] font-medium text-[#575757]">
                {label}
              </span>
              <span className="flex w-full items-center gap-3">
                <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#a9df86] bg-white">
                  <img src={icon} alt="" width={40} height={40} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[24px] font-semibold">{title}</span>
                  <span className="text-base/[1.3] font-medium text-[#767676]">{description}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p role="status" className="absolute right-5 bottom-2 left-5 text-sm text-[#575757]">
        {status}
      </p>
    </main>
  );
}

export default HomePage;
