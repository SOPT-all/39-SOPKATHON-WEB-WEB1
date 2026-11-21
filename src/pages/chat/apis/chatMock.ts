import type { SendMessageResponse, StoryStartResponse } from '@/pages/chat/types/chat';
import type { Correction } from '@/pages/chat/types/correction';

// API 연동 전 임시 데이터입니다. 실제 API가 나오면 이 두 함수를 서버 요청으로 바꿉니다.
// 보낸 문장에 ‘개도’, ‘있어줄께’, ‘그냥 편지 줘 봐!’ 등이 들어가면 교정 카드가 나옵니다.

const MOCK_DELAY_MS = 1200;

const MOCK_SPELLINGS = [
  { before: '개도', after: '걔도' },
  { before: '있어줄께', after: '있어줄게' },
  { before: '살펴밨어', after: '살펴봤어' },
  { before: '드러가', after: '들어가' },
];

const MOCK_SUGGESTIONS = [{ before: '그냥 편지 줘 봐!', after: '망설이지 말고 편지를 건네 봐!' }];

const MOCK_SCENES = [
  '영철이가 쪽지를 꼭 쥐더니 고개를 끄덕였어.\n“그래, 오늘 비 그치면 꼭 전해 볼게.”\n창밖에 비가 조금씩 잦아들고 있어. 이제 어떻게 할래?',
  '복도 끝에서 영철이가 좋아하는 친구가 우산을 들고 걸어오고 있어.\n영철이가 네 소매를 살짝 잡아당겼지. 어떻게 할래?',
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let sceneIndex = 0;

export async function startStoryMock(worldId: string): Promise<StoryStartResponse> {
  await wait(MOCK_DELAY_MS);
  sceneIndex = 0;

  return {
    storyId: `mock-${worldId}`,
    worldTitle: '비 오는 날의 첫사랑',
    guide:
      '1972년, 너는 영철이와 같은 반인 가장 친한 친구야. 영철이는 좋아하는 친구에게 마음을 전하고 싶지만, 아직 용기가 나지 않아. 이제부터 네가 직접 쓴 이야기에 따라 새로운 사건이 펼쳐질 거야!',
    firstScene:
      '쉬는 시간, 영철이가 네 책상에 작은 쪽지를 올려놓았어.\n\n“좋아하는 애한테 이걸 전하고 싶은데, 용기가 안 나.”\n너는 영철이에게 뭐라고 말해줄 거야?',
  };
}

export async function sendMessageMock(text: string): Promise<SendMessageResponse> {
  await wait(MOCK_DELAY_MS);

  // 명세: 한 번에 핵심 1~2개만 지적합니다.
  const spellings = MOCK_SPELLINGS.filter(({ before }) => text.includes(before)).slice(0, 2);
  const suggestion = MOCK_SUGGESTIONS.find(({ before }) => text.includes(before));

  if (spellings.length > 0 || suggestion) {
    const correction: Correction = { spellings, suggestion };
    return { type: 'correction', correction };
  }

  const scene = MOCK_SCENES[sceneIndex % MOCK_SCENES.length];
  sceneIndex += 1;

  return { type: 'scene', scene };
}
