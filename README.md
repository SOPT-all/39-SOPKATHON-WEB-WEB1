# 39-SOPKATHON-WEB-WEB1

PLAY SOPT 39기 솝커톤 웹 1조 웹 레포지토리 🫰💕

## API 환경변수 설정

1. `.env.example`을 복사해 `.env.local`을 만듭니다.

   ```bash
   cp .env.example .env.local
   ```

2. `VITE_API_BASE_URL`에 백엔드에서 전달받은 API 기본 주소를 입력합니다.
3. 개발 서버를 재시작합니다. 배포 환경에도 같은 환경변수를 별도로 등록합니다.

실제 환경변수 파일은 Git에서 제외하고 `.env.example`만 공유합니다.
`VITE_` 환경변수는 브라우저에 공개되므로 비밀 키나 토큰을 넣지 않습니다.
API 주소가 비어 있으면 요청 전에 오류를 발생시켜 프런트엔드 주소로 잘못 요청하는 것을 방지합니다.

## API 사용 방법

`src/shared/apis/client.ts`의 `client`를 사용합니다. 요청 제한 시간은 10초입니다.
페이지 전용 API는 `src/pages/<페이지명>/apis`, 여러 페이지에서 사용하는 API는
`src/shared/apis`에서 관리합니다.

아래 경로와 응답 타입은 사용법을 보여주는 예시입니다. 실제 API 명세에 맞게 변경합니다.

```ts
import { client } from '@/shared/apis/client';

type Example = {
  id: number;
  name: string;
};

export async function getExample(id: number): Promise<Example> {
  const { data } = await client.get<Example>(`/examples/${id}`);
  return data;
}
```

응답은 Axios 응답 객체로 유지하므로 데이터는 `response.data`에서 가져옵니다.
HTTP 오류·네트워크 오류·시간 초과는 호출부에서 처리하며, 필요하면 `axios.isAxiosError`로 구분합니다.
인증 헤더, 쿠키 전송, 토큰 갱신 처리는 백엔드 인증 방식 확정 후 추가합니다.
