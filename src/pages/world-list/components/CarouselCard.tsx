import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import coverPlaceholder from '@/shared/assets/images/img-story-cover-placeholder.png';
import { cn } from '@/shared/utils/cn';

interface CarouselCardProps {
  stories: readonly { id: string; title: string }[];
  labelledBy: string;
}

const CarouselCard = ({ stories, labelledBy }: CarouselCardProps) => {
  const carouselRef = useRef<HTMLUListElement>(null);
  const centerIndex = Math.floor(stories.length / 2);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.scrollLeft = (carousel.scrollWidth - carousel.clientWidth) / 2;
    }
  }, []);

  return (
    <ul
      ref={carouselRef}
      aria-labelledby={labelledBy}
      tabIndex={0}
      className="flex snap-x snap-mandatory [scrollbar-width:none] items-center gap-[15px] overflow-x-auto pb-1"
    >
      {stories.map(({ id, title }, index) => (
        <li
          key={id}
          className={cn(
            'shrink-0 snap-center rounded-2xl bg-[#e3e3e3]',
            index === centerIndex
              ? 'h-[348px] w-[243px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
              : 'h-[315px] w-[220px]',
          )}
        >
          <Link to={`/worlds/${id}`} className="block size-full rounded-2xl">
            <img
              src={coverPlaceholder}
              alt={title}
              className="size-full rounded-2xl object-contain opacity-20"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CarouselCard;
