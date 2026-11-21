import { Link } from 'react-router';
import coverPlaceholder from '@/shared/assets/images/img-story-cover-placeholder.png';
import { cn } from '@/shared/utils/cn';

interface StoryListCardProps {
  title: string;
  description: string;
  coverUrl?: string;
  to?: string;
  className?: string;
}

const StoryListCard = ({ title, description, coverUrl, to, className }: StoryListCardProps) => {
  const layout = 'flex gap-2';
  const content = (
    <>
      <div className="size-20 shrink-0 bg-[#e3e3e3]">
        <img
          src={coverUrl || coverPlaceholder}
          alt=""
          width={80}
          height={80}
          className={cn('size-full', coverUrl ? 'object-cover' : 'object-contain opacity-20')}
        />
      </div>
      <div className="flex max-w-[218px] min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-body-medium-l text-gray-900">{title}</p>
        <p className="line-clamp-3 text-body-regular-m text-gray-500">{description}</p>
      </div>
    </>
  );

  return (
    <li className={cn('w-full max-w-[335px] min-w-0', className)}>
      {to ? (
        <Link to={to} className={layout}>
          {content}
        </Link>
      ) : (
        <div className={layout}>{content}</div>
      )}
    </li>
  );
};

export default StoryListCard;
