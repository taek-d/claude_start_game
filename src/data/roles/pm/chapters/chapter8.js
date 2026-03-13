export const chapter8 = {
  id: 8,
  title: '길어져도 괜찮아',
  subtitle: '세션 관리 도구와 첫 실전 사이클을 함께 익히기',
  part: 3,
  artifactReward: 'artifact_first_mission',
  opening: {
    background: 'presentation',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '마지막 퀘스트다. 이제 세션 관리 도구와 첫 실전 사이클을 한 번에 묶어 실제처럼 달려볼 시간이다.' },
      { speaker: 'mentor_pm', expression: 'default', text: '완벽할 필요 없어요. 오늘은 “길어져도 괜찮고, 처음이어도 시작할 수 있다”는 감각을 직접 손에 넣으면 충분합니다.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '`/compact`, `--continue`, `--resume`, Plan Mode, 그리고 첫 실전 사이클. 오늘은 이 손잡이들을 한 바퀴 돌려볼 거예요.' },
    ],
  },
  briefing: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'impressed', text: '지금부터는 강의가 아니라 미션이라고 생각해요. 한 단계씩 고르면 어느새 실제 Claude Code 워크플로우 한 바퀴를 돌게 될 거예요.' },
    ],
  },
  problems: ['cc_q8_session_tools'],
  bossChallenge: 'cc_w8_first_mission',
  bossIntro: {
    background: 'meeting_room',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'mentor_pm', expression: 'serious', text: '좋아요. 이제 첫 실전 사이클을 시작해볼까요? 잘 모르는 순간이 와도 괜찮아요. 지금까지 모은 카드들이 이미 손잡이가 되어줄 거예요.' },
    ],
  },
  clear: {
    background: 'launch_party',
    characters: [{ id: 'mentor_pm', position: 'center' }],
    dialogues: [
      { speaker: 'narrator', text: '마지막 선택이 끝나자 작업실 벽의 카드들이 한 장씩 반짝인다.' },
      { speaker: 'mentor_pm', expression: 'impressed', text: '해냈어요, {playerName}. 이제 당신은 “처음이라서 못 한다”가 아니라 “처음이어도 시작하고, 길어져도 정리할 수 있다” 쪽에 가까워졌어요.' },
      { speaker: 'mentor_pm', expression: 'smile', text: '오늘의 진짜 보상은 점수가 아니라, 실제 내 폴더에서도 한 번 시도해볼 수 있다는 감각이에요.' },
    ],
  },
  event: {
    intro: {
      dialogues: [
        { speaker: 'narrator', text: '수료 직전 마지막 브리지 미션이 열린다. 이제 게임 밖 첫 실전 한 줄과, 막혔을 때 쓸 세션 기술을 함께 정할 시간이다.' },
      ],
    },
    background: 'rooftop',
    choices: [
      {
        text: '내 컴퓨터에서 해볼 첫 미션과 막혔을 때 쓸 세션 기술 하나를 함께 적는다',
        response: [{ speaker: 'mentor_pm', expression: 'impressed', text: '좋아요. 그 두 줄의 결심이 오늘 배움을 현실로 바꾸는 시작점이 됩니다.' }],
        xpChange: 10,
        confidenceChange: 7,
        bridgeChoice: { questId: 8, value: 'pick_mission_and_safety_tool', recommended: true },
      },
      {
        text: '치트시트만 챙기고 다음에 해보기로 한다',
        response: [{ speaker: 'mentor_pm', expression: 'default', text: '그것도 좋아요. 다만 아주 작은 미션 하나를 정해두면 훨씬 쉽게 다시 돌아올 수 있어요.' }],
        xpChange: 6,
        confidenceChange: 3,
        bridgeChoice: { questId: 8, value: 'save_for_later', recommended: false },
      },
      {
        text: '가장 쉬운 첫걸음만 다시 적어본다',
        response: [{ speaker: 'mentor_pm', expression: 'smile', text: '완벽한 계획보다 작은 시작이 더 강해요. 그 감각을 챙겨가면 충분합니다.' }],
        xpChange: 8,
        confidenceChange: 5,
        bridgeChoice: { questId: 8, value: 'write_small_first_step', recommended: true },
      },
    ],
  },
}
