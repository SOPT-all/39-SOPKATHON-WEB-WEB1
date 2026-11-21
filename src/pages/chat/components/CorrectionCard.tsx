interface CorrectionCardProps {
  text: string;
}

// 서버 피드백에서 ‘ ’ 또는 ' '로 감싼 부분(틀린 말, 고친 말)을 초록색으로 강조합니다.
const QUOTED_PATTERN = /(‘[^’\n]*’|'[^'\n]*')/;

function CorrectionCard({ text }: CorrectionCardProps) {
  return (
    <section className="w-[274px]">
      <h2 className="flex h-10 items-center justify-center rounded-t-2xl border border-primary-green-500 bg-primary-green-500 font-noto text-body-regular-m tracking-[-0.3px] text-gray-900">
        문장을 조금만 고쳐 볼까?
      </h2>
      <div className="rounded-b-2xl border-x border-b border-primary-green-200 bg-gray-50 px-3 py-3 font-pretendard text-body-regular-s text-gray-600">
        <p className="whitespace-pre-line">
          {text.split(QUOTED_PATTERN).map((part, index) =>
            index % 2 === 1 ? (
              <span key={index} className="text-primary-green-900">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </p>
        <p className="mt-[1.3em]">이제 네가 쓴 문장을 다시 고쳐서 보내 줘!</p>
      </div>
    </section>
  );
}

export default CorrectionCard;
