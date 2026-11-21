import type { Correction } from '@/pages/chat/types/correction';

// 서버 API 명세 확정 전 가안입니다. 명세가 나오면 API 연동 PR에서 맞춥니다.

export interface StoryStartResponse {
  storyId: string;
  worldTitle: string;
  guide: string;
  firstScene: string;
}

export type SendMessageResponse =
  { type: 'correction'; correction: Correction } | { type: 'scene'; scene: string };

export type ChatMessage =
  | { id: string; role: 'ai'; text: string }
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'correction'; correction: Correction };

// starting: 이야기 시작 중, idle: 입력 대기, sending: AI 응답 대기, rewrite: 교정 후 다시 입력 대기
export type ChatStatus = 'starting' | 'idle' | 'sending' | 'rewrite';
