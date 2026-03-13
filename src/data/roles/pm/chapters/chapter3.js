export const chapter3 = {
  id: 3,
  title: '어디서 시작해야 하지?',
  subtitle: '작업 폴더를 고르는 감각 익히기',
  part: 1,
  artifactReward: 'artifact_prompt_formula',
  opening: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '이제 초보자가 가장 자주 놓치는 질문이 온다. “Claude Code를 어디서 켜야 하지?”' },
      { speaker: 'mentor_pm', expression: 'default', text: 'Claude Code는 현재 폴더를 기준으로 파일과 맥락을 읽어요. 그래서 시작 위치가 생각보다 중요해요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘은 “실제 작업 파일이 들어 있는 폴더에서 시작한다”는 감각만 손에 넣으면 충분해요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '바탕화면, 다운로드 폴더, 실제 프로젝트 폴더 중 어디가 다른지 몸으로 익혀봅시다.' },
    ],
  },
  problems: ['cc_q3_pick_workspace'],
  bossChallenge: 'cc_w3_start_in_folder',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이번에는 잘못 켠 상황까지 포함해서, 폴더 기준으로 다시 시작하는 흐름을 직접 골라볼게요.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 이제 “실제 자료가 있는 폴더에서 시작한다”는 감각이 생겼어요. 이 한 줄이 초보자 실수를 정말 많이 줄여줍니다.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '작업 폴더 카드가 열렸다. 코치 윤은 실제 내 컴퓨터에서 어디를 열지 떠올려보는 브리지 미션을 건넨다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '실제로 Claude Code를 켜고 싶은 폴더 하나를 적어본다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 이제 게임 밖에서도 “어디서 시작할지”가 머릿속에 보이기 시작했네요.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 3, value: 'pick_real_workspace', recommended: true },
      },
      {
        text: '폴더는 나중에 생각하고 그냥 흐름만 기억한다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '흐름을 기억한 것도 좋아요. 다만 실제 폴더와 연결하면 훨씬 오래 남습니다.' }],
        xpChange: 5,
        confidenceChange: 2,
        bridgeChoice: { questId: 3, value: 'remember_only', recommended: false },
      },
      {
        text: '바탕화면과 실제 작업 폴더의 차이를 다시 떠올려본다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 어디서 시작해야 하는지를 구분하는 감각이 지금 자라고 있어요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 3, value: 'compare_locations', recommended: true },
      },
    ],
  },
}
