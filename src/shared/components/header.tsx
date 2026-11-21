import { useNavigate, type To } from 'react-router';
import brandLogo from '@/shared/assets/images/logo-brand.png';
import chevronLeft from '@/shared/assets/svg/icon-chevron-left.svg';
import { cn } from '@/shared/utils/cn';

interface HeaderProps {
  variant?: 'default' | 'story_title' | 'brand_title';
  title?: string;
  backTo?: To;
  className?: string;
}

const Header = ({ variant = 'default', title, backTo, className }: HeaderProps) => {
  const navigate = useNavigate();
  const isBrandTitle = variant === 'brand_title';

  const handleBack = () => {
    if (backTo !== undefined) {
      void navigate(backTo);
      return;
    }

    void navigate(-1);
  };

  return (
    <header
      className={cn(
        'flex h-11 w-full min-w-0 items-center pr-1',
        variant === 'default' && 'bg-linear-to-b from-white to-transparent',
        className,
      )}
    >
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={handleBack}
        className="flex size-11 shrink-0 cursor-pointer items-center pl-1.5"
      >
        <img src={chevronLeft} alt="" width={24} height={24} />
      </button>

      {variant !== 'default' && (
        <div className="flex h-[34px] max-w-[176px] min-w-0 items-center gap-1.5 rounded-full pr-2.5 backdrop-blur-[20px]">
          {isBrandTitle && (
            <img
              src={brandLogo}
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0 rounded-md object-cover"
            />
          )}
          <span
            className={cn(
              'min-w-0 truncate text-[#191f28]',
              isBrandTitle
                ? 'font-["SF_Pro",system-ui,sans-serif] text-[15px]/[22.5px] font-[590]'
                : 'font-pretendard text-xl/[1.3] font-semibold',
            )}
          >
            {title ?? (isBrandTitle ? '옛썰' : null)}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
