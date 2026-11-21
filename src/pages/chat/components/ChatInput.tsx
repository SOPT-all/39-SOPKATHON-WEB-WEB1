import { type FormEvent, useEffect, useRef } from 'react';
import iconAdd from '@/shared/assets/svg/icon-add.svg';
import iconArrowUp from '@/shared/assets/svg/icon-arrow-up.svg';
import iconArrowUpDisabled from '@/shared/assets/svg/icon-arrow-up-disabled.svg';
import iconEmotionHappy from '@/shared/assets/svg/icon-emotion-happy.svg';
import { cn } from '@/shared/utils/cn';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isRewrite: boolean;
  disabled: boolean;
}

function ChatInput({ value, onChange, onSubmit, isRewrite, disabled }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canSubmit = !disabled && value.trim().length > 0;

  // 교정 후 보낸 문장이 다시 채워지면 커서를 문장 끝에 둡니다.
  useEffect(() => {
    const input = inputRef.current;
    if (!isRewrite || !input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, [isRewrite]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 justify-center px-[6px] pt-[10px] pb-[max(10px,env(safe-area-inset-bottom))]"
    >
      <div className="flex w-full max-w-[350px] items-center gap-3 rounded-full bg-[#f5f6f8] pl-[6px]">
        {/* 명세: +, 이모지 버튼은 보이기만 하고 동작하지 않습니다. */}
        <button
          type="button"
          aria-label="추가"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white"
        >
          <img src={iconAdd} alt="" className="size-6" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-3 pr-3">
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            enterKeyHint="send"
            placeholder={
              isRewrite ? '고친 문장을 다시 입력해 줘!' : '네 생각을 구체적으로 적어 봐!'
            }
            className={cn(
              "min-w-0 flex-1 bg-transparent py-[14px] font-['Noto_Sans_KR'] text-[14px] leading-[1.3] tracking-[-0.3px] text-[#0a0a0a] caret-[#004ac6] outline-none",
              isRewrite ? 'placeholder:text-[#0a0a0a]' : 'placeholder:text-[#767676]',
            )}
          />
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label="이모지">
              <img src={iconEmotionHappy} alt="" className="size-6" />
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              // 버튼을 눌러도 포커스가 입력칸에 남아 커서와 키보드가 유지되게 합니다.
              onPointerDown={(event) => event.preventDefault()}
              aria-label="보내기"
              className={cn(
                'size-6 overflow-hidden rounded-[19px]',
                canSubmit ? 'bg-[#0a0a0a]' : 'bg-[#a5a5a5]',
              )}
            >
              <img src={canSubmit ? iconArrowUp : iconArrowUpDisabled} alt="" className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ChatInput;
