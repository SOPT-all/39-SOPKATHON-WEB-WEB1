import Tag from '@/shared/components/Tag';

interface StoryDetailSummaryProps {
  genre: string;
  setting: string;
  title: string;
  author: string;
  description: string;
}

const StoryDetailSummary = ({
  genre,
  setting,
  title,
  author,
  description,
}: StoryDetailSummaryProps) => (
  <header>
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        <Tag variant="metadata">{genre}</Tag>
        <Tag variant="metadata">{setting}</Tag>
      </div>
      <h1 className="text-title-semibold-l">{title}</h1>
      <p className="text-body-regular-m text-gray-500">{author}</p>
      <p className="text-body-medium-l">{description}</p>
    </div>
    <hr className="mt-4 mb-3 border-gray-200" />
  </header>
);

export default StoryDetailSummary;
