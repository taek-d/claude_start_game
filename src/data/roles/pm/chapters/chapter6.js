export const chapter6 = {
  id: 6,
  title: '좋은 요청 만들기',
  subtitle: '구체성, 범위, 결과 형식, @파일을 한 번에 묶기',
  part: 2,
  artifactReward: 'artifact_claude_md',
  opening: {
    background: 'office_day',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '이제 초보자들이 가장 많이 떨리는 순간으로 돌아온다. “그래서 나는 뭐라고 써야 하지?”' },
      { speaker: 'mentor_pm', expression: 'default', text: '좋은 요청은 화려한 문장이 아니라, Claude Code가 바로 움직일 수 있는 정보예요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘은 구체성, 범위, 결과 형식, 그리고 `@파일`을 한 번에 묶는 감각을 익혀볼 거예요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '길게 쓰는 것보다 빠지지 않는 것이 중요해요. 먼저 좋은 요청을 고르고, 그다음 직접 적어볼게요.' },
    ],
  },
  problems: ['cc_q6_good_request'],
  bossChallenge: 'cc_w6_file_request',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이번에는 `@파일`까지 포함해 실전형 요청을 직접 적어봅시다. 완벽할 필요는 없어요. 핵심 요소만 챙기면 됩니다.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 이제 “길게 말해야 한다”보다 “빠지지 않게 말한다”는 기준이 생겼어요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '좋은 요청 카드가 해금되었다. 코치 윤은 실제 자료를 기준으로 첫 요청 한 줄을 남겨보라고 한다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '실제 자료를 떠올려 @파일이 들어간 요청 한 줄을 적어본다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 방금부터 게임 밖에서도 바로 써먹을 수 있는 요청이 생기기 시작했어요.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 6, value: 'write_real_file_prompt', recommended: true },
      },
      {
        text: '카드만 저장해두고 나중에 쓴다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '카드를 챙긴 것도 좋아요. 다만 한 번만 직접 적어보면 훨씬 빨리 내 것이 됩니다.' }],
        xpChange: 5,
        confidenceChange: 2,
        bridgeChoice: { questId: 6, value: 'save_card_only', recommended: false },
      },
      {
        text: '범위와 결과 형식 두 가지부터 먼저 적어본다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 처음에는 두 가지부터 적어도 충분해요. 여기에 @파일만 붙이면 훨씬 선명해집니다.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 6, value: 'start_with_scope_and_result', recommended: true },
      },
    ],
  },
}
