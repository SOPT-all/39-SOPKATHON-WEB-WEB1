// 서버 응답 타입 (Swagger: /api/v1/stories/{storyId}, /api/v1/stories/{storyId}/messages)

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export type ServerMessageType = 'STUDENT' | 'STORY' | 'FEEDBACK';

export interface ServerMessage {
  messageId: number;
  type: ServerMessageType;
  text: string;
}

export interface StoryDetail {
  storyId: number;
  title: string;
  summary: string;
  imageUrl: string | null;
  category: string;
  setting: string;
  characters: string;
}

export interface ChatHistoryResponse {
  messages: ServerMessage[];
}

export interface SendMessageRequest {
  text: string;
  lastSeenMessageId: number;
}

export interface SendMessageResponse {
  result: 'NEEDS_REVISION' | 'STORY_ADVANCED';
  messages: ServerMessage[];
}

// 화면에서 쓰는 메시지. STORY → ai, STUDENT → user, FEEDBACK → correction
export interface ChatMessage {
  id: string;
  role: 'ai' | 'user' | 'correction';
  text: string;
}

// starting: 대화 불러오는 중, idle: 입력 대기, sending: AI 응답 대기, rewrite: 교정 후 다시 입력 대기
export type ChatStatus = 'starting' | 'idle' | 'sending' | 'rewrite';
