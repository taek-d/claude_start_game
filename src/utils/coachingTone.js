const TONE_META = {
  female: {
    id: 'warm',
    label: '가볍게',
    setupLabel: '짧고 응원형',
    coachHeading: '이서아 · 가볍게',
    prefixes: {
      coach: '괜찮아요. ',
      hint: '먼저 이 정도만 보면 돼요. ',
      retry: '방향은 맞아요. ',
      success: '좋아요. ',
      beginner: '지금은 한 단계만 해봐도 충분해요. ',
      bridge: '부담 없이 실제 내 일에 한 번 붙여보면 돼요. ',
      reality: '완벽하지 않아도 괜찮아요. ',
      summary: '여기까지 온 것만으로도 꽤 감이 붙은 거예요. ',
    },
  },
  male: {
    id: 'structured',
    label: '차분하게',
    setupLabel: '단계형 안내',
    coachHeading: '이서아 · 차분하게',
    prefixes: {
      coach: '순서를 나눠서 보면 됩니다. ',
      hint: '다음 기준으로 확인하면 됩니다. ',
      retry: '핵심 요소를 하나씩 다시 보면 됩니다. ',
      success: '구조는 잘 잡혔습니다. ',
      beginner: '체크리스트 순서대로 진행하면 됩니다. ',
      bridge: '이번 선택으로 어떤 감각을 키우는지 기준을 분명히 해봅시다. ',
      reality: '실제 행동을 단계별로 점검하면 됩니다. ',
      summary: '이제 실행 준비도를 순서대로 점검해보면 됩니다. ',
    },
  },
}

export function getCoachingTone(playerGender = 'female') {
  return TONE_META[playerGender] || TONE_META.female
}

export function applyCoachingTone(playerGender, text, kind = 'coach') {
  if (!text) return text
  const tone = getCoachingTone(playerGender)
  const prefix = tone.prefixes[kind] || ''
  return `${prefix}${text}`
}
