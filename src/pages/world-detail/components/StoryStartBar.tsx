import Button from '@/shared/components/Button';

interface StoryStartBarProps {
  onStart: () => void;
}

const StoryStartBar = ({ onStart }: StoryStartBarProps) => (
  <footer className="sticky bottom-0 mt-auto bg-white px-5 pt-2.5 pb-5">
    <Button variant="confirm" onClick={onStart}>
      이야기 시작하기
    </Button>
  </footer>
);

export default StoryStartBar;
