# CC101 Quest - Development Guide

## Product

This repository currently ships `CC101 Quest`, a beginner-first mission game for people who are completely new to Claude Code.

The surface should feel playful and easy to enter.  
The underlying learning flow should stay practical and aligned with [CC101 Korean guide](https://cc101.axwith.com/ko).

## Package Manager

- Always use `npm`

## Main Commands

1. Dev server: `npm run dev`
2. Build check: `npm run build`
3. Lint check: `npm run lint`

Default local URL:
- `http://127.0.0.1:4173`

## Runtime Shape

Main flow:
- `title -> setup -> chapter_select -> playing -> chapter_clear -> game_complete`

Chapter flow:
- `opening -> briefing -> problems -> boss -> clear -> event`

Important note:
- The `event` phase now includes bridge work.
- Some quests also continue into a `Reality Check` screen after the bridge response scene.

Main files:
- [GamePlay.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/pages/GamePlay.jsx)
- [ChapterFlow.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/chapter/ChapterFlow.jsx)
- [useGameState.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/hooks/useGameState.jsx)

## Current Quest Order

1. `도구를 고르자`
2. `처음 켜기`
3. `어디서 시작해야 하지?`
4. `먼저 읽게 하기`
5. `규칙을 남기자`
6. `좋은 요청 만들기`
7. `마음에 안 들면 되돌리고 다시 말하기`
8. `길어져도 괜찮아`

This order is intentionally mapped to the beginner flow from CC101:
- tool fit
- install / login / first launch
- working folder
- read-first workflow
- `CLAUDE.md`
- better requests and `@file`
- recovery and safety
- session management and first real mission

## Active Question Types

Only these four types are active:

- `quick_choice`
- `card_sort`
- `prompt_build`
- `workflow_sim`

Router:
- [QuestionRouter.jsx](E:/프로젝트/클로드_초보_게임/tableau-survival/src/components/questions/QuestionRouter.jsx)

Do not revive removed Tableau-era chains unless the product scope explicitly changes.

## Source of Truth

- Quest metadata and rewards:
  [courseMeta.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/courseMeta.js)
- Bridge rubric + reality checks:
  [questSupport.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/questSupport.js)
- Problem data:
  [questProblems.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/problems/questProblems.js)
- Chapter scripts:
  [src/data/roles/pm/chapters](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roles/pm/chapters)
- Role registry:
  [roleRegistry.js](E:/프로젝트/클로드_초보_게임/tableau-survival/src/data/roleRegistry.js)

When changing the curriculum, update in this order:
1. problem data
2. quest/chapter copy
3. bridge / reality support metadata
4. state and summary logic
5. docs and progress log

## Current Beginner Support Features

### Always-on coach mode
- Setup screen includes `코치 모드 항상 켜기`
- Useful for first-time learners who want hints visible from the start

### Beginner mode
- Setup screen includes `완전 초보 모드`
- This also forces always-on coach mode
- Use it to keep the experience softer and more guided

### Bridge quests
- Learner picks a direction and writes a real-world action note
- Notes are evaluated with quest-specific rubric checks
- Bridge notes are previewed again on the quest board

### Reality checks
- Quests 2, 3, 4, 7, and 8 now include real-world checklists + notes
- These are meant to connect the game back to actual Claude Code use

## Save Rules

Current save version:
- campaign version: `cc101-quest-v4`
- localStorage key: `cc101-quest-save-v4`

If you change save schema:
- bump the version deliberately
- do not silently cross-load older campaign saves

If Supabase env vars are missing:
- the app must still run in guest mode

## State Fields To Watch

- `coachModeAlwaysOn`
- `beginnerMode`
- `confidence`
- `artifactUnlocks`
- `masteryBySkill`
- `bridgeResponses`
- `bridgeRubricResults`
- `realityChecks`
- `completionSummary`

## UX Guardrails

- Prefer immediate action over long explanation
- Recovery guidance should feel supportive, not punitive
- Keep the experience beginner-first and practical
- Avoid drifting back into Tableau / PM simulation / office-romance framing
- Keep examples mixed: docs, notes, CSV, README, simple code
- Do not make the course code-only

## Validation Expectations

After meaningful changes, validate at minimum:
1. `npm run build`
2. start a new game or seed a relevant save
3. enter the changed quest or screen
4. verify fail -> revise -> pass loop
5. verify quest board and completion summary reflect the change

If the change touches learner experience, inspect it in the browser directly.
