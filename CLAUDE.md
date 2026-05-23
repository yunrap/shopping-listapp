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

## 환경 변수

`.env` 파일이 필요합니다 (`.gitignore`에 포함됨):

```
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## 아키텍처

라우팅 없는 단일 페이지 React 앱. 모든 데이터는 Supabase 데이터베이스에 저장됩니다.

**핵심 파일:**
- `src/App.jsx` — 상태 관리, UI, 모든 인터랙션을 포함한 앱 전체
- `src/supabase.js` — Supabase 클라이언트 초기화
- `src/data/recommendations.js` — 카테고리별(채소/과일, 유제품 등) 추천 항목 정적 데이터

**Supabase 테이블 (`shopping_items`):**
- `id` — uuid (PK, gen_random_uuid())
- `name` — text (NOT NULL, UNIQUE)
- `checked` — boolean (기본값 false)
- `created_at` — timestamptz (기본값 now())

**상태:**
- `items` — Supabase에서 가져온 쇼핑 리스트 배열 `{ id, name, checked, created_at }`
- `input` — 현재 텍스트 입력값
- `activeTab` — 선택된 추천 카테고리 (null = 접힘)
- `loading` — 초기 데이터 로딩 상태

**데이터 흐름:** 마운트 시 Supabase에서 항목을 fetch. 추가/수정/삭제는 Supabase에 직접 반영 후 로컬 state 업데이트. 추천 항목은 정적 데이터.

## 기술 스택

- React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 사용 — `tailwind.config.js` 불필요)
- Supabase JS v2 (`@supabase/supabase-js`)
