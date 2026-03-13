export const BRIDGE_RUBRIC_META = {
  1: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'material',
        label: '파일이나 자료',
        feedback: '회의록, README, CSV, PDF처럼 실제 자료 이름이나 폴더를 넣어보세요.',
        patterns: [/\.md\b/i, /\.csv\b/i, /\.pdf\b/i, /파일/, /문서/, /폴더/, /회의록/, /readme/i, /csv/i, /pdf/i],
      },
      {
        id: 'action',
        label: 'Claude에게 시킬 행동',
        feedback: '읽기, 요약, 정리, 분석처럼 Claude Code가 할 일을 동사로 적어보세요.',
        patterns: [/읽/, /요약/, /정리/, /분석/, /추출/, /정렬/, /만들/, /저장/, /번역/],
      },
      {
        id: 'result',
        label: '원하는 결과물',
        feedback: '불릿, 보고서, 파일 저장처럼 어떤 결과를 원하는지도 적으면 더 실제적입니다.',
        patterns: [/불릿/, /목록/, /보고서/, /파일/, /저장/, /정리본/, /3개/, /요약본/, /\.md\b/i],
      },
    ],
  },
  2: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'launch_flow',
        label: '설치 또는 실행 흐름',
        feedback: '설치, claude 실행, /help 중 하나를 실제 행동으로 적어보세요.',
        patterns: [/설치/, /claude\b/i, /\/help/, /터미널/, /powershell/i, /윈도우 터미널/],
      },
      {
        id: 'auth',
        label: '로그인 또는 인증',
        feedback: '브라우저 로그인, 인증 URL, c 키, /logout 같은 인증 흐름을 함께 적어보세요.',
        patterns: [/로그인/, /인증/, /브라우저/, /url/i, /\bc\b/, /\/logout/, /auth/i],
      },
      {
        id: 'check_action',
        label: '내가 먼저 확인할 것',
        feedback: '확인, 실행, 복사, 재시작처럼 먼저 할 행동을 적어야 실제 준비도가 보입니다.',
        patterns: [/확인/, /실행/, /복사/, /재시작/, /열기/, /붙여넣/, /시도/],
      },
    ],
  },
  3: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'path_or_folder',
        label: '실제 폴더 또는 경로',
        feedback: '프로젝트 폴더, notes 폴더, C:\\경로처럼 실제 위치를 적어보세요.',
        patterns: [/폴더/, /경로/, /프로젝트/, /workspace/i, /[a-z]:\\/i, /\//, /notes/i, /docs/i, /data/i],
      },
      {
        id: 'real_material',
        label: '그 안에 있는 자료',
        feedback: '그 폴더에 어떤 문서나 파일이 들어 있는지도 같이 적으면 더 좋습니다.',
        patterns: [/README/i, /회의록/, /\.md\b/i, /\.csv\b/i, /\.pdf\b/i, /문서/, /자료/, /파일/],
      },
      {
        id: 'avoid_desktop',
        label: '작업 폴더 기준 생각',
        feedback: '바탕화면이나 다운로드가 아니라 실제 작업 폴더라는 감각이 드러나면 좋습니다.',
        patterns: [/작업 폴더/, /프로젝트 폴더/, /실제 폴더/, /업무 폴더/, /다운로드 아님/, /바탕화면 아님/],
      },
    ],
  },
  4: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'read_first',
        label: '먼저 읽게 하기',
        feedback: '바로 구현보다 먼저 읽고 파악하게 한다는 말이 들어가면 좋습니다.',
        patterns: [/먼저/, /읽/, /훑/, /파악/, /구조/, /설명/, /정리/],
      },
      {
        id: 'materials',
        label: '읽힐 자료 묶음',
        feedback: 'README, 회의록, CSV, PDF처럼 어떤 자료를 먼저 읽힐지 적어보세요.',
        patterns: [/README/i, /회의록/, /\.csv\b/i, /\.pdf\b/i, /\.md\b/i, /문서/, /자료/, /파일/],
      },
      {
        id: 'summary_or_scope',
        label: '읽은 뒤 원하는 범위',
        feedback: '핵심만, 요약, 구조 설명처럼 읽은 뒤 원하는 결과도 적어보세요.',
        patterns: [/핵심/, /요약/, /정리/, /구조/, /3줄/, /불릿/, /설명/],
      },
    ],
  },
  5: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'persistent_rule',
        label: '반복 규칙',
        feedback: '매번 다시 말하기 싫은 규칙이라는 느낌이 드러나면 좋습니다.',
        patterns: [/항상/, /매번/, /반복/, /규칙/, /고정/, /기본적으로/],
      },
      {
        id: 'clear_rule_content',
        label: '구체적인 규칙 내용',
        feedback: '한국어, 위험한 명령 먼저 확인, 짧은 불릿처럼 실제 규칙을 적어보세요.',
        patterns: [/한국어/, /불릿/, /짧게/, /위험한/, /명령/, /먼저 물어/, /스페이스/, /타입스크립트/],
      },
      {
        id: 'claude_md_intent',
        label: 'CLAUDE.md에 넣을 의도',
        feedback: '이걸 CLAUDE.md에 남긴다는 의도가 드러나면 더 좋아요.',
        patterns: [/claude\.md/i, /메모/, /남기/, /기록/, /프로젝트 설명서/],
      },
    ],
  },
  6: {
    passThreshold: 3,
    requiredChecks: [
      {
        id: 'at_file',
        label: '@파일',
        feedback: '@README.md처럼 실제 파일을 붙여야 Quest 6의 핵심이 살아납니다.',
        patterns: [/@[A-Za-z0-9._/-]+/, /@README/i, /@meeting/i, /@notes/i, /@src\//i],
      },
      {
        id: 'clear_action',
        label: '무엇을 할지',
        feedback: '읽기, 정리, 번역, 수정처럼 할 일을 분명히 적어보세요.',
        patterns: [/읽/, /정리/, /요약/, /번역/, /수정/, /설명/, /찾아/, /분석/],
      },
      {
        id: 'format_or_scope',
        label: '결과 형식 또는 범위',
        feedback: '불릿, 3개, 표, 한글로처럼 결과 형식이나 범위를 넣어보세요.',
        patterns: [/불릿/, /3개/, /표/, /한글/, /한국어/, /한 줄/, /짧게/, /목록/],
      },
    ],
  },
  7: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'recovery_tool',
        label: '복구 도구',
        feedback: 'Esc 두 번, /rewind, /clear, git diff 같은 안전 도구를 적어보세요.',
        patterns: [/esc/i, /\/rewind/, /\/clear/, /git diff/i, /git status/i, /ctrl\+c/i, /백업/, /commit/i],
      },
      {
        id: 'stop_or_review',
        label: '멈추고 확인하는 행동',
        feedback: '멈추기, 확인하기, 되돌리기 중 어떤 행동을 먼저 할지 적어보세요.',
        patterns: [/멈추/, /중단/, /확인/, /되돌/, /취소/, /다시/, /리뷰/],
      },
      {
        id: 'scope_guard',
        label: '범위 조절 또는 안전장치',
        feedback: '다른 파일은 건드리지 말기, Plan Mode 먼저 보기처럼 범위 조절도 좋습니다.',
        patterns: [/plan mode/i, /shift\+tab/i, /다른 파일은/, /범위/, /먼저 보기/, /한 파일만/],
      },
    ],
  },
  8: {
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'first_mission',
        label: '첫 실전 미션',
        feedback: '내 폴더에서 무엇을 할지 한 줄 미션이 보여야 합니다.',
        patterns: [/요약/, /정리/, /읽/, /번역/, /분석/, /파일/, /폴더/, /회의록/, /README/i, /csv/i],
      },
      {
        id: 'session_tool',
        label: '세션 또는 안전 기술',
        feedback: '/compact, --continue, --resume, Plan Mode 중 하나를 같이 적어보세요.',
        patterns: [/\/compact/, /--continue/, /--resume/, /plan mode/i, /shift\+tab/i, /\/clear/, /\/rewind/],
      },
      {
        id: 'small_start',
        label: '작게 시작하기',
        feedback: '한 번에 하나, 작은 범위처럼 처음엔 작게 시작한다는 감각이 보이면 더 좋습니다.',
        patterns: [/작게/, /하나/, /먼저/, /첫 단계/, /한 줄/, /작은 미션/],
      },
    ],
  },
}

export const REALITY_CHECK_META = {
  2: {
    title: '현실 체크: 설치와 첫 실행',
    summary: 'CC101 기준으로 처음엔 설치 -> claude 실행 -> 브라우저 로그인 흐름을 실제로 한 번 밟아보는 것이 중요합니다.',
    steps: [
      { id: 'open_terminal', label: 'PowerShell 또는 터미널을 실제로 열어봤다' },
      { id: 'copy_install', label: '설치 명령이나 설치 페이지를 실제로 확인했다' },
      { id: 'launch_or_auth', label: '`claude` 실행 또는 로그인 화면까지 가는 흐름을 확인했다' },
    ],
    notePrompt: '막힌 지점이나 다음 행동을 적어보세요.',
    placeholder: '예: PowerShell은 열었고, 오늘은 설치 명령까지 확인했다. 다음엔 claude 실행 후 로그인 화면까지 보기',
    minNoteLength: 12,
  },
  3: {
    title: '현실 체크: 작업 폴더 정하기',
    summary: 'CC101은 현재 폴더 기준으로 동작하므로, 실제 자료가 들어 있는 폴더를 정하는 것이 핵심입니다.',
    steps: [
      { id: 'picked_folder', label: '실제로 Claude Code를 켤 폴더를 하나 정했다' },
      { id: 'not_desktop', label: '바탕화면/다운로드가 아니라 실제 작업 자료 폴더인지 확인했다' },
      { id: 'has_materials', label: '그 폴더 안에 읽힐 파일이나 문서가 있는지 확인했다' },
    ],
    notePrompt: '내가 실제로 정한 폴더나 경로를 적어보세요.',
    placeholder: '예: Documents/client-notes 폴더. 회의록 md 파일과 CSV 자료가 같이 들어 있다',
    minNoteLength: 10,
  },
  4: {
    title: '현실 체크: 먼저 읽게 하기',
    summary: 'CC101의 첫 세션 워크플로우처럼, 처음엔 구현보다 자료를 먼저 파악하게 하는 것이 안전합니다.',
    steps: [
      { id: 'picked_materials', label: '먼저 읽게 할 문서나 파일 묶음을 정했다' },
      { id: 'read_first_prompt', label: '바로 결론이 아니라 먼저 읽고 설명해달라는 흐름으로 적었다' },
      { id: 'clear_result', label: '핵심 요약, 구조 설명처럼 읽은 뒤 원하는 결과를 정했다' },
    ],
    notePrompt: '실제로 먼저 읽게 할 자료와 첫 요청을 적어보세요.',
    placeholder: '예: README.md와 meeting-notes.md를 먼저 읽고, 프로젝트 구조와 오늘 결정사항만 요약해달라고 하기',
    minNoteLength: 14,
  },
  7: {
    title: '현실 체크: 멈추고 복구하기',
    summary: 'CC101은 실수했을 때 Esc 두 번, /rewind, git 확인처럼 멈추고 되돌리는 루프를 강조합니다.',
    steps: [
      { id: 'know_stop', label: 'Esc 두 번 또는 작업 중단 방법을 알고 있다' },
      { id: 'know_rewind', label: '/rewind 또는 git 확인/복구 흐름을 이해했다' },
      { id: 'plan_guard', label: '큰 작업 전 Plan Mode나 백업이 왜 필요한지 안다' },
    ],
    notePrompt: '실제로 막히면 내가 먼저 할 복구 행동을 적어보세요.',
    placeholder: '예: 이상한 수정이 시작되면 Esc 두 번으로 멈추고, 필요하면 /rewind 후 git diff로 확인하기',
    minNoteLength: 14,
  },
  8: {
    title: '현실 체크: 첫 실전 사이클',
    summary: 'CC101 마지막 흐름처럼 실제 폴더에서 작은 미션 하나를 정하고, 길어지면 세션 관리 도구를 쓰는 준비를 합니다.',
    steps: [
      { id: 'first_mission_defined', label: '내 폴더에서 해볼 첫 미션을 정했다' },
      { id: 'session_tool_defined', label: '/compact, --continue, --resume, Plan Mode 중 하나를 골랐다' },
      { id: 'small_scope', label: '처음엔 작은 범위로 시작하겠다고 정했다' },
    ],
    notePrompt: '실제 첫 미션과 함께 쓸 세션 기술을 적어보세요.',
    placeholder: '예: notes 폴더에서 회의록 3개만 먼저 요약해보고, 길어지면 /compact로 정리하기',
    minNoteLength: 14,
  },
}

export const BRIDGE_VARIANT_META = {
  real_multi_file: {
    rewardLabel: '여러 파일 읽기',
    benefitTitle: '키우는 감각',
    benefitText: '문서와 파일 여러 개를 함께 읽혀야 하는 일은 Claude Code 쪽이 더 잘 맞는다는 감각을 키웁니다.',
    prompt: '실제로 여러 파일을 같이 읽혀보고 싶은 일을 한 줄로 적어보세요.',
    placeholder: '예: meeting-notes.md와 roadmap.csv를 같이 읽고 이번 주 우선순위만 정리해달라고 하기',
    hint: '파일 묶음 + Claude Code가 할 일 + 원하는 결과가 함께 보이면 가장 좋습니다.',
    examples: ['회의록과 CSV 같이 읽기', 'README와 회의 메모 함께 정리'],
    coachFallback: '이 루트는 “여러 자료를 한 번에 읽히는 실전형”입니다. 파일 묶음과 원하는 결과를 같이 적어보세요.',
  },
  compare_both: {
    rewardLabel: '도구 비교 감각',
    benefitTitle: '키우는 감각',
    benefitText: '같은 AI라도 Claude Code가 맞는 일과 Claude.ai가 맞는 일을 비교해 보는 감각을 키웁니다.',
    prompt: 'Claude Code가 맞는 일 하나와 Claude.ai가 맞는 일 하나를 같이 적어보세요.',
    placeholder: '예: meeting-notes.md와 sales.csv를 함께 읽는 일은 Claude Code, 아이디어만 뽑는 브레인스토밍은 Claude.ai',
    hint: '파일이나 폴더가 필요한 일 하나, 채팅만으로 되는 일 하나를 같이 적어보세요.',
    examples: ['파일 읽기는 Claude Code, 아이디어는 Claude.ai', '프로젝트 파악 vs 가벼운 브레인스토밍'],
    coachFallback: '이 루트는 “도구를 구분하는 감각”을 키우는 길입니다. 두 도구가 어디서 갈리는지 한 줄로 비교해보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'code_side',
        label: 'Claude Code가 맞는 일',
        feedback: '파일이나 폴더를 같이 봐야 하는 실제 작업 하나를 적어보세요.',
        patterns: [/claude code/i, /파일/, /폴더/, /readme/i, /csv/i, /md\b/i, /프로젝트/, /읽고/, /함께/],
      },
      {
        id: 'web_side',
        label: 'Claude.ai가 맞는 일',
        feedback: '브레인스토밍이나 가벼운 아이디어 작업처럼 채팅만으로 되는 일을 하나 적어보세요.',
        patterns: [/claude\.ai/i, /브레인스토밍/, /아이디어/, /가볍/, /채팅/, /초안/, /문장/],
      },
      {
        id: 'comparison',
        label: '둘의 차이',
        feedback: '왜 하나는 Claude Code이고, 다른 하나는 Claude.ai인지 비교가 드러나면 더 좋아집니다.',
        patterns: [/반면/, /대신/, /비교/, /다르/, /한편/, /vs/i],
      },
    ],
  },
  separate_install_and_login: {
    rewardLabel: '설치 vs 로그인',
    benefitTitle: '키우는 감각',
    benefitText: '처음 막힐 때 설치 문제와 로그인 문제를 따로 구분하는 감각을 키웁니다.',
    prompt: '처음 켜기 전에 내가 실제로 구분해서 확인할 행동 한 줄을 적어보세요.',
    placeholder: '예: 프로젝트 폴더에서 claude 실행부터 확인하고, 안 되면 로그인 상태와 브라우저 인증을 따로 보기',
    hint: '설치/실행과 로그인/인증을 따로 쪼개서 적으면 훨씬 실제적입니다.',
    examples: ['claude 실행 여부 먼저 보기', '로그인 화면이 뜨는지 따로 보기'],
    coachFallback: '이 루트는 “설치 문제냐, 인증 문제냐”를 나눠 보는 길입니다. 두 단계를 분리해서 적어보세요.',
  },
  remember_approval: {
    rewardLabel: '승인 요청 읽기',
    benefitTitle: '키우는 감각',
    benefitText: '승인 요청을 겁낼 게 아니라 읽고 판단하는 안전 장치로 보는 감각을 키웁니다.',
    prompt: '승인 요청이 뜰 때 내가 어떻게 읽고 판단할지 한 줄로 적어보세요.',
    placeholder: '예: 승인 창이 뜨면 바로 누르지 말고 어떤 명령인지 읽고, 위험하면 멈추고 먼저 물어보기',
    hint: '승인 요청을 “읽기 -> 판단 -> 진행 또는 멈춤” 순서로 적으면 좋습니다.',
    examples: ['명령 내용을 먼저 읽기', '위험하면 멈추고 다시 묻기'],
    coachFallback: '이 루트는 “승인 요청을 읽는 감각”을 키우는 길입니다. 설치보다 승인 내용을 어떻게 볼지 적어보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'approval',
        label: '승인 요청',
        feedback: '승인 요청이나 허용 창이 떴을 때를 직접 언급해보세요.',
        patterns: [/승인/, /허용/, /요청/, /창/, /permission/i],
      },
      {
        id: 'read_then_decide',
        label: '읽고 판단하기',
        feedback: '내용을 읽고 판단한다는 흐름이 들어가면 훨씬 실제적입니다.',
        patterns: [/읽/, /확인/, /내용/, /판단/, /먼저 보고/, /무슨 명령/],
      },
      {
        id: 'stop_or_ask',
        label: '멈추거나 다시 묻기',
        feedback: '애매하면 멈추거나 다시 묻는다는 안전 행동까지 적어보세요.',
        patterns: [/멈추/, /중단/, /다시 묻/, /먼저 물어/, /취소/, /보류/],
      },
    ],
  },
  pick_real_workspace: {
    rewardLabel: '실제 폴더 정하기',
    benefitTitle: '키우는 감각',
    benefitText: 'Claude Code를 켤 실제 작업 폴더를 하나 정하고 그 이유를 떠올리는 감각을 키웁니다.',
    prompt: 'Claude Code를 실제로 켤 폴더 하나와 그 안의 자료를 적어보세요.',
    placeholder: '예: Documents/client-notes 폴더. 회의록 md 파일과 sales.csv 자료가 같이 들어 있다',
    hint: '경로나 폴더 이름 + 안에 있는 자료를 같이 적어보세요.',
    examples: ['client-notes 폴더', 'docs와 csv가 같이 있는 작업 폴더'],
    coachFallback: '이 루트는 “실제 시작 폴더 하나를 정하는 감각”입니다. 폴더와 자료를 같이 적어보세요.',
  },
  compare_locations: {
    rewardLabel: '위치 비교 감각',
    benefitTitle: '키우는 감각',
    benefitText: '바탕화면/다운로드와 실제 작업 폴더의 차이를 비교해 보는 감각을 키웁니다.',
    prompt: '잘못 켜기 쉬운 폴더와 실제로 켜야 할 폴더를 비교해 적어보세요.',
    placeholder: '예: 다운로드 폴더는 임시 파일만 있고, client-notes 폴더에는 회의록과 README가 있어서 그쪽에서 시작하기',
    hint: '잘못된 위치 하나 + 올바른 위치 하나를 비교해서 적어보세요.',
    examples: ['다운로드 vs 프로젝트 폴더', '바탕화면 vs 실제 문서 폴더'],
    coachFallback: '이 루트는 “어디서 시작하면 안 되는지”까지 비교하는 길입니다. 두 위치를 같이 적어보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'wrong_location',
        label: '잘못된 시작 위치',
        feedback: '다운로드나 바탕화면처럼 잘못 켜기 쉬운 위치를 하나 적어보세요.',
        patterns: [/다운로드/, /바탕화면/, /desktop/i, /download/i],
      },
      {
        id: 'right_location',
        label: '올바른 작업 폴더',
        feedback: '실제로 켜야 할 작업 폴더를 하나 적어보세요.',
        patterns: [/작업 폴더/, /프로젝트 폴더/, /notes/, /docs/, /client/, /folder/i, /경로/],
      },
      {
        id: 'reason',
        label: '왜 그 폴더인지',
        feedback: '왜 그쪽에서 켜야 하는지 자료나 파일을 근거로 덧붙이면 좋습니다.',
        patterns: [/있어서/, /들어/, /자료/, /파일/, /readme/i, /csv/i, /회의록/],
      },
    ],
  },
  pick_real_read_first_files: {
    rewardLabel: '먼저 읽을 파일',
    benefitTitle: '키우는 감각',
    benefitText: '바로 구현보다 먼저 읽혀야 할 문서 묶음을 고르는 감각을 키웁니다.',
    prompt: '먼저 읽게 할 파일 묶음과 원하는 요약 결과를 적어보세요.',
    placeholder: '예: README.md와 meeting-notes.md를 먼저 읽고 이번 주 결정사항 3가지만 요약해달라고 하기',
    hint: '먼저 읽을 자료 + 요약 결과가 함께 있으면 좋습니다.',
    examples: ['README와 회의록 먼저 읽기', 'CSV와 메모 먼저 파악하기'],
    coachFallback: '이 루트는 “먼저 읽게 할 자료를 고르는 감각”입니다. 구현 대신 파악 요청으로 적어보세요.',
  },
  separate_material_types: {
    rewardLabel: '자료 타입 구분',
    benefitTitle: '키우는 감각',
    benefitText: '문서, 표, 코드처럼 자료 타입이 다를 때 무엇을 먼저 읽힐지 구분하는 감각을 키웁니다.',
    prompt: '서로 다른 자료 타입 두 개를 골라, 각각 왜 먼저 읽혀야 하는지 적어보세요.',
    placeholder: '예: README는 전체 맥락용, sales.csv는 수치 확인용이라 둘 다 먼저 읽히기',
    hint: '자료 타입이 다른 두 개와 각 자료의 역할을 함께 적어보세요.',
    examples: ['README + CSV', '회의록 + PDF'],
    coachFallback: '이 루트는 “자료 타입별로 읽는 목적을 나누는 감각”입니다. 각 자료의 역할을 붙여보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'two_types',
        label: '서로 다른 자료 두 개',
        feedback: '문서와 CSV처럼 서로 다른 자료 두 개를 적어보세요.',
        patterns: [/readme/i, /csv/i, /pdf/i, /회의록/, /문서/, /코드/, /표/],
      },
      {
        id: 'purpose_split',
        label: '각 자료의 역할',
        feedback: '각 자료를 왜 읽히는지 역할이 드러나면 더 좋습니다.',
        patterns: [/맥락/, /수치/, /결정/, /흐름/, /배경/, /확인용/, /정리용/],
      },
      {
        id: 'read_first',
        label: '먼저 읽기 요청',
        feedback: '바로 구현이 아니라 먼저 읽고 파악하게 한다는 말이 들어가면 좋습니다.',
        patterns: [/먼저/, /읽고/, /파악/, /요약/, /정리/],
      },
    ],
  },
  write_two_rules: {
    rewardLabel: '규칙 두 개',
    benefitTitle: '키우는 감각',
    benefitText: 'CLAUDE.md에 남길 반복 규칙 두 개를 직접 떠올리는 감각을 키웁니다.',
    prompt: 'CLAUDE.md에 남길 반복 규칙 두 개를 한 줄에 적어보세요.',
    placeholder: '예: 답변은 한국어, 위험한 명령은 먼저 확인받기',
    hint: '매번 반복해서 말하고 싶은 규칙 두 개를 바로 적어보세요.',
    examples: ['답변은 한국어', '위험한 명령은 먼저 확인'],
    coachFallback: '이 루트는 “바로 써먹을 규칙 두 개”를 고르는 길입니다. 반복 규칙을 짧게 적어보세요.',
  },
  separate_long_term_rules: {
    rewardLabel: '장기 vs 일회성',
    benefitTitle: '키우는 감각',
    benefitText: 'CLAUDE.md에 남길 장기 규칙과 이번 요청에서만 말할 일회성 지시를 구분하는 감각을 키웁니다.',
    prompt: '장기 규칙 하나와 이번 요청 전용 지시 하나를 비교해서 적어보세요.',
    placeholder: '예: 장기 규칙은 한국어 답변, 이번 요청 전용 지시는 오늘은 3줄로만 정리하기',
    hint: '오래 유지할 규칙 하나 + 이번에만 쓸 지시 하나를 같이 적어보세요.',
    examples: ['한국어 답변 vs 오늘은 3줄 요약', '위험 명령 확인 vs 이번엔 불릿 5개'],
    coachFallback: '이 루트는 “CLAUDE.md와 지금 채팅 지시를 구분하는 감각”입니다. 둘을 나란히 적어보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'persistent',
        label: '장기 규칙',
        feedback: '계속 유지할 장기 규칙 하나를 적어보세요.',
        patterns: [/장기/, /항상/, /매번/, /기본/, /한국어/, /위험한 명령/, /claude\.md/i],
      },
      {
        id: 'one_off',
        label: '이번 요청 전용',
        feedback: '이번에만 쓰는 지시 하나를 같이 적어보세요.',
        patterns: [/이번/, /오늘/, /이번 요청/, /지금만/, /3줄/, /5개/, /이번에는/],
      },
      {
        id: 'comparison',
        label: '둘의 구분',
        feedback: '장기 규칙과 일회성 지시를 구분해서 적는 흐름이 있으면 좋습니다.',
        patterns: [/반면/, /대신/, /구분/, /따로/, /비교/],
      },
    ],
  },
  write_real_file_prompt: {
    rewardLabel: '@파일 실전형',
    benefitTitle: '키우는 감각',
    benefitText: '실제 파일을 붙여서 바로 써먹을 수 있는 요청을 만드는 감각을 키웁니다.',
    prompt: '@파일이 들어간 실제 요청 한 줄을 적어보세요.',
    placeholder: '예: @README.md @meeting-notes.md를 읽고 오늘 결정사항 3개만 불릿으로 정리해줘',
    hint: '@파일 + 할 일 + 결과 형식을 한 줄에 넣어보세요.',
    examples: ['@README.md 포함 요청', '@meeting-notes.md와 결과 형식 같이 쓰기'],
    coachFallback: '이 루트는 “바로 복붙 가능한 실전 요청”입니다. @파일을 먼저 드러내보세요.',
  },
  start_with_scope_and_result: {
    rewardLabel: '범위 + 결과 먼저',
    benefitTitle: '키우는 감각',
    benefitText: '처음부터 파일보다 범위와 결과 형식을 먼저 정리하는 감각을 키웁니다.',
    prompt: '좁은 범위와 원하는 결과 형식을 먼저 적고, 필요하면 참고 파일도 덧붙여보세요.',
    placeholder: '예: 오늘 회의 결정사항만 3개 불릿으로 정리해줘. 참고는 @meeting-notes.md',
    hint: '무엇만 할지와 어떤 형식으로 받을지를 먼저 적어보세요.',
    examples: ['오늘 회의 결정사항만', '3개 불릿으로 정리'],
    coachFallback: '이 루트는 “파일보다 범위와 결과를 먼저 잡는 감각”입니다. 작업 범위와 결과 형식을 앞에 써보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'scope',
        label: '좁은 범위',
        feedback: '오늘 것만, 결정사항만, 3개만처럼 범위를 먼저 좁혀보세요.',
        patterns: [/만/, /오늘/, /3개/, /결정사항/, /이 부분/, /지금 필요한/],
      },
      {
        id: 'result_format',
        label: '결과 형식',
        feedback: '불릿, 표, 한 줄 요약처럼 결과 형식을 적어보세요.',
        patterns: [/불릿/, /표/, /한 줄/, /요약/, /목록/, /정리해줘/],
      },
      {
        id: 'supporting_file',
        label: '참고 파일',
        feedback: '@파일이나 참고 자료를 덧붙이면 더 좋아집니다.',
        patterns: [/@[A-Za-z0-9._/-]+/, /참고/, /readme/i, /notes/i],
      },
    ],
  },
  interrupt_first: {
    rewardLabel: '멈춤 우선',
    benefitTitle: '키우는 감각',
    benefitText: '이상한 작업이 시작되면 일단 멈추는 감각을 먼저 키웁니다.',
    prompt: '이상한 수정이 시작됐을 때 내가 먼저 멈출 행동을 적어보세요.',
    placeholder: '예: 이상한 명령이 보이면 Esc 두 번으로 멈추고, 바로 진행하지 않고 먼저 상태를 확인하기',
    hint: '멈춤 -> 확인 순서로 적으면 좋습니다.',
    examples: ['Esc 두 번으로 중단', '먼저 멈추고 상태 확인'],
    coachFallback: '이 루트는 “계속 진행보다 멈춤이 먼저”라는 감각을 키웁니다. 중단 행동을 앞에 적어보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'stop_action',
        label: '멈추는 행동',
        feedback: 'Esc 두 번이나 중단 같은 멈춤 행동을 직접 적어보세요.',
        patterns: [/esc/i, /멈추/, /중단/, /정지/, /취소/],
      },
      {
        id: 'review_after_stop',
        label: '멈춘 뒤 확인',
        feedback: '멈춘 뒤 상태를 확인하거나 다시 묻는 행동을 붙여보세요.',
        patterns: [/확인/, /상태/, /다시 묻/, /보고/, /검토/],
      },
      {
        id: 'avoid_continue',
        label: '계속 밀지 않기',
        feedback: '그냥 진행하지 않는다는 감각이 드러나면 더 좋습니다.',
        patterns: [/바로 진행하지/, /먼저/, /계속하지/, /보류/],
      },
    ],
  },
  separate_recovery_tools: {
    rewardLabel: '복구 도구 구분',
    benefitTitle: '키우는 감각',
    benefitText: 'Esc, /rewind, /clear, git 확인처럼 복구 도구를 상황별로 구분하는 감각을 키웁니다.',
    prompt: '복구 도구 두 개 이상과 각각 언제 쓸지 적어보세요.',
    placeholder: '예: Esc 두 번은 바로 멈출 때, /rewind는 직전 작업을 되돌릴 때, git diff는 바뀐 걸 확인할 때',
    hint: '도구 이름 두 개 이상 + 언제 쓰는지 역할을 붙여보세요.',
    examples: ['Esc vs /rewind', '/clear vs git diff'],
    coachFallback: '이 루트는 “복구 도구를 나눠 쓰는 감각”입니다. 도구 이름과 역할을 같이 적어보세요.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'two_tools',
        label: '복구 도구 두 개 이상',
        feedback: 'Esc, /rewind, /clear, git diff 중 두 개 이상을 적어보세요.',
        patterns: [/esc/i, /\/rewind/, /\/clear/, /git diff/i, /git status/i],
      },
      {
        id: 'use_cases',
        label: '각 도구의 쓰는 순간',
        feedback: '언제 그 도구를 쓰는지 역할을 붙이면 훨씬 실제적입니다.',
        patterns: [/때/, /상황/, /직전/, /확인/, /되돌/, /멈출/],
      },
      {
        id: 'comparison',
        label: '도구 구분',
        feedback: '어떤 도구가 어떤 순간에 맞는지 구분해서 적어보세요.',
        patterns: [/반면/, /대신/, /구분/, /비교/, /각각/],
      },
    ],
  },
  pick_mission_and_safety_tool: {
    rewardLabel: '첫 미션 + 안전 도구',
    benefitTitle: '키우는 감각',
    benefitText: '작은 첫 미션 하나와 막힐 때 쓸 안전 도구 하나를 같이 정하는 감각을 키웁니다.',
    prompt: '첫 미션 하나와 함께 쓸 안전 도구 하나를 같이 적어보세요.',
    placeholder: '예: notes 폴더 회의록 3개만 먼저 요약해보고, 길어지면 /compact로 정리하기',
    hint: '무엇을 먼저 할지 + 막히면 어떤 도구를 쓸지 같이 적어보세요.',
    examples: ['회의록 3개 요약 + /compact', 'README 구조 파악 + Plan Mode'],
    coachFallback: '이 루트는 “첫 미션과 안전 도구를 세트로 잡는 감각”입니다. 둘을 한 줄에 묶어보세요.',
  },
  write_small_first_step: {
    rewardLabel: '아주 작은 첫걸음',
    benefitTitle: '키우는 감각',
    benefitText: '처음부터 크게 하지 않고 아주 작은 첫 단계부터 시작하는 감각을 키웁니다.',
    prompt: '지금 당장 시작할 아주 작은 첫 단계 하나를 적어보세요.',
    placeholder: '예: 전체 앱 말고 README만 먼저 읽고 구조를 설명해달라고 하기',
    hint: '하나만, 작은 범위, 바로 할 수 있는 첫 단계가 드러나면 좋습니다.',
    examples: ['README만 먼저 읽기', '회의록 1개만 요약하기'],
    coachFallback: '이 루트는 “작게 시작하는 감각”입니다. 처음 한 단계만 적어도 충분합니다.',
    passThreshold: 2,
    requiredChecks: [
      {
        id: 'small_scope',
        label: '아주 작은 범위',
        feedback: 'README만, 회의록 1개만, 오늘 것만처럼 범위를 더 작게 적어보세요.',
        patterns: [/만/, /하나/, /1개/, /먼저/, /작게/, /오늘 것만/],
      },
      {
        id: 'first_step',
        label: '첫 단계 행동',
        feedback: '읽기, 요약, 설명해달라고 하기처럼 첫 단계 행동이 필요합니다.',
        patterns: [/읽/, /요약/, /정리/, /설명/, /파악/],
      },
      {
        id: 'optional_safety',
        label: '안전 도구 또는 다음 단계',
        feedback: '/compact나 Plan Mode 같은 안전 장치를 붙이면 더 좋습니다.',
        patterns: [/\/compact/, /plan mode/i, /--continue/, /--resume/, /다음 단계/],
      },
    ],
  },
}

export function getBridgeVariantMeta(choiceValue) {
  if (!choiceValue) return null
  return BRIDGE_VARIANT_META[choiceValue] || null
}

export function evaluateBridgeResponse(questId, text, choiceValue = null) {
  const variantMeta = getBridgeVariantMeta(choiceValue)
  const meta = variantMeta?.requiredChecks ? variantMeta : BRIDGE_RUBRIC_META[questId]
  const safeText = (text || '').trim()

  if (!meta) {
    return {
      passed: safeText.length >= 8,
      matched: [],
      missing: [],
      score: safeText.length >= 8 ? 1 : 0,
      requiredCount: 1,
      readinessLabel: safeText.length >= 8 ? 'solid' : 'needs_work',
    }
  }

  const checks = meta.requiredChecks.map((check) => {
    const matched = check.patterns.some((pattern) => pattern.test(safeText))
    return { ...check, matched }
  })

  const score = checks.filter((check) => check.matched).length
  const requiredCount = meta.requiredChecks.length
  const passed = score >= meta.passThreshold
  const missing = checks.filter((check) => !check.matched)

  let readinessLabel = 'needs_work'
  if (passed && score === requiredCount) readinessLabel = 'ready'
  else if (passed) readinessLabel = 'solid'

  return {
    passed,
    score,
    requiredCount,
    matched: checks.filter((check) => check.matched).map(({ id, label }) => ({ id, label })),
    missing: missing.map(({ id, label, feedback }) => ({ id, label, feedback })),
    readinessLabel,
  }
}
