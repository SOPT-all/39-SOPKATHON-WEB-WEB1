import './typingDot.css';

// 로딩 점 4개가 순서대로 작아졌다 커지는 애니메이션입니다.
const DOT_DELAYS = ['0s', '0.15s', '0.3s', '0.45s'];

function TypingBubble() {
  return (
    <div className="flex pl-[10px]" aria-label="이야기를 이어 쓰는 중">
      <div className="flex items-end gap-[2px] rounded-[8px] bg-gray-100 px-5 py-[14px]">
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="size-1 origin-bottom animate-[typing-dot_1.2s_ease-in-out_infinite] rounded-full bg-gray-900"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}

export default TypingBubble;
