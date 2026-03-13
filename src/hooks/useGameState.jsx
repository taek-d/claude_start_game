import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { checkTitleUnlocks } from '../data/titles'
import { getChapterMeta, getLevelTitles, getMaxChapter } from '../data/roleRegistry'
import { REALITY_CHECK_META, evaluateBridgeResponse } from '../data/roles/pm/questSupport'
import { supabase } from '../lib/supabase'

const GameContext = createContext(null)
const GameDispatchContext = createContext(null)

const CAMPAIGN_VERSION = 'cc101-quest-v4'
const STORAGE_KEY = 'cc101-quest-save-v4'
const FORCE_NEW_GAME_KEY = 'cc101-quest-force-new-game-v4'
const SAVE_DEBOUNCE_MS = 2000

const XP_TABLE = [0, 80, 200, 400, 700, 1100, 1600, 2200, 3000, 4000]
const SKILL_KEYS = ['toolSense', 'promptCraft', 'recovery', 'workflow']

const defaultStats = {
  toolSense: 12,
  promptCraft: 10,
  recovery: 10,
  workflow: 10,
}

const defaultMastery = {
  toolSense: 0,
  promptCraft: 0,
  recovery: 0,
  workflow: 0,
}

const initialState = {
  campaignVersion: CAMPAIGN_VERSION,
  phase: 'title',
  playerName: '',
  playerGender: 'female',
  playerRole: 'pm',
  currentChapter: 1,
  maxUnlockedChapter: 1,
  chapterPhase: 'opening',
  currentProblemIndex: 0,
  storyIndex: 0,
  bossIntroShown: false,
  xp: 0,
  level: 1,
  levelAtChapterStart: 1,
  confidence: 35,
  solvedProblems: [],
  correctCount: 0,
  incorrectCount: 0,
  currentTitle: '작업실 견습생',
  unlockedTitles: [],
  pendingTitleUnlock: [],
  chapterStars: {},
  chapterPassStatus: {},
  hints: 5,
  hintUsedThisChapter: false,
  chapterCorrect: 0,
  chapterTotal: 0,
  chapterMistakes: 0,
  chapterAttemptedProblems: [],
  chapterProblemResults: {},
  isReplayChapterRun: false,
  attemptCount: 0,
  beginnerMode: false,
  coachModeAlwaysOn: false,
  coachMode: false,
  coachHelpUsed: false,
  hintFreeChapters: 0,
  artifactUnlocks: [],
  lastUnlockedArtifact: null,
  masteryBySkill: { ...defaultMastery },
  stats: { ...defaultStats },
  bridgeChoices: {},
  bridgeResponses: {},
  bridgeRubricResults: {},
  bridgeTaskCount: 0,
  realityChecks: {},
  hintUsageByProblem: {},
  misconceptionLog: {},
  completionSummary: null,
}

function getDefaultLevelTitle(role = 'pm') {
  const titles = getLevelTitles(role)
  return titles[0] || '작업실 견습생'
}

function createFreshState(role = 'pm') {
  return {
    ...initialState,
    playerRole: role,
    currentTitle: getDefaultLevelTitle(role),
    stats: { ...defaultStats },
    masteryBySkill: { ...defaultMastery },
  }
}

function resetChapterRun(state, chapterId, isReplayChapterRun = false) {
  return {
    ...state,
    phase: 'playing',
    currentChapter: chapterId,
    levelAtChapterStart: state.level,
    chapterPhase: 'opening',
    currentProblemIndex: 0,
    storyIndex: 0,
    hintUsedThisChapter: false,
    chapterCorrect: 0,
    chapterTotal: 0,
    chapterMistakes: 0,
    chapterAttemptedProblems: [],
    chapterProblemResults: {},
    isReplayChapterRun,
    attemptCount: 0,
    coachMode: state.coachModeAlwaysOn,
    bossIntroShown: false,
    pendingTitleUnlock: [],
    lastUnlockedArtifact: null,
  }
}

function mergeState(payload) {
  const role = payload?.playerRole || 'pm'
  const base = createFreshState(role)
  const beginnerMode = Boolean(payload?.beginnerMode)
  const coachModeAlwaysOn = Boolean(payload?.coachModeAlwaysOn || beginnerMode)
  return {
    ...base,
    ...payload,
    campaignVersion: CAMPAIGN_VERSION,
    stats: { ...defaultStats, ...(payload?.stats || {}) },
    masteryBySkill: { ...defaultMastery, ...(payload?.masteryBySkill || {}) },
    beginnerMode,
    coachModeAlwaysOn,
    coachMode: coachModeAlwaysOn || Boolean(payload?.coachMode),
    coachHelpUsed: coachModeAlwaysOn || Boolean(payload?.coachHelpUsed),
    bridgeRubricResults: payload?.bridgeRubricResults || {},
    realityChecks: payload?.realityChecks || {},
    currentTitle: payload?.currentTitle || getLevelTitle(payload?.level || 1, role),
  }
}

export function getLevelFromXP(xp) {
  for (let i = XP_TABLE.length - 1; i >= 0; i -= 1) {
    if (xp >= XP_TABLE[i]) return i + 1
  }
  return 1
}

export function getXPForLevel(level) {
  return XP_TABLE[Math.min(Math.max(level - 1, 0), XP_TABLE.length - 1)]
}

export function getXPForNextLevel(level) {
  if (level >= XP_TABLE.length) return XP_TABLE[XP_TABLE.length - 1]
  return XP_TABLE[level]
}

export function getLevelTitle(level, role = 'pm') {
  const titles = getLevelTitles(role)
  if (!titles.length) return ''
  return titles[Math.min(level - 1, titles.length - 1)]
}

export function getAffectionStage(confidence) {
  if (confidence >= 85) return 5
  if (confidence >= 65) return 4
  if (confidence >= 45) return 3
  if (confidence >= 25) return 2
  return 1
}

export function getTrustLabel(stage) {
  const labels = ['', '긴장', '워밍업', '할 수 있겠다', '이제 된다', '실전 ready']
  return labels[stage] || ''
}

export function getAffectionLabel(stage) {
  return getTrustLabel(stage)
}

function getProblemIdFromPayload(payload) {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload === 'object') return payload.problemId || null
  return null
}

function buildChapterProgress(state, problemId, isCorrect) {
  const nextAttempted = problemId && !state.chapterAttemptedProblems.includes(problemId)
    ? [...state.chapterAttemptedProblems, problemId]
    : state.chapterAttemptedProblems

  const nextResults = problemId
    ? { ...state.chapterProblemResults, [problemId]: isCorrect }
    : state.chapterProblemResults

  return {
    nextAttempted,
    nextResults,
    chapterCorrect: Object.values(nextResults).filter(Boolean).length,
    chapterTotal: Object.keys(nextResults).length,
    wasCorrectBefore: problemId ? Boolean(state.chapterProblemResults[problemId]) : false,
  }
}

function applyStatsReward(stats, statsReward) {
  const next = { ...stats }
  if (!statsReward) return next
  Object.entries(statsReward).forEach(([key, value]) => {
    if (typeof next[key] === 'number') {
      next[key] = Math.max(0, next[key] + value)
    }
  })
  return next
}

function addMastery(state, masteryKey) {
  if (!masteryKey || !SKILL_KEYS.includes(masteryKey)) return state.masteryBySkill
  return {
    ...state.masteryBySkill,
    [masteryKey]: (state.masteryBySkill[masteryKey] || 0) + 1,
  }
}

function incrementCountMap(map, key) {
  if (!key) return map
  return {
    ...map,
    [key]: (map[key] || 0) + 1,
  }
}

function buildCompletionSummary(state) {
  const weakness = [...SKILL_KEYS]
    .map((key) => ({ key, value: state.masteryBySkill[key] || 0 }))
    .sort((a, b) => a.value - b.value)
    .map((entry) => entry.key)

  const realityQuestIds = Object.keys(REALITY_CHECK_META).map(Number)
  const completedRealityChecks = realityQuestIds.filter((questId) => state.realityChecks?.[questId]?.completed)
  const bridgeEntries = Object.entries(state.bridgeRubricResults || {})
    .filter(([, result]) => result && !result.skipped)
  const bridgeQuestIds = bridgeEntries.map(([questId]) => questId)
  const readyBridgeQuestIds = bridgeEntries
    .filter(([, result]) => result?.passed)
    .map(([questId]) => questId)
  const pendingRealityQuestIds = realityQuestIds.filter((questId) => !state.realityChecks?.[questId]?.completed)
  const bridgeNeedsWorkIds = bridgeEntries
    .filter(([, result]) => !result?.passed)
    .map(([questId]) => Number(questId))

  let readinessLevel = 'warming_up'
  if (completedRealityChecks.length >= realityQuestIds.length && readyBridgeQuestIds.length >= 6) readinessLevel = 'ready_to_launch'
  else if (completedRealityChecks.length >= 3 && readyBridgeQuestIds.length >= 4) readinessLevel = 'solid_progress'

  return {
    clearedChapters: Object.values(state.chapterPassStatus || {}).filter(Boolean).length,
    artifactCount: state.artifactUnlocks.length,
    bridgeTaskCount: state.bridgeTaskCount,
    bridgeReadyCount: readyBridgeQuestIds.length,
    totalBridgeEvaluated: bridgeQuestIds.length,
    realityCheckCount: completedRealityChecks.length,
    totalRealityChecks: realityQuestIds.length,
    pendingRealityQuestIds,
    bridgeNeedsWorkIds,
    readinessLevel,
    weakestSkills: weakness.slice(0, 2),
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_NEW_GAME': {
      const role = action.payload?.role || 'pm'
      const beginnerMode = Boolean(action.payload?.beginnerMode)
      const coachModeAlwaysOn = Boolean(action.payload?.coachModeAlwaysOn || beginnerMode)
      return {
        ...createFreshState(role),
        phase: 'chapter_select',
        playerName: action.payload?.name || '',
        playerGender: action.payload?.gender || 'female',
        beginnerMode,
        coachModeAlwaysOn,
        coachMode: coachModeAlwaysOn,
        coachHelpUsed: coachModeAlwaysOn,
      }
    }

    case 'LOAD_GAME': {
      if (!action.payload || action.payload.campaignVersion !== CAMPAIGN_VERSION) {
        return createFreshState(action.payload?.playerRole || 'pm')
      }
      return mergeState(action.payload)
    }

    case 'ANSWER_CORRECT': {
      const payload = action.payload || {}
      const problemId = getProblemIdFromPayload(payload)
      const progress = buildChapterProgress(state, problemId, true)
      const rewards = payload.rewards || {}
      const shouldReward = !progress.wasCorrectBefore && !state.isReplayChapterRun
      const xpGain = shouldReward ? (rewards.xpReward || 8) + (!state.hintUsedThisChapter ? 2 : 0) : 0
      const newXP = state.xp + xpGain
      const newLevel = getLevelFromXP(newXP)
      const solvedProblems = problemId && !state.solvedProblems.includes(problemId)
        ? [...state.solvedProblems, problemId]
        : state.solvedProblems

      return {
        ...state,
        xp: newXP,
        level: newLevel,
        confidence: shouldReward
          ? Math.min(100, state.confidence + (rewards.confidenceChange || 3))
          : state.confidence,
        currentTitle: getLevelTitle(newLevel, state.playerRole || 'pm'),
        solvedProblems,
        correctCount: progress.wasCorrectBefore ? state.correctCount : state.correctCount + 1,
        chapterCorrect: progress.chapterCorrect,
        chapterTotal: progress.chapterTotal,
        chapterAttemptedProblems: progress.nextAttempted,
        chapterProblemResults: progress.nextResults,
        attemptCount: 0,
        coachMode: state.coachModeAlwaysOn,
        stats: shouldReward ? applyStatsReward(state.stats, rewards.statsReward) : state.stats,
        masteryBySkill: shouldReward ? addMastery(state, rewards.masteryKey) : state.masteryBySkill,
      }
    }

    case 'ANSWER_INCORRECT': {
      const payload = action.payload || {}
      const problemId = getProblemIdFromPayload(payload)
      const progress = buildChapterProgress(state, problemId, false)
      const nextAttemptCount = state.attemptCount + 1
      const nextCoachMode = state.coachModeAlwaysOn || nextAttemptCount >= 2

      return {
        ...state,
        incorrectCount: state.incorrectCount + 1,
        confidence: Math.max(0, state.confidence - 1),
        chapterCorrect: progress.chapterCorrect,
        chapterTotal: progress.chapterTotal,
        chapterAttemptedProblems: progress.nextAttempted,
        chapterProblemResults: progress.nextResults,
        chapterMistakes: state.chapterMistakes + 1,
        attemptCount: nextAttemptCount,
        coachMode: nextCoachMode,
        coachHelpUsed: state.coachHelpUsed || nextCoachMode,
        misconceptionLog: incrementCountMap(state.misconceptionLog, payload.misconceptionTag),
      }
    }

    case 'CHOICE_MADE': {
      const {
        confidenceChange = 0,
        xpChange = 0,
        hintChange = 0,
        bridgeChoice = null,
        bridgeResponseText = '',
        bridgeRubricResult = null,
        statsChange = null,
      } = action.payload || {}
      const questId = bridgeChoice?.questId
      const isNewBridge = questId && !state.bridgeChoices[questId]
      const nextXP = Math.max(0, state.xp + xpChange)
      const nextLevel = getLevelFromXP(nextXP)
      return {
        ...state,
        confidence: Math.max(0, Math.min(100, state.confidence + confidenceChange)),
        xp: nextXP,
        level: nextLevel,
        currentTitle: getLevelTitle(nextLevel, state.playerRole || 'pm'),
        hints: Math.max(0, state.hints + hintChange),
        stats: applyStatsReward(state.stats, statsChange),
        bridgeChoices: questId
          ? { ...state.bridgeChoices, [questId]: bridgeChoice.value }
          : state.bridgeChoices,
        bridgeResponses: questId
          ? {
              ...state.bridgeResponses,
              [questId]: {
                choiceValue: bridgeChoice.value,
                text: bridgeResponseText.trim(),
              },
            }
          : state.bridgeResponses,
        bridgeRubricResults: questId && bridgeRubricResult
          ? (
              bridgeRubricResult.skipped && state.bridgeRubricResults?.[questId]?.passed
                ? state.bridgeRubricResults
                : {
                    ...state.bridgeRubricResults,
                    [questId]: bridgeRubricResult,
                  }
            )
          : state.bridgeRubricResults,
        bridgeTaskCount: isNewBridge ? state.bridgeTaskCount + 1 : state.bridgeTaskCount,
      }
    }

    case 'SAVE_REALITY_CHECK': {
      const { questId, checkedStepIds = [], note = '' } = action.payload || {}
      if (!questId) return state

      return {
        ...state,
        realityChecks: {
          ...state.realityChecks,
          [questId]: {
            checkedStepIds,
            note: note.trim(),
            completed: checkedStepIds.length > 0 && note.trim().length > 0,
          },
        },
      }
    }

    case 'UPDATE_BRIDGE_RESPONSE': {
      const { questId, text = '' } = action.payload || {}
      const existing = state.bridgeResponses?.[questId]
      if (!questId || !existing) return state

      const trimmed = text.trim()
      const currentResult = state.bridgeRubricResults?.[questId]
      const nextResult = currentResult?.skipped
        ? currentResult
        : evaluateBridgeResponse(Number(questId), trimmed, existing.choiceValue)

      return {
        ...state,
        bridgeResponses: {
          ...state.bridgeResponses,
          [questId]: {
            ...existing,
            text: trimmed,
          },
        },
        bridgeRubricResults: {
          ...state.bridgeRubricResults,
          [questId]: nextResult,
        },
        completionSummary: buildCompletionSummary({
          ...state,
          bridgeResponses: {
            ...state.bridgeResponses,
            [questId]: {
              ...existing,
              text: trimmed,
            },
          },
          bridgeRubricResults: {
            ...state.bridgeRubricResults,
            [questId]: nextResult,
          },
        }),
      }
    }

    case 'UPDATE_REALITY_NOTE': {
      const { questId, note = '' } = action.payload || {}
      const existing = state.realityChecks?.[questId]
      if (!questId || !existing) return state

      const trimmed = note.trim()
      const nextRealityChecks = {
        ...state.realityChecks,
        [questId]: {
          ...existing,
          note: trimmed,
          completed: existing.checkedStepIds.length > 0 && trimmed.length > 0,
        },
      }

      return {
        ...state,
        realityChecks: nextRealityChecks,
        completionSummary: buildCompletionSummary({
          ...state,
          realityChecks: nextRealityChecks,
        }),
      }
    }

    case 'ADVANCE_CHAPTER_PHASE': {
      const phaseOrder = ['opening', 'briefing', 'problems', 'boss', 'clear', 'event']
      const currentIndex = phaseOrder.indexOf(state.chapterPhase)
      const nextPhase = phaseOrder[currentIndex + 1]
      if (!nextPhase) return state
      return {
        ...state,
        chapterPhase: nextPhase,
        storyIndex: 0,
        currentProblemIndex: 0,
        attemptCount: 0,
        coachMode: state.coachModeAlwaysOn,
        bossIntroShown: nextPhase === 'boss' ? false : state.bossIntroShown,
      }
    }

    case 'MARK_BOSS_INTRO_SHOWN':
      return { ...state, bossIntroShown: true }

    case 'NEXT_PROBLEM':
      return {
        ...state,
        currentProblemIndex: state.currentProblemIndex + 1,
        attemptCount: 0,
        coachMode: state.coachModeAlwaysOn,
      }

    case 'USE_HINT': {
      if (state.hints <= 0) return state
      return {
        ...state,
        hints: state.hints - 1,
        hintUsedThisChapter: true,
        hintUsageByProblem: incrementCountMap(state.hintUsageByProblem, action.payload?.problemId),
      }
    }

    case 'SET_STORY_INDEX':
      return { ...state, storyIndex: action.payload }

    case 'CHAPTER_COMPLETE': {
      const currentChapter = state.currentChapter
      const currentStars = state.chapterStars[currentChapter] || 0
      const stars = state.chapterTotal === 0
        ? 0
        : state.chapterMistakes === 0 && !state.hintUsedThisChapter
          ? 3
          : state.chapterMistakes <= 2
            ? 2
            : 1
      const maxChapter = getMaxChapter(state.playerRole || 'pm') || 8
      const chapterMeta = getChapterMeta(state.playerRole || 'pm').find((chapter) => chapter.id === currentChapter)
      const artifactId = chapterMeta?.artifactReward
      const unlockArtifact = stars >= 1 && artifactId && !state.artifactUnlocks.includes(artifactId)
      const nextUnlock = stars >= 1 ? Math.min(maxChapter, currentChapter + 1) : state.maxUnlockedChapter
      const nextState = {
        ...state,
        phase: 'chapter_clear',
        maxUnlockedChapter: Math.max(state.maxUnlockedChapter, nextUnlock),
        chapterStars: { ...state.chapterStars, [currentChapter]: Math.max(currentStars, stars) },
        chapterPassStatus: { ...state.chapterPassStatus, [currentChapter]: stars >= 1 },
        hintFreeChapters: !state.hintUsedThisChapter && !state.isReplayChapterRun
          ? state.hintFreeChapters + 1
          : state.hintFreeChapters,
        artifactUnlocks: unlockArtifact ? [...state.artifactUnlocks, artifactId] : state.artifactUnlocks,
        lastUnlockedArtifact: unlockArtifact ? artifactId : null,
      }
      const newlyUnlocked = checkTitleUnlocks(nextState)
      return {
        ...nextState,
        unlockedTitles: [...nextState.unlockedTitles, ...newlyUnlocked],
        pendingTitleUnlock: newlyUnlocked,
        completionSummary: buildCompletionSummary(nextState),
      }
    }

    case 'NEXT_CHAPTER': {
      const maxChapter = getMaxChapter(state.playerRole || 'pm') || 8
      if (state.currentChapter >= maxChapter) {
        return {
          ...state,
          phase: 'game_complete',
          completionSummary: buildCompletionSummary(state),
        }
      }
      return {
        ...state,
        phase: 'chapter_select',
        currentChapter: state.currentChapter + 1,
        levelAtChapterStart: state.level,
        chapterPhase: 'opening',
        currentProblemIndex: 0,
        storyIndex: 0,
        hintUsedThisChapter: false,
        chapterCorrect: 0,
        chapterTotal: 0,
        chapterMistakes: 0,
        chapterAttemptedProblems: [],
        chapterProblemResults: {},
        isReplayChapterRun: false,
        attemptCount: 0,
        coachMode: state.coachModeAlwaysOn,
        bossIntroShown: false,
        pendingTitleUnlock: [],
        lastUnlockedArtifact: null,
      }
    }

    case 'SELECT_CHAPTER': {
      const chapterId = action.payload
      const maxChapter = getMaxChapter(state.playerRole || 'pm') || 8
      if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > maxChapter) return state
      if (chapterId > state.maxUnlockedChapter) return state
      const isReplayChapterRun = (state.chapterStars[chapterId] || 0) >= 1
      return resetChapterRun(state, chapterId, isReplayChapterRun)
    }

    case 'CLEAR_PENDING_TITLES':
      return { ...state, pendingTitleUnlock: [] }

    case 'UNLOCK_TITLE':
      if (!action.payload || state.unlockedTitles.includes(action.payload)) return state
      return { ...state, unlockedTitles: [...state.unlockedTitles, action.payload] }

    case 'EQUIP_TITLE':
      return { ...state, currentTitle: action.payload || state.currentTitle }

    case 'GAME_OVER':
      return { ...state, phase: 'game_over' }

    case 'RETURN_TO_QUEST_BOARD':
      return {
        ...state,
        phase: 'chapter_select',
        chapterPhase: 'opening',
        currentProblemIndex: 0,
        storyIndex: 0,
        attemptCount: 0,
        coachMode: state.coachModeAlwaysOn,
        bossIntroShown: false,
      }

    case 'RESET':
      return createFreshState(state.playerRole || 'pm')

    default:
      return state
  }
}

function loadSavedGame() {
  const snapshot = loadLocalSnapshot()
  return snapshot?.saveData ?? null
}

function loadLocalSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.saveData && typeof parsed.saveData === 'object') {
      return {
        saveData: parsed.saveData,
        updatedAt: parsed.updatedAt || null,
        userId: parsed.userId || null,
      }
    }
    return { saveData: parsed, updatedAt: null, userId: null }
  } catch {
    return null
  }
}

function saveLocalSnapshot(saveData, userId, updatedAt = null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      saveData,
      updatedAt: updatedAt || new Date().toISOString(),
      userId: userId || null,
    }))
  } catch {
    // ignore
  }
}

function consumeForceNewGameFlag() {
  try {
    const shouldForce = localStorage.getItem(FORCE_NEW_GAME_KEY) === '1'
    if (shouldForce) localStorage.removeItem(FORCE_NEW_GAME_KEY)
    return shouldForce
  } catch {
    return false
  }
}

function clearForceNewGameFlag() {
  try {
    localStorage.removeItem(FORCE_NEW_GAME_KEY)
  } catch {
    // ignore
  }
}

function parseTimestamp(ts) {
  if (!ts || typeof ts !== 'string') return 0
  const ms = Date.parse(ts)
  return Number.isFinite(ms) ? ms : 0
}

function isLocalNewerThanCloud(localSnapshot, cloudSnapshot) {
  if (!localSnapshot?.saveData) return false
  if (!cloudSnapshot?.saveData) return true
  return parseTimestamp(localSnapshot.updatedAt) > parseTimestamp(cloudSnapshot.updatedAt)
}

async function loadFromSupabase(userId) {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('save_data, updated_at')
      .eq('user_id', userId)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      return null
    }
    if (!data?.save_data) return null
    if (data.save_data.campaignVersion !== CAMPAIGN_VERSION) return null
    return { saveData: data.save_data, updatedAt: data.updated_at || null, userId }
  } catch {
    return null
  }
}

async function saveToSupabase(userId, saveData) {
  try {
    await supabase
      .from('game_saves')
      .upsert({ user_id: userId, save_data: saveData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  } catch {
    // ignore
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, createFreshState())
  const [isHydrating, setIsHydrating] = useState(true)
  const saveTimerRef = useRef(null)
  const initialLoadDone = useRef(false)
  const currentUserIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function loadSave() {
      try {
        const forceNewGame = consumeForceNewGameFlag()
        if (forceNewGame) {
          if (!cancelled) {
            localStorage.removeItem(STORAGE_KEY)
            initialLoadDone.current = true
            setIsHydrating(false)
          }
          return
        }

        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          const userId = session?.user?.id || null
          currentUserIdRef.current = userId

          if (userId) {
            const cloudSave = await loadFromSupabase(userId)
            const localSnapshot = loadLocalSnapshot()
            const localForUser = localSnapshot?.userId === userId ? localSnapshot : null

            if (!cancelled && localForUser?.saveData && isLocalNewerThanCloud(localForUser, cloudSave)) {
              dispatch({ type: 'LOAD_GAME', payload: localForUser.saveData })
              await saveToSupabase(userId, localForUser.saveData)
            } else if (!cancelled && cloudSave?.saveData) {
              dispatch({ type: 'LOAD_GAME', payload: cloudSave.saveData })
              saveLocalSnapshot(cloudSave.saveData, userId, cloudSave.updatedAt)
            }

            if (!cancelled) {
              initialLoadDone.current = true
              setIsHydrating(false)
            }
            return
          }
        }

        if (!cancelled) {
          const localSnapshot = loadLocalSnapshot()
          if (localSnapshot?.saveData?.campaignVersion === CAMPAIGN_VERSION) {
            dispatch({ type: 'LOAD_GAME', payload: localSnapshot.saveData })
          }
          initialLoadDone.current = true
          setIsHydrating(false)
        }
      } catch {
        if (!cancelled) {
          initialLoadDone.current = true
          setIsHydrating(false)
        }
      }
    }

    loadSave()
    return () => { cancelled = true }
  }, [])

  const debouncedCloudSave = useCallback((saveState) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || null
      currentUserIdRef.current = userId
      if (userId) await saveToSupabase(userId, saveState)
    }, SAVE_DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    if (!initialLoadDone.current) return
    if (state.phase !== 'title') {
      saveLocalSnapshot(state, currentUserIdRef.current)
      debouncedCloudSave(state)
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [state, debouncedCloudSave])

  return (
    <GameContext.Provider value={{ ...state, isHydrating }}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  )
}

export function useGameState() {
  return useContext(GameContext)
}

export function useGameDispatch() {
  return useContext(GameDispatchContext)
}

export function hasSavedGame() {
  return loadSavedGame() !== null
}

export function getSavedGame() {
  return loadSavedGame()
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function beginNewGameSession() {
  try {
    localStorage.setItem(FORCE_NEW_GAME_KEY, '1')
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }

  if (!supabase) return
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id
    if (!userId) return
    await supabase.from('game_saves').delete().eq('user_id', userId)
  } catch {
    // ignore
  }
}

export function finalizeNewGameSession() {
  clearForceNewGameFlag()
}
