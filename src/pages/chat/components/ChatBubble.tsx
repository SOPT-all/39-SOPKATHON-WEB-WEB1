const textClassName = 'font-noto text-[14px] leading-[1.3] tracking-[-0.3px] whitespace-pre-wrap';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  text: string;
}

function ChatBubble({ role, text }: ChatBubbleProps) {
  if (role === 'ai') {
    return <p className={`${textClassName} text-[#52733c]`}>{text}</p>;
  }

  return (
    <div className="flex justify-end pl-[10px]">
      <p
        className={`${textClassName} max-w-[250px] rounded-2xl border border-[#d6d6d6] px-5 py-[7px] text-[#0a0a0a]`}
      >
        {text}
      </p>
    </div>
  );
}

export default ChatBubble;
