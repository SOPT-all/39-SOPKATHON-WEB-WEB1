import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { isAxiosError, isCancel } from 'axios';

import { createStoryDraft, validateTranscript } from '@/shared/apis/storyDraft';
import { getRecordedTranscript } from '@/shared/utils/recordedTranscript';
import { setStoryDraft } from '@/shared/utils/storyDraft';

import BarRecordControlsBottom from '@/pages/recording/components/BarRecordControlsBottom';
import BgRecordingCircles from '@/shared/components/BgRecordingCircles';
import RecordingPrompt from '@/pages/recording/components/RecordingPrompt';
import RecordingTooltip from '@/pages/recording/components/RecordingTooltip';
import TextCard from '@/pages/recording/components/TextCard';
import RecordingTranscript from '@/pages/recording/components/RecordingTranscript';
import StoryGenerationLoadingDialog from '@/pages/recording/components/StoryGenerationLoadingDialog';
import useRecordingTimer from '@/pages/recording/hooks/useRecordingTimer';
import useMicrophoneRecording from '@/pages/recording/hooks/useMicrophoneRecording';
import useSpeechRecognition from '@/pages/recording/hooks/useSpeechRecognition';
import Button from '@/shared/components/Button';
import Header from '@/shared/components/header';
import { setRecordedAudio } from '@/shared/utils/recordedAudio';
import { cn } from '@/shared/utils/cn';
import { setRecordedTranscript } from '@/shared/utils/recordedTranscript';

const MOCK_FOLLOW_UP_AFTER_SECONDS = 15;
const MOCK_FOLLOW_UP_QUESTIONS = ['영철이와 특별히 기억에 남는 일이 있었나요?'];

function separateFollowUpParagraph(text: string, previousText: string) {
  if (!previousText || !text.startsWith(previousText)) return text;
  const response = text.slice(previousText.length).trim();
  return response ? `${previousText}\n\n${response}` : text;
}

function RecordingPage() {
  const tooltipId = useId();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const followTranscriptRef = useRef(true);
  const finishingRef = useRef(false);
  const mountedRef = useRef(true);
  const followUpShownRef = useRef(false);
  const followUpTextRef = useRef('');
  const [followUpDismissed, setFollowUpDismissed] = useState(false);
  const [paragraphPrefix, setParagraphPrefix] = useState('');
  const handleRecognized = useCallback((text: string) => {
    if (followUpShownRef.current && text.trim() !== followUpTextRef.current) {
      setFollowUpDismissed(true);
      setParagraphPrefix(followUpTextRef.current);
    }
  }, []);
  const {
    finalText,
    interimText,
    error: recognitionError,
    notice: recognitionNotice,
    startRecognition,
    stopRecognition,
    resetRecognition,
    cancelRecognition,
  } = useSpeechRecognition(handleRecognized);
  const { status, error, startRecording, stopRecording } = useMicrophoneRecording();
  const isRecording = status === 'recording';
  const hasStarted = isRecording || status === 'stopping' || isFinishing || isGenerating;
  const { elapsedSeconds, resetTimer } = useRecordingTimer(isRecording);
  const hasFollowUp = isRecording && elapsedSeconds >= MOCK_FOLLOW_UP_AFTER_SECONDS;
  const isCompactHeader = hasStarted && elapsedSeconds >= MOCK_FOLLOW_UP_AFTER_SECONDS;
  const showFollowUp = hasFollowUp && !followUpDismissed;

  useEffect(() => {
    if (showFollowUp && !followUpShownRef.current) {
      followUpTextRef.current = [finalText, interimText]
        .map((text) => text.trim())
        .filter(Boolean)
        .join(' ');
      followUpShownRef.current = true;
    }
  }, [showFollowUp, finalText, interimText]);

  useEffect(() => {
    mountedRef.current = true;
    const abortRequest = () => requestRef.current?.abort();
    window.addEventListener('pagehide', abortRequest);
    return () => {
      window.removeEventListener('pagehide', abortRequest);
      mountedRef.current = false;
      requestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (status === 'idle' && !isFinishing) cancelRecognition();
  }, [status, isFinishing, cancelRecognition]);

  useEffect(() => {
    const main = mainRef.current;
    if (main && followTranscriptRef.current) main.scrollTop = main.scrollHeight;
  }, [finalText, interimText, showFollowUp]);

  const generateStory = async (transcript: string) => {
    if (requestRef.current) return;
    const validationError = validateTranscript(transcript);
    setGenerationError(validationError);
    setCanRetry(false);
    if (validationError) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsGenerating(true);
    try {
      const draft = await createStoryDraft({ transcript }, controller.signal);
      if (!mountedRef.current || controller.signal.aborted) return;
      setStoryDraft({ ...draft, transcript });
      void navigate('/story-review');
    } catch (cause) {
      if (!mountedRef.current || isCancel(cause)) return;
      setGenerationError(
        isAxiosError(cause) && cause.response?.status === 503
          ? '지금은 AI를 사용할 수 없어요. 잠시 후 다시 시도해주세요.'
          : '이야기를 만들지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.',
      );
      setCanRetry(true);
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (mountedRef.current) setIsGenerating(false);
    }
  };

  const handleStartRecording = () => {
    setGenerationError(null);
    setCanRetry(false);
    setStoryDraft(null);
    followUpShownRef.current = false;
    setFollowUpDismissed(false);
    setParagraphPrefix('');
    resetTimer();
    setRecordedAudio(null);
    setRecordedTranscript('');
    resetRecognition();
    followTranscriptRef.current = true;
    void startRecording(startRecognition);
  };

  const handleStopRecording = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    const [audio, text] = await Promise.all([stopRecording(), stopRecognition()]);
    if (!mountedRef.current) return;
    finishingRef.current = false;
    setIsFinishing(false);
    if (!audio) return;
    setRecordedAudio(audio);
    setRecordedTranscript(text);
    await generateStory(text);
  };

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-white">
      <BgRecordingCircles className="absolute -bottom-[371px] left-1/2 -z-10 -translate-x-1/2" />

      <div className="shrink-0 bg-white pt-[env(safe-area-inset-top)]">
        <Header backTo="/" />
      </div>

      <main
        ref={mainRef}
        onScroll={(event) => {
          const main = event.currentTarget;
          followTranscriptRef.current = main.scrollHeight - main.scrollTop - main.clientHeight < 48;
        }}
        aria-label="추억 녹음"
        tabIndex={0}
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 transition-[padding-top] duration-700 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-green-700 motion-reduce:transition-none',
          isCompactHeader ? 'pt-5' : 'pt-[66px]',
          isGenerating && 'overflow-hidden',
        )}
      >
        <RecordingPrompt
          compact={isCompactHeader}
          message={hasStarted ? '녹음이 시작됐어요.' : '녹음이 준비됐어요.'}
        />
        {generationError && (
          <div role="alert" className="mt-4 text-body-medium-m text-gray-700">
            <p>{generationError}</p>
            {canRetry && (
              <button
                type="button"
                onClick={() => void generateStory(getRecordedTranscript())}
                disabled={isGenerating}
                className="mt-2 cursor-pointer underline underline-offset-2"
              >
                이야기 생성 다시 시도
              </button>
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-body-medium-m text-gray-700">
            {error}
          </p>
        )}
        {recognitionError && (
          <div role="alert" className="mt-4 text-body-medium-m text-gray-700">
            <p>{recognitionError}</p>
            {isRecording && (
              <button
                type="button"
                onClick={() => startRecognition()}
                className="mt-2 cursor-pointer underline underline-offset-2"
              >
                음성 인식 다시 시도
              </button>
            )}
          </div>
        )}
        <div className="mt-6">
          <div
            aria-hidden={hasStarted}
            inert={hasStarted}
            className={cn(
              'grid origin-top transition-[grid-template-rows,opacity,transform,margin] duration-500 ease-out motion-reduce:transition-none',
              hasStarted
                ? 'mt-0 translate-y-6 grid-rows-[0fr] opacity-0'
                : 'mt-4 translate-y-0 grid-rows-[1fr] opacity-100',
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <TextCard />
            </div>
          </div>
          {hasStarted && (
            <div className="transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none starting:translate-y-2 starting:opacity-0">
              {finalText || interimText ? (
                <RecordingTranscript
                  text={separateFollowUpParagraph(finalText, paragraphPrefix)}
                  interimText={interimText}
                  className="text-body-medium-l"
                />
              ) : !recognitionError && recognitionNotice ? (
                <p role="status" className="text-right text-body-medium-m text-gray-500">
                  {recognitionNotice}
                </p>
              ) : null}
            </div>
          )}
          {hasFollowUp && (
            <div
              role="status"
              aria-label="추가 질문"
              aria-hidden={!showFollowUp}
              inert={!showFollowUp}
              className={cn(
                'grid transition-[grid-template-rows,opacity,transform,margin] duration-700 ease-out motion-reduce:transition-none starting:translate-y-6 starting:opacity-0',
                showFollowUp
                  ? 'mt-10 translate-y-0 grid-rows-[1fr] opacity-100'
                  : 'mt-0 translate-y-6 grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <TextCard
                  title="조금 더 자세히 이야기해 주세요."
                  questions={MOCK_FOLLOW_UP_QUESTIONS}
                  showBullets={false}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="relative flex shrink-0 flex-col items-center pb-[env(safe-area-inset-bottom)]">
        {hasStarted ? (
          <>
            <RecordingTooltip id={tooltipId} className="pointer-events-none -mb-0.5" />
            <BarRecordControlsBottom
              elapsedSeconds={elapsedSeconds}
              isRecording={isRecording}
              buttonProps={{
                'aria-label': '녹음 끝내기',
                'aria-describedby': tooltipId,
                onClick: handleStopRecording,
                disabled: status === 'stopping' || isFinishing || isGenerating,
                'aria-busy': status === 'stopping' || isFinishing || isGenerating,
              }}
            />
          </>
        ) : (
          <div className="w-full bg-white px-5 pt-2.5 pb-5">
            <Button
              variant="confirm"
              onClick={handleStartRecording}
              disabled={status === 'requesting'}
              aria-busy={status === 'requesting'}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-green-900 disabled:cursor-wait disabled:opacity-50"
            >
              {status === 'requesting' ? '마이크 권한 확인 중…' : '녹음 시작하기'}
            </Button>
          </div>
        )}
      </div>
      {isGenerating && <StoryGenerationLoadingDialog />}
    </div>
  );
}

export default RecordingPage;
