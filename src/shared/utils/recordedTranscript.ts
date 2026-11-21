// Retain confirmed recognition text for the next page in the current app session.
let recordedTranscript = '';

export function setRecordedTranscript(text: string) {
  recordedTranscript = text;
}

export function getRecordedTranscript() {
  return recordedTranscript;
}
