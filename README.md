# CC101 Quest

`CC101 Quest`는 Claude Code를 처음 배우는 사람을 위한 미션형 입문 게임입니다.  
겉으로는 짧은 퀘스트를 깨는 게임처럼 보이지만, 내부 구조는 실제 Claude Code 첫 사용 흐름에 맞춘 초보자 온보딩 코스입니다.

## 핵심 방향

- 첫 5분 안에 손에 잡히는 성공 경험 만들기
- 실패해도 안전하게 다시 시도하게 만들기
- 게임 안 학습을 실제 내 폴더와 자료로 연결하기

## 현재 제품 형태

현재 구현 기준은 `CC101 Quest v4`입니다.

퀘스트 흐름:
1. 도구를 고르자
2. 처음 켜기
3. 어디서 시작해야 하지?
4. 먼저 읽게 하기
5. 규칙을 남기자
6. 좋은 요청 만들기
7. 마음에 안 들면 되돌리고 다시 말하기
8. 길어져도 괜찮아

이 순서는 [CC101 한국어 가이드](https://cc101.axwith.com/ko)의 초보자 흐름을 기준으로 잡았습니다.

- 도구 구분
- 설치/로그인/첫 실행
- 작업 폴더
- read-first 워크플로우
- `CLAUDE.md`
- 좋은 요청과 `@file`
- 복구와 안전 루프
- 세션 관리와 첫 실전 사이클

## 주요 학습 장치

### 1. 브릿지 퀘스트
- 각 퀘스트 끝에서 `선택 + 실제 한 줄 메모`를 남깁니다.
- 단순 글자 수가 아니라 퀘스트별 핵심 요소를 포함했는지 루브릭으로 평가합니다.
- 예: 폴더, `@file`, 복구 행동, 세션 도구

관련 파일:
- [BuffSelect.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/chapter/BuffSelect.jsx)
- [questSupport.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/questSupport.js)

### 2. 현실 체크
- CC101의 “실제로 한 번 해보기” 흐름을 반영한 짧은 현실 과제입니다.
- 퀘스트 2, 3, 4, 7, 8 끝에 실제 행동 체크리스트와 메모가 이어집니다.
- 예: 터미널 열기, 설치 확인, 실제 폴더 정하기, 복구 행동 정하기, 첫 미션과 `/compact` 정하기

관련 파일:
- [RealityCheckCard.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/chapter/RealityCheckCard.jsx)
- [questSupport.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/questSupport.js)

### 3. 완전 초보 모드
- 시작 화면에서 `완전 초보 모드`를 켤 수 있습니다.
- 이 모드는 `코치 모드 항상 켜기`를 함께 켜고, 퀘스트 보드와 현실 체크에서 더 쉬운 안내를 먼저 보여줍니다.

관련 파일:
- [CharacterSetup.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/common/CharacterSetup.jsx)

## 활성 문제 타입

현재 코어 캠페인에서 쓰는 문제 타입은 4개입니다.

- `quick_choice`
- `card_sort`
- `prompt_build`
- `workflow_sim`

라우터:
- [QuestionRouter.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/questions/QuestionRouter.jsx)

레거시 Tableau 문제 체인은 제거되었습니다.

## 저장 구조

상태는 [useGameState.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/hooks/useGameState.jsx)에서 관리합니다.

주요 필드:
- `confidence`
- `coachModeAlwaysOn`
- `beginnerMode`
- `artifactUnlocks`
- `masteryBySkill`
- `bridgeResponses`
- `bridgeRubricResults`
- `realityChecks`
- `completionSummary`

현재 저장 버전:
- campaign version: `cc101-quest-v4`
- localStorage key: `cc101-quest-save-v4`

## 실행

```bash
npm install
npm run dev
npm run build
```

기본 로컬 주소:
- `http://127.0.0.1:4173`

## 현재 검증 기준

의미 있는 변경 후 최소 검증:
1. `npm run build`
2. 새 게임 시작 또는 저장 상태 시드
3. 변경된 퀘스트/화면 진입
4. 실패 -> 수정 -> 통과 루프 확인
5. 퀘스트 클리어/보드 반영/수료 리포트 반영 확인

## 참고 파일

- 퀘스트 메타: [courseMeta.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/courseMeta.js)
- 브릿지/현실 체크 지원 데이터: [questSupport.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/questSupport.js)
- 퀘스트 문제 데이터: [questProblems.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/problems/questProblems.js)
- 챕터 스크립트: [src/data/roles/pm/chapters](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/chapters)
- 메인 플레이 페이지: [GamePlay.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/pages/GamePlay.jsx)

## 배포 포지셔닝

현재 제품은 “Claude Code 완전 정복”보다는 아래 포지셔닝에 더 적합합니다.

- 강의 전 예습용 인터랙티브 교재
- 워크숍 전 온보딩 자료
- 초보자의 첫 불안을 낮추는 입문용 경험

즉, 단독 완결형 고급 코스보다는 `초보자 프라이머`에 가깝습니다.
