import childIcon from '@/shared/assets/svg/icon-role-child.svg';
import seniorIcon from '@/shared/assets/svg/icon-role-elder.svg';
import { cn } from '@/shared/utils/cn';

interface BaseCardProps {
  title: string;
  className?: string;
}

interface RoleCardProps extends BaseCardProps {
  variant: 'role';
  role: 'senior' | 'child';
  label: string;
  description: string;
  onClick?: () => void;
}

interface StoryRolesCardProps extends BaseCardProps {
  variant: 'storyRoles';
  entries: readonly { label: string; description: string }[];
}

const Card = (props: RoleCardProps | StoryRolesCardProps) => {
  const { title, className } = props;
  const baseClass = 'w-full max-w-[335px] font-pretendard';

  if (props.variant === 'role') {
    const { label, description, role, onClick } = props;
    const Root = onClick ? 'button' : 'div';

    return (
      <Root
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={cn(
          baseClass,
          'flex flex-col items-start gap-2 rounded-3xl border border-primary-green-500 bg-primary-green-50 pt-4 pr-[18px] pb-5 pl-5 text-left shadow-[0_4px_4px_rgba(0,0,0,0.03)]',
          onClick && 'cursor-pointer',
          className,
        )}
      >
        <span className="rounded-full bg-white px-2 py-1 text-body-medium-s text-gray-600">
          {label}
        </span>
        <span className="flex w-full items-center gap-3">
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-primary-green-500 bg-white">
            <img src={role === 'senior' ? seniorIcon : childIcon} alt="" width={40} height={40} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-title-semibold-l text-gray-900">{title}</span>
            <span className="pr-0.5 text-body-medium-l text-gray-500">{description}</span>
          </span>
        </span>
      </Root>
    );
  }

  return (
    <section className={cn(baseClass, 'space-y-2 rounded-md bg-gray-50 p-3.5', className)}>
      <h2 className="text-body-medium-l text-gray-900">{title}</h2>
      <dl className="space-y-2">
        {props.entries.map(({ label, description }) => (
          <div key={label} className="space-y-1">
            <dt className="text-body-medium-s text-gray-600">{label}</dt>
            <dd className="text-body-medium-m text-gray-900">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Card;
