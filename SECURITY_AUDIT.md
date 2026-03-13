# 보안 감사 리포트

**프로젝트:** CC101 Quest (claude-start-game)
**점검일:** 2026-03-13
**점검 범위:** 8개 카테고리, 192개 파일 분석

## 요약

| 심각도 | 발견 수 |
|--------|---------|
| CRITICAL | 0 |
| HIGH | 2 |
| MEDIUM | 2 |
| LOW | 2 |
| **총계** | **6** |

## 발견된 취약점

### [HIGH-1] npm 의존성 취약점 (minimatch ReDoS)
- **심각도:** HIGH
- **카테고리:** 의존성 취약점
- **위치:** `node_modules/minimatch` (<=3.1.3)
- **설명:** minimatch에서 반복된 와일드카드 패턴으로 ReDoS(정규식 서비스 거부) 공격 가능
- **영향:** 빌드 도구 의존성이므로 런타임 영향은 없으나, 공급망 보안 관점에서 조치 필요
- **수정 방법:**
  ```bash
  npm audit fix
  ```

### [HIGH-2] npm 의존성 취약점 (rollup Path Traversal)
- **심각도:** HIGH
- **카테고리:** 의존성 취약점
- **위치:** `node_modules/rollup` (4.0.0 - 4.58.0)
- **설명:** Rollup 4에서 경로 탐색(Path Traversal)을 통한 임의 파일 쓰기 가능
- **영향:** 빌드 타임 의존성이므로 프로덕션 런타임에는 직접 영향 없음. 악의적 입력이 빌드에 포함될 경우 위험
- **수정 방법:**
  ```bash
  npm audit fix
  ```

### [MEDIUM-1] 보안 헤더 미설정
- **심각도:** MEDIUM
- **카테고리:** 정보 노출
- **위치:** `vercel.json`
- **설명:** Content-Security-Policy, X-Frame-Options, X-Content-Type-Options 등 보안 헤더가 설정되어 있지 않음
- **영향:** 클릭재킹, MIME 스니핑, XSS 공격에 대한 브라우저 수준 방어 부재
- **수정 방법:**
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  }
  ```

### [MEDIUM-2] localStorage에 세이브 데이터 무결성 검증 없음
- **심각도:** MEDIUM
- **카테고리:** 인증/인가
- **위치:** `src/hooks/useGameState.jsx:642`
- **설명:** localStorage에서 읽어온 세이브 데이터에 대해 스키마/무결성 검증 없이 `JSON.parse` 후 바로 사용. 악의적으로 조작된 세이브 데이터가 예상치 못한 상태를 유발할 수 있음
- **영향:** 싱글플레이어 게임이므로 실질적 보안 위험은 낮으나, 잘못된 데이터로 앱 크래시 가능
- **수정 방법:** 로드 시 기본값 병합 로직이 이미 존재하므로 현재 수준으로 충분. 선택적으로 try-catch 보강 가능

### [LOW-1] 프로덕션 console.warn 잔존
- **심각도:** LOW
- **카테고리:** 정보 노출
- **위치:** `src/lib/supabase.js:7`, `src/utils/feedback.js:44,85`
- **설명:** 프로덕션 빌드에서 console.warn이 3건 남아있음
- **영향:** 내부 구현 정보가 브라우저 콘솔에 노출. 민감 정보는 아니지만 불필요한 로깅
- **수정 방법:** 프로덕션 빌드에서 console 제거 또는 조건부 로깅 적용

### [LOW-2] 미사용 의존성 잔존 가능
- **심각도:** LOW
- **카테고리:** 의존성 취약점
- **위치:** `package.json`
- **설명:** `@dnd-kit/*`, `@codemirror/*`, `recharts` 등 이전 Tableau 시뮬레이션에서 사용하던 의존성이 현재 코드에서 사용되지 않을 수 있음. 번들 크기와 공격 표면 증가
- **영향:** 빌드 크기 증가 (현재 726KB gzipped 213KB). 보안 위험은 낮음
- **수정 방법:**
  ```bash
  npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @codemirror/autocomplete @codemirror/lang-javascript @codemirror/language @codemirror/state @codemirror/view @lezer/highlight @uiw/codemirror-themes @uiw/react-codemirror recharts
  ```
  제거 전 실제 import 여부를 반드시 확인

## 긍정적 발견 (보안 양호 항목)

| 항목 | 상태 |
|------|------|
| .env 파일 git 미포함 | OK |
| 하드코딩된 시크릿/API 키 | 없음 |
| Supabase service_role 클라이언트 노출 | 없음 |
| API 라우트 (서버사이드) | 없음 (순수 클라이언트 앱) |
| dangerouslySetInnerHTML / XSS | 사용 안 함 |
| 파일 업로드 기능 | 없음 |
| AI API 직접 호출 | 없음 |
| Prompt Injection 위험 | 해당 없음 |
| Supabase Storage 직접 사용 | 없음 |

## 우선순위 액션 아이템

| 순위 | 심각도 | 난이도 | 액션 |
|------|--------|--------|------|
| 1 | HIGH | 낮음 | `npm audit fix`로 의존성 취약점 해결 |
| 2 | MEDIUM | 낮음 | `vercel.json`에 보안 헤더 추가 |
| 3 | LOW | 중간 | 미사용 의존성 제거 (번들 크기 절감) |
| 4 | LOW | 낮음 | 프로덕션 console.warn 정리 |

## 총평

CC101 Quest는 **순수 클라이언트사이드 SPA**로, 서버사이드 API 라우트·파일 업로드·AI 호출이 없어 공격 표면이 매우 작습니다. CRITICAL 취약점은 0건이며, 발견된 HIGH 항목도 빌드 도구 의존성으로 런타임 영향은 없습니다. Supabase는 환경변수로 안전하게 분리되어 있고, 게스트 모드 폴백도 정상 작동합니다.
