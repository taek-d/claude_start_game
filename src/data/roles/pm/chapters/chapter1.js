export const chapter1 = {
  id: 1,
  title: '도구를 고르자',
  subtitle: 'Claude Code와 Claude.ai의 차이를 감으로 익히기',
  part: 1,
  artifactReward: 'artifact_tool_fit',
  opening: {
    background: 'office_day',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: 'AI 작업실의 첫 문이 열렸다. 오늘의 목표는 복잡한 설명이 아니라 “감”을 얻는 것이다.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '{playerName}, 첫날에는 완벽히 이해하려 하지 않아도 괜찮아요. 오늘은 어떤 도구가 어떤 순간에 잘 맞는지만 느껴봐요.' },
      { speaker: 'mentor_pm', expression: 'default', text: 'Claude Code는 프로젝트 폴더와 파일을 직접 다루는 흐름에 강하고, Claude.ai는 가벼운 브레인스토밍에 잘 맞아요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '상황 카드를 보고 어느 쪽이 더 자연스러운지 고르면 돼요. 정답보다 감각을 먼저 익히는 시간이라고 생각해봐요.' },
    ],
  },
  problems: ['cc_q1_tool_vs_web'],
  bossChallenge: 'cc_w1_pick_tool',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이제 진짜 도구 감별 보드로 가볼까요? 카드 세 장 중 두 장 이상만 잘 놓아도 충분히 통과예요.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '잘했어요. 이제 “AI 도구는 다 비슷하다”는 막연함이 조금 걷혔죠? 상황에 따라 도구를 고르는 감각이 첫 단추예요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '코치 윤이 작은 퀘스트 보드를 건넸다. 오늘 배운 걸 실제 내 일과 이어보는 시간이다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '내 작업 중 “여러 파일을 함께 봐야 하는 일” 하나를 떠올린다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 바로 그 감각이 브리지 과제예요. 게임 안에서 배운 걸 현실과 연결하기 시작했네요.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 1, value: 'real_multi_file', recommended: true },
      },
      {
        text: '당장은 그냥 재미로만 지나간다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그것도 괜찮아요. 다만 한 번이라도 “실제 내 일”과 이어보면 배움이 훨씬 오래 남아요.' }],
        xpChange: 4,
        confidenceChange: 1,
        bridgeChoice: { questId: 1, value: 'passive', recommended: false },
      },
      {
        text: '브레인스토밍만 필요한 일 하나도 같이 떠올린다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 같은 AI라도 어디에 더 맞는지 비교해보는 감각이 생기기 시작했어요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 1, value: 'compare_both', recommended: true },
      },
    ],
  },
}
