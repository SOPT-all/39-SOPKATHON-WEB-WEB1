import Tag from '@/shared/components/Tag';

interface StoryDetailSummaryProps {
  genre: string;
  setting: string;
  title: string;
  description: string;
}

const StoryDetailSummary = ({ genre, setting, title, description }: StoryDetailSummaryProps) => (
  <header>
    <div className="space-y-2">
      <div className="flex gap-1">
        <Tag variant="metadata" className="shrink-0">
          {genre}
        </Tag>
        {setting && (
          <Tag variant="metadata" className="max-w-[70%] min-w-0" title={setting}>
            <span className="truncate">{setting}</span>
          </Tag>
        )}
      </div>
      <h1 className="text-title-semibold-m">{title}</h1>
      <p className="line-clamp-2 text-body-regular-m text-gray-500">{description}</p>
    </div>
    <hr className="mt-4 mb-3 border-gray-200" />
  </header>
);

export default StoryDetailSummary;
