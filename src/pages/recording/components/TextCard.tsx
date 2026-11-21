import { cn } from '@/shared/utils/cn';

const MOCK_QUESTIONS = [
  '학교에서 겪었던 무서운 일이 있나요?',
  '학창 시절 첫사랑의 추억이 있나요?',
  '친구들과 벌였던 잊지 못할 승부가 있나요?',
];

type TextCardProps = {
  questions?: readonly string[];
  className?: string;
};

function TextCard({ questions = MOCK_QUESTIONS, className }: TextCardProps) {
  return (
    <section
      aria-label="추억을 떠올리는 AI 질문"
      className={cn(
        "flex w-[335px] max-w-full flex-col gap-4 overflow-hidden rounded-3xl bg-linear-to-b from-[#ebffde] to-white px-5 pt-5 pb-16 font-['Pretendard',sans-serif] leading-[1.3] font-medium wrap-break-word",
        className,
      )}
    >
      <h2 className="text-xs leading-[1.3] text-[#767676]">어떤 추억이 떠오르시나요?</h2>
      <ul className="flex flex-col gap-2 text-base leading-[1.3] text-[#434343]">
        {questions.map((question) => (
          <li key={question}>· {question}</li>
        ))}
      </ul>
    </section>
  );
}

export default TextCard;
