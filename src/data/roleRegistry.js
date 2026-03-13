import {
  chapters as pmChapters,
  CHAPTER_META as pmChapterMeta,
  PART_META as pmPartMeta,
  getMaxChapter as pmGetMaxChapter,
} from './roles/pm/chapters/index.js'
import { getAllProblems as pmGetAllProblems } from './roles/pm/problems/index.js'
import {
  mentorCharacter as pmMentor,
  colleagueFemale as pmColleagueFemale,
  colleagueMale as pmColleagueMale,
  characterMap as pmCharacterMap,
  backgrounds as pmBackgrounds,
} from './roles/pm/characters.js'
import { LEVEL_TITLES as pmLevelTitles } from './roles/pm/titles.js'

const chapterDataMap = { pm: pmChapters }
const chapterMetaMap = { pm: pmChapterMeta }
const partMetaMap = { pm: pmPartMeta }
const maxChapterMap = { pm: pmGetMaxChapter }
const mentorMap = { pm: pmMentor }
const colleagueMap = {
  pm: {
    female: pmColleagueFemale,
    male: pmColleagueMale,
  },
}
const characterMapByRole = { pm: pmCharacterMap }
const backgroundMap = { pm: pmBackgrounds }
const problemsMap = { pm: pmGetAllProblems }
const levelTitlesMap = { pm: pmLevelTitles }

const roleInfoMap = {
  pm: {
    name: 'cc101',
    color: '#6fb1ff',
    label: 'CC101 Quest',
    description: '초보자가 게임처럼 시작하며 Claude Code 첫 실전 감각을 익히는 코스',
  },
}

export function getChapter(chapterId, role = 'pm') {
  const chapters = chapterDataMap[role]
  return chapters?.[chapterId] || null
}

export function getChapterMeta(role = 'pm') {
  return chapterMetaMap[role] || []
}

export function getPartMeta(role = 'pm') {
  return partMetaMap[role] || {}
}

export function getMaxChapter(role = 'pm') {
  const fn = maxChapterMap[role]
  return fn ? fn() : 0
}

export function getMentorCharacter(role = 'pm') {
  return mentorMap[role] || null
}

export function getColleagueCharacter(role = 'pm', gender = 'female') {
  const colleagues = colleagueMap[role]
  if (!colleagues) return null
  return gender === 'male' ? colleagues.female : colleagues.male
}

export function getRoleCharacters(role = 'pm') {
  return characterMapByRole[role] || {}
}

export function getRoleBackgrounds(role = 'pm') {
  return backgroundMap[role] || {}
}

export function getProblemById(problemId, role = 'pm') {
  const getAllProblems = problemsMap[role]
  return getAllProblems?.().find((problem) => problem.id === problemId) || null
}

export function getLevelTitles(role = 'pm') {
  return levelTitlesMap[role] || []
}

export function getRoleInfo(role = 'pm') {
  return roleInfoMap[role] || null
}

export function getAvailableRoles() {
  return [
    { id: 'pm', available: true },
    { id: 'designer', available: false },
    { id: 'developer', available: false },
  ]
}

export function getCharacterById(characterId, role = 'pm') {
  return characterMapByRole[role]?.[characterId] || null
}

export function getCharacterName(characterId, role = 'pm') {
  return getCharacterById(characterId, role)?.name || characterId
}

export function getCharacterImage(characterId, expression = 'default', role = 'pm') {
  const character = getCharacterById(characterId, role)
  return character?.expressions?.[expression] || character?.expressions?.default || null
}
