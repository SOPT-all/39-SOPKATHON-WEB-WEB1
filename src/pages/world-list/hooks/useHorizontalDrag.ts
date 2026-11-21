import { useRef, type HTMLAttributes, type PointerEvent } from 'react';

const DRAG_THRESHOLD = 5;

export function useHorizontalDrag<T extends HTMLElement>(): HTMLAttributes<T> {
  const drag = useRef<{ pointerId: number; x: number; scrollLeft: number } | null>(null);
  const didDrag = useRef(false);

  const finishDrag = ({ currentTarget, pointerId }: PointerEvent<T>) => {
    if (drag.current?.pointerId !== pointerId) return;

    drag.current = null;
    delete currentTarget.dataset.dragging;
  };

  return {
    onPointerDown: ({ currentTarget, pointerType, button, pointerId, clientX }) => {
      didDrag.current = false;
      if (pointerType !== 'mouse' || button !== 0) return;
      if (currentTarget.scrollWidth <= currentTarget.clientWidth) return;

      drag.current = { pointerId, x: clientX, scrollLeft: currentTarget.scrollLeft };
    },
    onPointerMove: ({ currentTarget, pointerId, clientX, buttons }) => {
      const start = drag.current;
      if (!start || start.pointerId !== pointerId || buttons !== 1) return;

      const distance = clientX - start.x;
      if (!didDrag.current && Math.abs(distance) < DRAG_THRESHOLD) return;

      if (!didDrag.current) {
        didDrag.current = true;
        currentTarget.dataset.dragging = 'true';
        currentTarget.setPointerCapture(pointerId);
      }

      currentTarget.scrollLeft = start.scrollLeft - distance;
    },
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onLostPointerCapture: finishDrag,
    onPointerLeave: (event) => {
      if (!didDrag.current) finishDrag(event);
    },
    onDragStart: (event) => event.preventDefault(),
    onClickCapture: (event) => {
      if (!didDrag.current || event.detail === 0) return;

      didDrag.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
