# 프로젝트 작업 규칙

이 문서는 팀원과 AI 에이전트가 함께 사용하는 작업 기준입니다. 공통 규칙은 이 파일에서 관리합니다.

## 프로젝트와 기술 스택

- PLAY SOPT 39기 솝커톤 웹 1조의 무박 2일 해커톤 프로젝트입니다.
- React, TypeScript, Vite, React Router, Tailwind CSS v4를 사용합니다.
- 패키지 매니저는 pnpm입니다. 의존성을 변경하면 `pnpm-lock.yaml`도 함께 반영합니다.
- 제한된 시간 안에 동작하는 기능을 완성하는 것을 우선합니다. 요청과 관계없는 추상화나 대규모 리팩터링은 피합니다.

## 개발 및 검증 명령어

- `pnpm install`: 의존성 설치
- `pnpm dev`: 개발 서버 실행
- `pnpm lint`: ESLint 검사
- `pnpm build`: TypeScript 검사 및 프로덕션 빌드
- `pnpm exec prettier --write <파일 경로>`: 지정한 파일 포맷
- `pnpm format:check`: 프로젝트 전체 포맷 검사
- `pnpm preview`: 빌드 결과 로컬 확인

## 폴더와 코드 배치

- `src/pages/<페이지명>/`: 해당 페이지에서만 사용하는 코드. 페이지가 필요할 때 폴더를 추가합니다.
- 페이지 전용 `components`, `apis`, `types`, `constants`, `utils`, `hooks`는 해당 페이지 폴더 안에 필요한 것만 만듭니다.
- `src/shared/components/`: 여러 페이지에서 사용하는 공통 UI
- `src/shared/apis/`: 공통 API 클라이언트 및 공통 API
- `src/shared/types/`, `constants/`, `utils/`, `hooks/`: 공통 타입, 상수, 유틸, 훅
- `src/shared/styles/global.css`: 전역 기본 스타일과 디자인 토큰
- `src/layouts/`: 공통 레이아웃
- `src/routes/AppRoutes.tsx`: URL과 페이지 연결
- `src/App.tsx`: 앱 구성, `src/main.tsx`: React 진입점과 BrowserRouter 연결
- 빈 폴더는 `.gitkeep`으로 유지하며, 실제 파일이 추가되면 해당 폴더의 `.gitkeep`은 제거합니다.
- 다른 페이지의 내부 코드를 직접 가져오기보다 공통으로 필요한 코드를 `shared`로 이동합니다.

## 코드 컨벤션

- 컴포넌트와 페이지 파일명은 PascalCase를 사용합니다. 예: `HomePage.tsx`, `Button.tsx`
- 훅은 `use`로 시작하는 camelCase를 사용합니다. 예: `useExample.ts`
- 유틸 파일명과 함수·변수는 camelCase, 공통 상수는 UPPER_SNAKE_CASE를 사용합니다.
- `src` 내부 모듈은 `@/` 절대 경로를 사용합니다. 예: `@/shared/utils/cn`
- 타입만 가져올 때는 `import type` 또는 인라인 `type` import를 사용합니다.
- 기존 ESLint와 Prettier 설정을 따릅니다. 포맷을 위해 관련 없는 파일 전체를 수정하지 않습니다.
- 불필요한 `any`, 사용하지 않는 코드, 디버깅용 로그를 남기지 않습니다.
- 페이지 이동은 React Router의 `Link`나 `useNavigate`를 사용합니다.

## 스타일과 에셋

- 기본 스타일링은 Tailwind CSS를 사용합니다.
- 조건부 클래스나 전달받은 클래스를 병합할 때는 `@/shared/utils/cn`의 `cn`을 사용합니다.
- 클래스 순서는 Prettier 플러그인에 맡깁니다. `cn`, `clsx`, `twMerge` 내부 클래스도 정렬 대상입니다.
- 디자인이 확정되면 공통 색상·폰트 토큰을 `global.css`의 `@theme`에 정의하고 재사용합니다. 확정되지 않은 디자인 수치를 임의로 공통 규칙으로 만들지 않습니다.
- 일반 이미지는 `src/shared/assets/images`, SVG는 `src/shared/assets/svg`, 폰트는 `src/shared/assets/fonts`에 저장합니다.
- 에셋 파일명은 용도를 알 수 있는 영문 소문자 kebab-case를 사용합니다. 예: `logo-symbol.svg`, `home-banner.webp`
- SVG를 컴포넌트로 가져오는 별도 플러그인은 전제하지 않습니다. 현재 설정에서는 URL import로 사용합니다.
- 이미지에는 용도에 맞는 `alt`를 작성하고 장식용 이미지에는 빈 `alt`를 사용합니다.

## Git과 PR

- 작업 브랜치는 `dev`를 기준으로 생성하고, 일반 작업 PR의 대상은 `dev`로 지정합니다.
- 배포 반영은 `dev`에서 `main`으로 PR을 통해 진행합니다.
- 이슈 제목은 `[Feat]`, `[Fix]`, `[Refactor]`, `[Chore]`, `[Docs]` 중 작업에 맞는 타입으로 시작합니다.
- 이슈 폼의 브랜치명에는 영문 소문자·숫자·하이픈만 입력합니다. 예: `agent-rules`
- 현재 자동화는 `<타입>/<이슈번호>-<브랜치명>` 형식으로 브랜치를 생성합니다. 예: `docs/15-agent-rules`
- 커밋은 작업 단위로 나누고 `<타입>: <한국어 설명> (#이슈번호)` 형식을 사용합니다. 예: `docs: AI 에이전트 공통 작업 규칙 추가 (#15)`
- PR 본문은 `.github/pull_request_template.md`를 따릅니다. 관련 이슈 번호, 최종 변경 내용, 검증 결과와 필요한 스크린샷을 작성합니다.
- PR 전 코드 변경에는 `pnpm lint`, `pnpm build`를 실행하고 변경 파일의 포맷을 확인합니다. 문서만 변경했다면 문서 포맷과 내용 확인으로 충분합니다.
- 검증을 실행하지 못했거나 실패했다면 그 사실과 원인을 명시합니다. 확인하지 않은 결과를 성공했다고 적지 않습니다.

## AI 작업 범위

- 작업 전에 관련 파일과 현재 변경사항을 확인하고 사용자의 수정사항을 보존합니다.
- 요청한 범위를 중심으로 수정합니다. 의존성은 필요한 경우에만 추가하고 기존 설정을 먼저 활용합니다.
- API 명세, 디자인, 환경변수 값 등 확인되지 않은 정보를 사실처럼 구현하지 않습니다. 진행에 필요한 정보가 없으면 확인합니다.
- `.env`의 실제 값, 토큰 등 비밀정보를 코드·문서·로그에 노출하지 않습니다. `VITE_` 환경변수는 브라우저에 공개되는 값으로 취급합니다.
- 커밋·푸시·PR 생성·머지·배포는 사용자가 요청한 범위에서 진행합니다.
- 작업 결과에는 변경 내용과 수행한 검증, 남은 사항을 간결하게 전달합니다.
