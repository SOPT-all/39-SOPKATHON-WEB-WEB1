import RecordingButton from '@/pages/recording/components/RecordingButton';

function RecordingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-5 py-10">
      <h1 className="text-xl font-semibold">녹음 버튼 예시</h1>
      <RecordingButton aria-label="녹음 시작" />
    </main>
  );
}

export default RecordingPage;
