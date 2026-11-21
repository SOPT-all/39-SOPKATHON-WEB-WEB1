// Keep the audio available for the next page without serializing it into browser history.
// This data lasts for the current app session only; uploading is a separate task.
let recordedAudio: Blob | null = null;

export function setRecordedAudio(audio: Blob | null) {
  recordedAudio = audio;
}

export function getRecordedAudio() {
  return recordedAudio;
}
