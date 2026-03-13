export const chapter4 = {
  id: 4,
  title: '먼저 읽게 하기',
  subtitle: '바로 구현보다 먼저 파악하게 만드는 첫 요청',
  part: 2,
  artifactReward: 'artifact_atfile',
  opening: {
    background: 'office_day',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '네 번째 퀘스트의 테마는 “바로 해결하려 하지 말고 먼저 읽게 하기”다.' },
      { speaker: 'mentor_pm', expression: 'default', text: '초보자는 처음부터 구현이나 결론을 시키고 싶어지지만, 실제로는 자료를 먼저 읽게 하는 쪽이 훨씬 안전해요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘은 README, 회의 메모, CSV 같은 자료를 먼저 읽게 하는 요청을 몸으로 익혀볼 거예요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '첫 요청은 “무엇이 들어 있는지 먼저 알려줘”에 가까울수록 초보자에게 더 좋은 출발이 됩니다.' },
    ],
  },
  problems: ['cc_q4_read_first'],
  bossChallenge: 'cc_w4_project_scan',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이번에는 실제 파일 이름을 붙여서, 먼저 읽고 파악하게 만드는 요청을 직접 적어봅시다.' },
    ],
  },
  clear: {
    background: 'office_night',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 이제 “바로 구현”보다 “먼저 읽게 하기”가 더 안전하다는 감각이 생겼어요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '프로젝트 파악 카드가 열렸다. 코치 윤은 실제 자료를 떠올려 먼저 읽게 할 문서 묶음을 골라보라고 한다.' },
      ],
    },
    background: 'cafe',
    choices: [
      {
        text: '실제로 먼저 읽게 할 문서나 파일 묶음을 떠올린다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 이제 게임 밖에서도 “무엇부터 읽게 할까?”가 보이기 시작했네요.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 4, value: 'pick_real_read_first_files', recommended: true },
      },
      {
        text: '일단 결론부터 만들어 달라고 시킨다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그럴 수도 있지만, 먼저 읽게 하는 한 줄이 훨씬 좋은 결과를 가져올 때가 많아요.' }],
        xpChange: 4,
        confidenceChange: 1,
        bridgeChoice: { questId: 4, value: 'jump_to_solution', recommended: false },
      },
      {
        text: '문서, 메모, 데이터처럼 자료 종류를 먼저 구분해본다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '좋아요. 자료의 성격을 먼저 아는 것만으로도 다음 요청이 훨씬 선명해집니다.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 4, value: 'separate_material_types', recommended: true },
      },
    ],
  },
}
