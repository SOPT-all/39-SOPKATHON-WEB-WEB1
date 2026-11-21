const textClassName = 'font-noto text-[14px] leading-[1.3] tracking-[-0.3px] whitespace-pre-wrap';

interface ChatBubbleProps {
  role: 'ai' | 'user';
  text: string;
}

function ChatBubble({ role, text }: ChatBubbleProps) {
  if (role === 'ai') {
    return (
      <div className="flex pr-[10px]">
        <p
          className={`${textClassName} min-h-8 max-w-[240px] rounded-2xl bg-gray-100 px-5 py-2 text-gray-900`}
        >
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-end pl-[10px]">
      <p
        className={`${textClassName} max-w-[250px] rounded-2xl border border-gray-300 px-5 py-[7px] text-gray-900`}
      >
        {text}
      </p>
    </div>
  );
}

export default ChatBubble;
