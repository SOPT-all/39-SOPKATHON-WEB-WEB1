const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;
const RIEUL_JONGSEONG = 8;

// 마지막 한글 글자의 받침 번호를 돌려줍니다. 받침이 없거나 한글이 없으면 0입니다.
// 예: '걔도' → 0, '같습니다' → 0, '편지를 건네 봐!' → 0('봐' 기준), '책상' → 21
function getLastJongseong(word: string) {
  for (let i = word.length - 1; i >= 0; i -= 1) {
    const code = word.charCodeAt(i);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      return (code - HANGUL_START) % JONGSEONG_COUNT;
    }
  }
  return 0;
}

// 은/는
export function topicJosa(word: string) {
  return getLastJongseong(word) > 0 ? '은' : '는';
}

// 으로/로 (ㄹ 받침은 '로')
export function directionJosa(word: string) {
  const jongseong = getLastJongseong(word);
  return jongseong > 0 && jongseong !== RIEUL_JONGSEONG ? '으로' : '로';
}

// 이라고/라고
export function quoteJosa(word: string) {
  return getLastJongseong(word) > 0 ? '이라고' : '라고';
}
