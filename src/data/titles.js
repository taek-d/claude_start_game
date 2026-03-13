export const TITLES = [
  { id: 'badge_bridge_first', name: '첫 브리지', icon: '🌉', category: 'mission', rarity: 'common', desc: '브리지 과제를 처음 남겼습니다.', secret: false },
  { id: 'badge_part1', name: '작업실 입장 완료', icon: '🚀', category: 'mission', rarity: 'uncommon', desc: '퀘스트 1~2를 모두 클리어했습니다.', secret: false },
  { id: 'badge_part2', name: '요청 빌더', icon: '🧩', category: 'mission', rarity: 'rare', desc: '퀘스트 3~5를 모두 클리어했습니다.', secret: false },
  { id: 'badge_part3', name: '안전 운영자', icon: '🛡️', category: 'mission', rarity: 'epic', desc: '퀘스트 6~8을 모두 클리어했습니다.', secret: false },
  { id: 'badge_clean_clear', name: '힌트 없이 클리어', icon: '✨', category: 'mastery', rarity: 'rare', desc: '힌트 없이 퀘스트를 클리어했습니다.', secret: false },
  { id: 'badge_confident', name: '할 수 있겠다', icon: '💪', category: 'mastery', rarity: 'uncommon', desc: '자신감 60을 달성했습니다.', secret: false },
  { id: 'badge_card_collector', name: '도구 카드 수집가', icon: '🗂️', category: 'mastery', rarity: 'rare', desc: '도구 카드 4장을 모았습니다.', secret: false },
  { id: 'badge_coach_ready', name: '코치와 다시 시도', icon: '🫶', category: 'coach', rarity: 'common', desc: '코치 모드의 도움으로 한 번 다시 일어섰습니다.', secret: false },
  { id: 'badge_capstone', name: '첫 실전 완료', icon: '🏅', category: 'coach', rarity: 'epic', desc: '캡스톤 퀘스트를 클리어했습니다.', secret: false },
  { id: 'badge_all_clear', name: 'CC101 러너', icon: '🎓', category: 'hidden', rarity: 'legendary', desc: '모든 퀘스트를 클리어했습니다.', secret: true },
]

export const CATEGORY_META = {
  mission: { label: '미션', color: '#6fb1ff' },
  mastery: { label: '성장', color: '#48A868' },
  coach: { label: '코치', color: '#f08db5' },
  hidden: { label: '히든', color: '#ffd261' },
}

export const RARITY_META = {
  common: { label: '기본', color: '#8899b0' },
  uncommon: { label: '좋음', color: '#48A868' },
  rare: { label: '특별', color: '#5b8df0' },
  epic: { label: '반짝', color: '#b07aa1' },
  legendary: { label: '전설', color: '#ffd261' },
}

export function getTitleById(titleId) {
  return TITLES.find((title) => title.id === titleId) || null
}

export function checkTitleUnlocks(state) {
  const unlocked = state.unlockedTitles || []
  const chapterStars = state.chapterStars || {}
  const newTitles = []
  const hasCleared = (ids) => ids.every((id) => (chapterStars[id] || 0) >= 1)
  const totalCleared = Object.values(chapterStars).filter((stars) => stars >= 1).length

  if (!unlocked.includes('badge_bridge_first') && (state.bridgeTaskCount || 0) >= 1) newTitles.push('badge_bridge_first')
  if (!unlocked.includes('badge_part1') && hasCleared([1, 2])) newTitles.push('badge_part1')
  if (!unlocked.includes('badge_part2') && hasCleared([3, 4, 5])) newTitles.push('badge_part2')
  if (!unlocked.includes('badge_part3') && hasCleared([6, 7, 8])) newTitles.push('badge_part3')
  if (!unlocked.includes('badge_clean_clear') && (state.hintFreeChapters || 0) >= 1) newTitles.push('badge_clean_clear')
  if (!unlocked.includes('badge_confident') && (state.confidence || 0) >= 60) newTitles.push('badge_confident')
  if (!unlocked.includes('badge_card_collector') && (state.artifactUnlocks?.length || 0) >= 4) newTitles.push('badge_card_collector')
  if (!unlocked.includes('badge_coach_ready') && state.coachHelpUsed) newTitles.push('badge_coach_ready')
  if (!unlocked.includes('badge_capstone') && (chapterStars[8] || 0) >= 1) newTitles.push('badge_capstone')
  if (!unlocked.includes('badge_all_clear') && totalCleared >= 8) newTitles.push('badge_all_clear')

  return newTitles
}
