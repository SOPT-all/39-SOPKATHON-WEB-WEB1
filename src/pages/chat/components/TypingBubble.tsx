import './typingDot.css';

// 피그마 로딩 점(4개, 첫 점만 작게 그려짐)을 순서대로 작아졌다 커지는 애니메이션으로 구현합니다.
const DOT_DELAYS = ['0s', '0.15s', '0.3s', '0.45s'];

function TypingBubble() {
  return (
    <div
      className="flex h-[34px] w-fit items-end gap-[2px] rounded-full px-[14px] pt-[15px] pb-[15px]"
      aria-label="이야기를 이어 쓰는 중"
    >
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          className="size-1 origin-bottom animate-[typing-dot_1.2s_ease-in-out_infinite] rounded-full bg-[#52733c]"
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  );
}

export default TypingBubble;
