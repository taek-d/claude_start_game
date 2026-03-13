export const chapter2 = {
  id: 2,
  title: '처음 켜기',
  subtitle: '설치, 로그인, 첫 실행의 불안을 줄이기',
  part: 1,
  artifactReward: 'artifact_start_flow',
  opening: {
    background: 'office_day',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '두 번째 퀘스트는 “실행이 안 될 때 어떻게 해야 하지?”라는 초보자의 첫 불안을 다룬다.' },
      { speaker: 'mentor_pm', expression: 'default', text: '처음에는 설치, 로그인, 도움말, 승인 요청 같은 기본 흐름만 익혀도 충분해요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘은 “안 되면 돌아가는 길이 있다”는 감각을 먼저 얻어봅시다.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '설치가 안 됐을 때, 로그인이 필요할 때, 승인 요청이 떴을 때. 이 세 가지만 익혀도 첫날의 불안이 크게 줄어요.' },
    ],
  },
  problems: ['cc_q2_install_issue'],
  bossChallenge: 'cc_w2_first_launch',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이제 설치부터 로그인, `/help`, 승인 요청까지 실제 첫 실행 흐름을 한 번 이어서 골라볼게요.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '잘했어요. 이제 첫날에 막히더라도 “도구가 안 되는 것”이 아니라 “설치·로그인 흐름으로 돌아가면 되는 것”이라는 감각이 생겼어요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '실행 안전 카드가 열렸다. 코치 윤은 게임 밖에서 어디서 막힐지 미리 떠올려보라고 말한다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '설치가 안 될 때와 로그인이 필요할 때를 구분해본다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 막힘의 종류를 구분할 수 있다는 것만으로도 첫날의 불안이 훨씬 줄어듭니다.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 2, value: 'separate_install_and_login', recommended: true },
      },
      {
        text: '일단 안 되면 나중에 하자고 넘긴다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그럴 수도 있어요. 다만 한 번만 기본 흐름을 익혀두면 다시 돌아오기가 훨씬 쉬워집니다.' }],
        xpChange: 4,
        confidenceChange: 1,
        bridgeChoice: { questId: 2, value: 'postpone_launch', recommended: false },
      },
      {
        text: '승인 요청은 내용을 읽고 판단하는 장치라고 메모해둔다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 초보자에게 승인 요청은 겁내야 할 창이 아니라 읽고 판단할 수 있게 해주는 안전 장치예요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 2, value: 'remember_approval', recommended: true },
      },
    ],
  },
}
