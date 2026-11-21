import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  BrowserSpeechRecognition,
  SpeechRecognitionWindow,
} from '@/pages/recording/types/speechRecognition';

const FINAL_RESULT_TIMEOUT_MS = 2000;
const RESTART_DELAY_MS = 300;
const INPUT_CHECK_DELAY_MS = 8000;

function joinText(...parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function getRecognitionError(code: string) {
  if (code === 'not-allowed' || code === 'service-not-allowed') {
    return '음성 인식 권한이 필요해요. 브라우저에서 마이크 권한을 확인해주세요.';
  }
  if (code === 'network')
    return '음성 인식 연결이 끊겼어요. 인터넷 연결을 확인하고 다시 시도해주세요.';
  if (code === 'audio-capture') return '음성 인식에 사용할 마이크를 확인해주세요.';
  if (code === 'language-not-supported')
    return '이 브라우저에서는 한국어 음성 인식을 지원하지 않아요.';
  return '음성을 텍스트로 바꾸지 못했어요. 다시 시도해주세요.';
}

function useSpeechRecognition(onRecognized?: (text: string) => void) {
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const inputTrackRef = useRef<MediaStreamTrack | null>(null);
  const recognitionTrackRef = useRef<MediaStreamTrack | null>(null);
  const inputCheckRef = useRef<number | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const completedRef = useRef('');
  const finalRef = useRef('');
  const desiredRef = useRef(false);
  const restartRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const finishRef = useRef<((text: string) => void) | null>(null);

  const cancelRecognition = useCallback(() => {
    desiredRef.current = false;
    if (restartRef.current !== null) window.clearTimeout(restartRef.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    restartRef.current = null;
    timeoutRef.current = null;
    if (inputCheckRef.current !== null) window.clearTimeout(inputCheckRef.current);
    inputCheckRef.current = null;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onstart = null;
      recognition.onaudiostart = null;
      recognition.onspeechstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    }
    recognitionTrackRef.current?.stop();
    recognitionTrackRef.current = null;
    const finish = finishRef.current;
    finishRef.current = null;
    finish?.(finalRef.current);
  }, []);

  useEffect(() => {
    window.addEventListener('pagehide', cancelRecognition);
    return () => {
      window.removeEventListener('pagehide', cancelRecognition);
      cancelRecognition();
    };
  }, [cancelRecognition]);

  const resetRecognition = useCallback(() => {
    cancelRecognition();
    completedRef.current = '';
    finalRef.current = '';
    setFinalText('');
    setInterimText('');
    setError(null);
    setNotice('');
    inputTrackRef.current = null;
  }, [cancelRecognition]);

  const startRecognition = useCallback(
    (stream?: MediaStream) => {
      if (stream) inputTrackRef.current = stream.getAudioTracks()[0] ?? null;
      if (desiredRef.current || recognitionRef.current) return;
      const speechWindow = window as SpeechRecognitionWindow;
      const Constructor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
      if (!Constructor) {
        setError(
          '이 브라우저는 음성 인식을 지원하지 않아요. Chrome에서 다시 시도해주세요. 음성 녹음은 계속됩니다.',
        );
        return;
      }
      desiredRef.current = true;
      setError(null);
      setNotice('음성 인식을 연결하고 있어요…');

      const begin = () => {
        restartRef.current = null;
        if (!desiredRef.current) return;
        let sessionFinal = '';
        try {
          const recognition = new Constructor();
          recognitionRef.current = recognition;
          recognition.lang = 'ko-KR';
          recognition.continuous = true;
          recognition.interimResults = true;
          const showListeningNotice = () =>
            setNotice((current) =>
              !current || current === '음성 인식을 연결하고 있어요…'
                ? '말씀하시면 여기에 글로 보여드릴게요.'
                : current,
            );
          recognition.onstart = showListeningNotice;
          recognition.onaudiostart = showListeningNotice;
          recognition.onspeechstart = () => setNotice('말씀하신 내용을 글로 바꾸고 있어요…');
          recognition.onresult = (event) => {
            if (recognitionRef.current !== recognition) return;
            if (inputCheckRef.current !== null) window.clearTimeout(inputCheckRef.current);
            inputCheckRef.current = null;
            setNotice('');
            setError(null);
            const confirmed: string[] = [];
            const interim: string[] = [];
            // Results are the full current session. Rebuild rather than appending repeated events.
            for (let index = 0; index < event.results.length; index += 1) {
              const result = event.results[index];
              (result.isFinal ? confirmed : interim).push(result[0].transcript);
            }
            sessionFinal = joinText(...confirmed);
            finalRef.current = joinText(completedRef.current, sessionFinal);
            setFinalText(finalRef.current);
            setInterimText(joinText(...interim));
            const recognizedText = joinText(finalRef.current, ...interim);
            if (recognizedText) onRecognized?.(recognizedText);
          };
          recognition.onerror = (event) => {
            if (recognitionRef.current !== recognition) return;
            if (event.error === 'no-speech') {
              setNotice('말소리가 들리지 않아요. 마이크 입력을 확인하고 다시 말씀해주세요.');
              return;
            }
            desiredRef.current = false;
            setError(getRecognitionError(event.error));
            completedRef.current = finalRef.current;
            cancelRecognition();
            setInterimText('');
          };
          recognition.onend = () => {
            if (recognitionRef.current !== recognition) return;
            recognitionRef.current = null;
            recognitionTrackRef.current?.stop();
            recognitionTrackRef.current = null;
            if (inputCheckRef.current !== null) window.clearTimeout(inputCheckRef.current);
            inputCheckRef.current = null;
            completedRef.current = joinText(completedRef.current, sessionFinal);
            finalRef.current = completedRef.current;
            setInterimText('');
            if (desiredRef.current) {
              restartRef.current = window.setTimeout(begin, RESTART_DELAY_MS);
            } else {
              if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
              const finish = finishRef.current;
              finishRef.current = null;
              finish?.(finalRef.current);
            }
          };
          const inputTrack = inputTrackRef.current;
          if (inputTrack?.readyState === 'live') {
            // Share the selected microphone; recognition owns only this clone, not the recorder track.
            const track = inputTrack.clone();
            recognitionTrackRef.current = track;
            try {
              recognition.start(track);
            } catch (cause) {
              track.stop();
              recognitionTrackRef.current = null;
              if (
                cause instanceof TypeError ||
                (cause instanceof DOMException && cause.name === 'NotSupportedError')
              ) {
                recognition.start();
              } else throw cause;
            }
          } else {
            recognition.start();
          }
          inputCheckRef.current = window.setTimeout(() => {
            setNotice('인식 결과가 아직 없어요. 마이크 입력과 인터넷 연결을 확인해주세요.');
          }, INPUT_CHECK_DELAY_MS);
        } catch {
          desiredRef.current = false;
          setError('음성 인식을 시작하지 못했어요. 다시 시도해주세요.');
          cancelRecognition();
        }
      };
      begin();
    },
    [cancelRecognition, onRecognized],
  );

  const stopRecognition = useCallback((): Promise<string> => {
    desiredRef.current = false;
    if (restartRef.current !== null) window.clearTimeout(restartRef.current);
    restartRef.current = null;
    const recognition = recognitionRef.current;
    if (!recognition) return Promise.resolve(finalRef.current);
    return new Promise((resolve) => {
      finishRef.current = resolve;
      // A missing end event must not prevent the user from finishing their recording.
      timeoutRef.current = window.setTimeout(cancelRecognition, FINAL_RESULT_TIMEOUT_MS);
      try {
        recognition.stop();
      } catch {
        cancelRecognition();
      }
    });
  }, [cancelRecognition]);

  return {
    finalText,
    interimText,
    error,
    notice,
    startRecognition,
    stopRecognition,
    resetRecognition,
    cancelRecognition,
  };
}

export default useSpeechRecognition;
