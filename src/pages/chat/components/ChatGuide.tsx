interface ChatGuideProps {
  text: string;
}

function ChatGuide({ text }: ChatGuideProps) {
  return (
    <p className="rounded-[8px] bg-[#f5f5f5] px-5 py-[15px] font-pretendard text-[14px] leading-[1.3] break-keep text-[#52733c]">
      {text}
    </p>
  );
}

export default ChatGuide;
