# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에게 안내를 제공합니다.

## 명령어

```bash
npm run dev       # 개발 서버 실행 (http://localhost:5173)
npm run build     # 프로덕션 빌드
npm run preview   # 프로덕션 빌드 미리보기
npm run lint      # ESLint 실행
```

테스트 설정 없음.

## 아키텍처

라우팅과 백엔드 없는 단일 페이지 React 앱. 모든 상태는 `localStorage`에 저장됩니다.

**핵심 파일:**
- `src/App.jsx` — 상태 관리, UI, 모든 인터랙션을 포함한 앱 전체
- `src/data/recommendations.js` — 카테고리별(채소/과일, 유제품 등) 추천 항목 정적 데이터

**상태:**
- `items` — 쇼핑 리스트 배열 `{ id, name, checked }`, App.jsx 내 `useLocalStorage` 훅으로 영속화
- `input` — 현재 텍스트 입력값
- `activeTab` — 선택된 추천 카테고리 (null = 접힘)

**데이터 흐름:** 추천 항목은 임포트 시점에 결정되는 정적 데이터. 항목은 텍스트 입력 후 Enter/추가 버튼 또는 추천 칩 클릭으로 추가됨. 중복 이름은 무시됨. `useLocalStorage` 훅은 `useEffect`를 통해 변경마다 localStorage에 동기화.

## 기술 스택

- React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 사용 — `tailwind.config.js` 불필요)
