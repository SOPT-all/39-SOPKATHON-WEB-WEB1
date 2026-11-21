import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router';

import BarRecordControlsBottom from '@/pages/recording/components/BarRecordControlsBottom';
import BgRecordingCircles from '@/pages/recording/components/BgRecordingCircles';
import RecordingPrompt from '@/pages/recording/components/RecordingPrompt';
import RecordingTooltip from '@/pages/recording/components/RecordingTooltip';
import TextCard from '@/pages/recording/components/TextCard';
import RecordingTranscript from '@/pages/recording/components/RecordingTranscript';
import StoryGenerationLoadingDialog from '@/pages/recording/components/StoryGenerationLoadingDialog';
import useRecordingTimer from '@/pages/recording/hooks/useRecordingTimer';
import useMicrophoneRecording from '@/pages/recording/hooks/useMicrophoneRecording';
import Button from '@/shared/components/Button';
import Header from '@/shared/components/header';
import { setRecordedAudio } from '@/shared/utils/recordedAudio';
import { cn } from '@/shared/utils/cn';

// Replace this preview delay with the world-generation API loading state when connected.
const STORY_GENERATION_PREVIEW_DELAY_MS = 1200;

type RecordingPageProps = {
  transcript?: string;
};

function RecordingPage({ transcript = '' }: RecordingPageProps) {
  const tooltipId = useId();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const { status, error, startRecording, stopRecording } = useMicrophoneRecording();
  const isRecording = status === 'recording';
  const hasStarted = isRecording || status === 'stopping' || isGenerating;
  const { elapsedSeconds, resetTimer } = useRecordingTimer(isRecording);

  useEffect(() => {
    if (!isGenerating) return;
    const timeoutId = window.setTimeout(() => {
      void navigate('/story-review');
    }, STORY_GENERATION_PREVIEW_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isGenerating, navigate]);

  const handleStartRecording = () => {
    resetTimer();
    setRecordedAudio(null);
    void startRecording();
  };

  const handleStopRecording = async () => {
    const audio = await stopRecording();
    if (!audio) return;
    setRecordedAudio(audio);
    setIsGenerating(true);
  };

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-white">
      <BgRecordingCircles className="absolute -bottom-[371px] left-1/2 -z-10 -translate-x-1/2" />

      <div className="shrink-0 bg-white pt-[env(safe-area-inset-top)]">
        <Header backTo="/" />
      </div>

      <main
        aria-label="추억 녹음"
        tabIndex={0}
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-[66px] pb-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-green-700',
          isGenerating && 'overflow-hidden',
        )}
      >
        <RecordingPrompt message={hasStarted ? '녹음이 시작됐어요.' : '녹음이 준비됐어요.'} />
        {error && (
          <p role="alert" className="mt-4 text-body-medium-m text-gray-700">
            {error}
          </p>
        )}
        {hasStarted && transcript.trim() ? (
          <RecordingTranscript text={transcript} className="mt-6 text-body-medium-l" />
        ) : (
          <TextCard className="mt-10" />
        )}
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
                disabled: status === 'stopping' || isGenerating,
                'aria-busy': status === 'stopping' || isGenerating,
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
