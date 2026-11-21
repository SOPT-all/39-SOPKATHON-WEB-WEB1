import { Link } from 'react-router';
import { cn } from '@/shared/utils/cn';

interface StoryListItemProps {
  title: string;
  author?: string;
  coverUrl?: string;
  to?: string;
  className?: string;
}

const StoryListItem = ({ title, author, coverUrl, to, className }: StoryListItemProps) => {
  const layout = 'flex flex-col gap-1';
  const content = (
    <>
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          width={140}
          height={210}
          className="aspect-[2/3] w-full object-cover"
        />
      )}
      <div className="flex flex-col gap-0.5">
        <p className="truncate text-body-medium-l text-gray-900">{title}</p>
        {author && <p className="truncate text-body-regular-m text-gray-500">{author}</p>}
      </div>
    </>
  );

  return (
    <li className={cn('w-full max-w-[140px] min-w-0', className)}>
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

export default StoryListItem;
