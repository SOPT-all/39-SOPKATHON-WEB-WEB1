// 교정 카드가 화면에 그리는 데 필요한 모양입니다.
// 서버 응답 모양이 달라도 API 쪽에서 이 모양으로 바꿔 넘깁니다.

// 고칠 표현 한 쌍. 예: { before: '개도', after: '걔도' }
export interface Rewrite {
  before: string;
  after: string;
}

export interface Correction {
  // 맞춤법 교정 (한 번에 1~2개)
  spellings: Rewrite[];
  // 더 자연스러운 표현 추천 (있을 때만 1개)
  suggestion?: Rewrite;
}
