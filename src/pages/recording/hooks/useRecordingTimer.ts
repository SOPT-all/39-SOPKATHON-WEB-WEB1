import { useEffect, useState } from 'react';

function useRecordingTimer(isRecording: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) return;

    let lastTickAt = Date.now();
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickAt) / 1000);
      if (elapsed > 0) {
        setElapsedSeconds((previous) => previous + elapsed);
        lastTickAt += elapsed * 1000;
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  const resetTimer = () => setElapsedSeconds(0);

  return { elapsedSeconds, resetTimer };
}

export default useRecordingTimer;
