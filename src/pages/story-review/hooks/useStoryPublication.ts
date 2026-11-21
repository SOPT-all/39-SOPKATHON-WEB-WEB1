import { useEffect, useRef, useState } from 'react';
import { isAxiosError, isCancel } from 'axios';

import { publishStory, validatePublication } from '@/pages/story-review/apis/publishStory';
import type { RecordedStoryDraft } from '@/shared/types/storyDraft';
import {
  completeStoryPublication,
  getStoryPublication,
  setStoryDraft,
  startStoryPublication,
} from '@/shared/utils/storyDraft';

export default function useStoryPublication() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLocked, setIsLocked] = useState(() => Boolean(getStoryPublication()));
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const abort = () => requestRef.current?.abort();
    window.addEventListener('pagehide', abort);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('pagehide', abort);
      abort();
    };
  }, []);

  const publish = async (draft: RecordedStoryDraft) => {
    if (requestRef.current) return null;
    const snapshot = getStoryPublication();
    const validationError = validatePublication(snapshot?.draft ?? draft);
    setError(validationError);
    if (validationError) return null;
    const publication = startStoryPublication(draft);
    setIsLocked(true);
    setStoryDraft(publication.draft);
    if (publication.storyId !== null) return publication.storyId;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsPublishing(true);
    try {
      const { storyId } = await publishStory(publication.draft, controller.signal);
      completeStoryPublication(publication.draft.recordUuid, storyId);
      return controller.signal.aborted ? null : storyId;
    } catch (cause) {
      if (!mountedRef.current || controller.signal.aborted || isCancel(cause)) return null;
      setError(
        isAxiosError(cause) && cause.response?.status === 409
          ? '등록을 처리 중이거나 이미 등록된 내용과 달라요. 잠시 후 같은 내용으로 다시 확인해주세요. 계속되면 새로 녹음해주세요.'
          : '등록 결과를 확인하지 못했어요. 같은 내용으로 다시 시도해주세요.',
      );
      return null;
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (mountedRef.current) setIsPublishing(false);
    }
  };

  return { publish, isPublishing, isLocked, error };
}
