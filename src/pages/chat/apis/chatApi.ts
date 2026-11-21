import type {
  ApiResponse,
  ChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
  StoryDetail,
} from '@/pages/chat/types/chat';
import { client } from '@/shared/apis/client';

// 메시지 전송은 서버에서 AI를 거쳐 보통 3~4초 걸려서, 기본 10초보다 여유 있게 둡니다.
const SEND_MESSAGE_TIMEOUT_MS = 30_000;

export async function getStory(storyId: string) {
  const { data } = await client.get<ApiResponse<StoryDetail>>(`/api/v1/stories/${storyId}`);
  return data.data;
}

export async function getChatHistory(storyId: string) {
  const { data } = await client.get<ApiResponse<ChatHistoryResponse>>(
    `/api/v1/stories/${storyId}/messages`,
  );
  return data.data.messages;
}

export async function sendMessage(storyId: string, body: SendMessageRequest) {
  const { data } = await client.post<ApiResponse<SendMessageResponse>>(
    `/api/v1/stories/${storyId}/messages`,
    body,
    { timeout: SEND_MESSAGE_TIMEOUT_MS },
  );
  return data.data;
}
