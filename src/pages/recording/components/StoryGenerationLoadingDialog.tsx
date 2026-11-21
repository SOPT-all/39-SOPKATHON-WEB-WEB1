import { useEffect, useId, useRef } from 'react';

import loaderIcon from '@/shared/assets/svg/icon-story-generation-loader.svg';

function StoryGenerationLoadingDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={messageId}
      aria-modal="true"
      aria-busy="true"
      tabIndex={-1}
      onCancel={(event) => event.preventDefault()}
      className="fixed inset-0 m-auto size-[172px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl border-0 bg-white p-5 outline-none backdrop:bg-gray-900/40"
    >
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <img
          src={loaderIcon}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 motion-safe:animate-spin motion-safe:[animation-duration:1.8s]"
        />
        <p
          id={messageId}
          role="status"
          className="text-center text-body-medium-l whitespace-nowrap text-gray-500"
        >
          추억으로 세계관을
          <br />
          만들고 있어요
        </p>
      </div>
    </dialog>
  );
}

export default StoryGenerationLoadingDialog;
