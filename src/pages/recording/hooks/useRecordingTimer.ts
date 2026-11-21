import { useEffect, useState } from 'react';

function useRecordingTimer() {
  const [isRecording, setIsRecording] = useState(false);
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

  const toggleRecording = () => {
    setIsRecording((previous) => !previous);
  };

  const resetTimer = () => {
    setIsRecording(false);
    setElapsedSeconds(0);
  };

  return { isRecording, elapsedSeconds, toggleRecording, resetTimer };
}

export default useRecordingTimer;
