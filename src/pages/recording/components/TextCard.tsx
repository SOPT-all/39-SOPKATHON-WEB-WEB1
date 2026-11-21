import { cn } from '@/shared/utils/cn';

const MOCK_QUESTIONS = [
  '학교에서 겪었던 무서운 일이 있나요?',
  '학창 시절 첫사랑의 추억이 있나요?',
  '친구들과 벌였던 잊지 못할 승부가 있나요?',
];

type TextCardProps = {
  title?: string;
  questions?: readonly string[];
  showBullets?: boolean;
  className?: string;
};

function TextCard({
  title = '어떤 추억이 떠오르시나요?',
  questions = MOCK_QUESTIONS,
  showBullets = true,
  className,
}: TextCardProps) {
  return (
    <section
      aria-label="추억을 떠올리는 AI 질문"
      className={cn(
        'flex w-[335px] max-w-full flex-col gap-4 overflow-hidden rounded-3xl bg-linear-to-b from-primary-green-50 to-white px-5 pt-5 pb-16 wrap-break-word',
        className,
      )}
    >
      <h2 className="text-body-medium-s text-gray-500">{title}</h2>
      <ul className="flex flex-col gap-2 text-body-medium-l text-gray-700">
        {questions.map((question) => (
          <li key={question}>
            {showBullets ? '· ' : ''}
            {question}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TextCard;
