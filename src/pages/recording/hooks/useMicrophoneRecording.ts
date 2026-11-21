import { useEffect, useRef, useState } from 'react';

type RecordingStatus = 'idle' | 'requesting' | 'recording' | 'stopping';

type RecordingSession = {
  recorder: MediaRecorder;
  stream: MediaStream;
  chunks: Blob[];
  finish: ((audio: Blob | null) => void) | null;
};

function releaseSession(session: RecordingSession) {
  session.recorder.onstart = null;
  session.recorder.ondataavailable = null;
  session.recorder.onerror = null;
  session.recorder.onstop = null;
  for (const track of session.stream.getTracks()) {
    track.onended = null;
    track.stop();
  }
  if (session.recorder.state !== 'inactive') session.recorder.stop();
  session.finish?.(null);
}

function getMicrophoneError(error: unknown) {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return '마이크 사용 권한이 필요해요. 브라우저 설정에서 마이크를 허용한 뒤 다시 시도해주세요.';
  }
  if (name === 'NotFoundError') return '마이크를 찾을 수 없어요. 연결 상태를 확인해주세요.';
  if (name === 'NotReadableError') {
    return '마이크를 사용할 수 없어요. 다른 앱에서 사용 중인지 확인해주세요.';
  }
  return '녹음을 시작하지 못했어요. 마이크 연결을 확인한 뒤 다시 시도해주세요.';
}

function useMicrophoneRecording() {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const statusRef = useRef<RecordingStatus>('idle');
  const sessionRef = useRef<RecordingSession | null>(null);
  const generationRef = useRef(0);

  const updateStatus = (next: RecordingStatus) => {
    statusRef.current = next;
    setStatus(next);
  };

  useEffect(() => {
    const cancelRecording = () => {
      generationRef.current += 1;
      const session = sessionRef.current;
      sessionRef.current = null;
      statusRef.current = 'idle';
      if (session) releaseSession(session);
    };
    const handlePageHide = () => {
      cancelRecording();
      setStatus('idle');
      setError(null);
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      cancelRecording();
    };
  }, []);

  const startRecording = async () => {
    if (statusRef.current !== 'idle') return;
    setError(null);
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(
        '이 환경에서는 마이크를 사용할 수 없어요. HTTPS 주소 또는 localhost로 접속해주세요.',
      );
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      setError('이 브라우저는 녹음을 지원하지 않아요. 다른 브라우저로 접속해주세요.');
      return;
    }

    const generation = ++generationRef.current;
    updateStatus('requesting');
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (generation !== generationRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      // Let the browser choose a supported audio container and codec.
      const recorder = new MediaRecorder(stream);
      const session: RecordingSession = { recorder, stream, chunks: [], finish: null };
      sessionRef.current = session;
      const fail = (message: string) => {
        if (sessionRef.current !== session) return;
        sessionRef.current = null;
        releaseSession(session);
        setError(message);
        updateStatus('idle');
      };
      recorder.onstart = () => {
        if (sessionRef.current === session) updateStatus('recording');
      };
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) session.chunks.push(event.data);
      };
      recorder.onerror = () => fail('녹음 중 오류가 발생했어요. 다시 녹음해주세요.');
      for (const track of stream.getAudioTracks()) {
        track.onended = () =>
          fail('마이크 연결이 끊겼어요. 연결 상태를 확인하고 다시 녹음해주세요.');
      }
      recorder.onstop = () => {
        if (sessionRef.current !== session) return;
        if (statusRef.current !== 'stopping') {
          fail('녹음이 중단됐어요. 마이크 상태를 확인하고 다시 녹음해주세요.');
          return;
        }
        const audio = new Blob(session.chunks, {
          type: recorder.mimeType || session.chunks[0]?.type || '',
        });
        const finish = session.finish;
        session.finish = null;
        sessionRef.current = null;
        releaseSession(session);
        updateStatus('idle');
        if (audio.size === 0) {
          setError('녹음된 소리가 없어요. 다시 녹음해주세요.');
          finish?.(null);
          return;
        }
        finish?.(audio);
      };
      recorder.start(1000);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      const session = sessionRef.current;
      sessionRef.current = null;
      if (session) releaseSession(session);
      else stream?.getTracks().forEach((track) => track.stop());
      setError(getMicrophoneError(cause));
      updateStatus('idle');
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    const session = sessionRef.current;
    if (statusRef.current !== 'recording' || !session) return Promise.resolve(null);
    updateStatus('stopping');
    return new Promise((resolve) => {
      session.finish = resolve;
      try {
        session.recorder.stop();
      } catch {
        sessionRef.current = null;
        releaseSession(session);
        setError('녹음을 마무리하지 못했어요. 다시 녹음해주세요.');
        updateStatus('idle');
      }
    });
  };

  return { status, error, startRecording, stopRecording };
}

export default useMicrophoneRecording;
