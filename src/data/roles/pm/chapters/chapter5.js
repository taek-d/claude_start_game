export const chapter5 = {
  id: 5,
  title: '규칙을 남기자',
  subtitle: '/init와 CLAUDE.md로 반복 설명 줄이기',
  part: 2,
  artifactReward: 'artifact_repair_loop',
  opening: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '다섯 번째 퀘스트는 “같은 말을 매번 다시 하지 않는 법”에 관한 미션이다.' },
      { speaker: 'mentor_pm', expression: 'default', text: '초보자는 같은 규칙을 계속 다시 설명하느라 쉽게 지쳐요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '그래서 `/init`와 CLAUDE.md가 있어요. 오래 갈 규칙을 기억 장치로 남겨두는 거죠.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '이번에는 “반복 규칙”과 “이번 요청 전용 지시”를 구분하는 감각부터 익혀볼게요.' },
    ],
  },
  problems: ['cc_q5_repeat_rules'],
  bossChallenge: 'cc_w5_claude_md',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이제 초보용 CLAUDE.md를 직접 적어볼 차례예요. 오래 유지할 규칙만 남긴다고 생각해보세요.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 이제 반복 설명을 조금 덜어낼 수 있어요. 작은 규칙 몇 줄이 초보자에게 큰 여유를 줍니다.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: 'CLAUDE.md 카드가 열렸다. 코치 윤은 실제로 자주 반복하는 규칙을 떠올려보라고 말한다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '내가 자주 반복하는 규칙 두 가지를 적어본다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 방금 적은 두 줄이 나중에는 내 CLAUDE.md의 씨앗이 될 거예요.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 5, value: 'write_two_rules', recommended: true },
      },
      {
        text: '규칙은 매번 그때그때 말하기로 한다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그렇게도 할 수 있지만, 반복될수록 피로가 쌓여요. 한 번 적어두면 훨씬 편해집니다.' }],
        xpChange: 4,
        confidenceChange: 1,
        bridgeChoice: { questId: 5, value: 'repeat_in_chat_only', recommended: false },
      },
      {
        text: '오래 갈 규칙과 이번 요청 전용 지시를 구분해본다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 바로 그 구분이 CLAUDE.md를 자연스럽게 쓰게 만드는 핵심이에요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 5, value: 'separate_long_term_rules', recommended: true },
      },
    ],
  },
}
