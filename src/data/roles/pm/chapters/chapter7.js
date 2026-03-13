export const chapter7 = {
  id: 7,
  title: '마음에 안 들면 되돌리고 다시 말하기',
  subtitle: '승인 요청, 중단, 되돌리기, 후속 지시 익히기',
  part: 3,
  artifactReward: 'artifact_session_safety',
  opening: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '이제 초보자는 다시 불안해지기 쉽다. “혹시 잘못 건드리면 어떡하지?”라는 순간이 찾아온다.' },
      { speaker: 'mentor_pm', expression: 'default', text: '좋은 소식이 있어요. 승인 요청, 중단, 되돌리기, 대화 정리 같은 안전 장치가 이미 준비되어 있다는 거예요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘은 “망쳤다”보다 “돌아가는 길이 있다”는 감각을 익혀볼 거예요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '초보자는 더 빨리 달리는 법보다 안전하게 멈추고 되돌리는 법을 먼저 배울수록 오래 갑니다.' },
    ],
  },
  problems: ['cc_q7_approval_safety'],
  bossChallenge: 'cc_w7_undo_and_retry',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이번에는 승인 요청을 읽고, 실행 중이면 멈추고, 이미 적용됐으면 되돌리고, 대화만 복잡하면 정리하는 흐름을 골라봅시다.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 이제 “잘못되면 끝”이 아니라 “잘못되면 안전하게 돌아갈 수 있다”는 감각이 생겼어요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '복구 안전 카드가 열렸다. 코치 윤은 실제로 막혔을 때 가장 먼저 쓸 기술 하나를 정해보라고 한다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '실행 중 이상하면 먼저 멈추는 습관을 들인다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 멈출 수 있다는 감각은 초보자의 불안을 정말 크게 줄여줍니다.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 7, value: 'interrupt_first', recommended: true },
      },
      {
        text: '뭔가 이상해도 그냥 끝까지 밀어붙인다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그럴수록 더 불안해질 수 있어요. 작은 안전 기술 하나만 잡아도 훨씬 편해집니다.' }],
        xpChange: 4,
        confidenceChange: 1,
        bridgeChoice: { questId: 7, value: 'push_anyway', recommended: false },
      },
      {
        text: '되돌리기와 대화 정리를 각각 다른 손잡이로 기억해둔다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 같은 “복구”라도 어떤 상황에 무엇을 쓰는지 구분하는 것이 핵심이에요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 7, value: 'separate_recovery_tools', recommended: true },
      },
    ],
  },
}
