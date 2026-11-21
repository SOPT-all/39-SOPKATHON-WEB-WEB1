import type { Correction, Rewrite } from '@/pages/chat/types/correction';
import { directionJosa, quoteJosa, topicJosa } from '@/pages/chat/utils/josa';

interface CorrectionCardProps {
  correction: Correction;
}

function Highlight({ children }: { children: string }) {
  return <span className="text-primary-green-900">‘{children}’</span>;
}

// 예: ‘개도’는 ‘걔도’로, ‘있어줄께’는 ‘있어줄게’로 써야 해.
function SpellingSentence({ spellings }: { spellings: Rewrite[] }) {
  return (
    <>
      {spellings.map(({ before, after }, index) => (
        <span key={`${before}-${index}`}>
          {index > 0 && ', '}
          <Highlight>{before}</Highlight>
          {topicJosa(before)} <Highlight>{after}</Highlight>
          {directionJosa(after)}
        </span>
      ))}{' '}
      써야 해.
    </>
  );
}

// 예: 또 ‘그냥 편지 줘 봐!’ 대신 ‘망설이지 말고 편지를 건네 봐!’라고 표현하면 더 자연스러워.
function SuggestionSentence({
  suggestion,
  hasSpelling,
}: {
  suggestion: Rewrite;
  hasSpelling: boolean;
}) {
  return (
    <>
      {hasSpelling && '또 '}
      <Highlight>{suggestion.before}</Highlight> 대신 <Highlight>{suggestion.after}</Highlight>
      {quoteJosa(suggestion.after)} 표현하면 더 자연스러워.
    </>
  );
}

function CorrectionCard({ correction }: CorrectionCardProps) {
  const { spellings, suggestion } = correction;
  const hasSpelling = spellings.length > 0;

  return (
    <section className="w-[274px]">
      <h2 className="flex h-10 items-center justify-center rounded-t-2xl border border-primary-green-500 bg-primary-green-500 font-noto text-body-regular-m tracking-[-0.3px] text-gray-900">
        문장을 조금만 고쳐 볼까?
      </h2>
      <div className="rounded-b-2xl border-x border-b border-primary-green-200 bg-gray-50 px-3 py-3 font-pretendard text-body-regular-s text-gray-600">
        <p>
          {hasSpelling && <SpellingSentence spellings={spellings} />}
          {hasSpelling && suggestion && <br />}
          {suggestion && <SuggestionSentence suggestion={suggestion} hasSpelling={hasSpelling} />}
        </p>
        <p className="mt-[1.3em]">이제 네가 쓴 문장을 다시 고쳐서 보내 줘!</p>
      </div>
    </section>
  );
}

export default CorrectionCard;
