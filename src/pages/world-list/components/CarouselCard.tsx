import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useHorizontalDrag } from '@/pages/world-list/hooks/useHorizontalDrag';
import { cn } from '@/shared/utils/cn';

const AUTO_PLAY_INTERVAL_MS = 3500;
const SCROLL_SETTLE_MS = 150;

interface CarouselCardProps {
  stories: readonly { storyId: number; title: string; imageUrl: string }[];
  labelledBy: string;
}

const getSlideOffset = (carousel: HTMLUListElement, card: HTMLElement) =>
  card.offsetLeft + (card.offsetWidth - carousel.clientWidth) / 2;

const getCenteredSlide = (carousel: HTMLUListElement) => {
  const [first, second] = carousel.children;
  if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) return 0;

  const step = second.offsetLeft - first.offsetLeft;
  const nearest = Math.round((carousel.scrollLeft - getSlideOffset(carousel, first)) / step);
  return Math.max(0, Math.min(carousel.children.length - 1, nearest));
};

const CarouselCard = ({ stories, labelledBy }: CarouselCardProps) => {
  const carouselRef = useRef<HTMLUListElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const dragHandlers = useHorizontalDrag<HTMLUListElement>();
  const count = stories.length;
  const edgeCount = count > 1 ? 2 : 0;
  const initialIndex = Math.floor(count / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const carousel = carouselRef.current;
    const initialCard = carousel?.children.item(edgeCount + initialIndex);
    if (!(initialCard instanceof HTMLElement) || !carousel) return;

    carousel.scrollLeft = getSlideOffset(carousel, initialCard);
    return () => window.clearTimeout(settleTimer.current);
  }, [edgeCount, initialIndex]);

  useEffect(() => {
    if (count < 2) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverAvailable = window.matchMedia('(hover: hover)');
    const timer = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel || document.hidden || motionPreference.matches) return;
      if (carousel.dataset.dragging || carousel.matches(':focus-within')) return;
      if (hoverAvailable.matches && carousel.matches(':hover')) return;

      const card = carousel.children.item(getCenteredSlide(carousel) + 1);
      if (!(card instanceof HTMLElement)) return;

      carousel.scrollTo({
        left: getSlideOffset(carousel, card),
        behavior: 'smooth',
      });
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, count]);

  const handleScroll = (carousel: HTMLUListElement) => {
    if (count < 2) return;

    const index = (getCenteredSlide(carousel) - edgeCount + count) % count;
    setActiveIndex(index);
    window.clearTimeout(settleTimer.current);

    const settle = () => {
      if (carousel.dataset.dragging) {
        settleTimer.current = window.setTimeout(settle, SCROLL_SETTLE_MS);
        return;
      }

      const position = getCenteredSlide(carousel);
      if (position >= edgeCount && position < edgeCount + count) return;

      // 같은 표지의 원본 위치로 옮겨 다음 스크롤에서도 양옆에 카드가 이어지게 합니다.
      const originalPosition = edgeCount + ((position - edgeCount + count) % count);
      const original = carousel.children.item(originalPosition);
      if (original instanceof HTMLElement) carousel.scrollLeft = getSlideOffset(carousel, original);
    };

    settleTimer.current = window.setTimeout(settle, SCROLL_SETTLE_MS);
  };

  return (
    <ul
      {...dragHandlers}
      ref={carouselRef}
      aria-labelledby={labelledBy}
      tabIndex={0}
      onScroll={({ currentTarget }) => handleScroll(currentTarget)}
      className="relative flex snap-x snap-mandatory [scrollbar-width:none] items-center gap-1 overflow-x-auto px-[max(0px,calc((100%_-_243px)/2))] pb-1 select-none data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none"
    >
      {Array.from({ length: count + edgeCount * 2 }, (_, position) => {
        const index = (position - edgeCount + count) % count;
        const { storyId, title, imageUrl } = stories[index];
        const isClone = position < edgeCount || position >= edgeCount + count;

        return (
          <li
            key={`${position}-${storyId}`}
            aria-hidden={isClone || undefined}
            className="h-[348px] w-[243px] shrink-0 snap-center"
          >
            <Link
              to={`/worlds/${storyId}`}
              tabIndex={isClone ? -1 : undefined}
              className={cn(
                'block size-full rounded-2xl bg-[#e3e3e3] transition-[scale,box-shadow] duration-300 motion-reduce:transition-none',
                index === activeIndex ? 'shadow-[0_4px_4px_rgba(0,0,0,0.25)]' : 'scale-[0.905]',
              )}
            >
              <img src={imageUrl} alt={title} className="size-full rounded-2xl object-cover" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CarouselCard;
