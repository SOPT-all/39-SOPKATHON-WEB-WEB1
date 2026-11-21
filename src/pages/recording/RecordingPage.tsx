import RecordingPrompt from '@/pages/recording/components/RecordingPrompt';
import TextCard from '@/pages/recording/components/TextCard';
import RecordingTranscript from '@/pages/recording/components/RecordingTranscript';

const MOCK_TRANSCRIPT =
  '우리 반에 영철이라는 남학생이 있었어. 공부도 잘하고 친구들한테도 친절해서 인기가 많았지. 나도 그 애를 좋아했는데, 막상 마주치면 말 한마디 제대로 못 했어.\n\n그때 학교 끝나고 집에 가려는데 갑자기 비가 억수같이 쏟아지는 거야. 우산도 없어서 처마 밑에 서 있었는데, 영철이가 다가오더니 자기 우산을 내 손에 쥐여주더라고.';

function RecordingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-8 px-5 py-10">
      <RecordingPrompt />
      <RecordingTranscript text={MOCK_TRANSCRIPT} />
      <TextCard />
    </main>
  );
}

export default RecordingPage;
