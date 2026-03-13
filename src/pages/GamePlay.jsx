import { useEffect } from 'react'
import {
  getAffectionStage,
  getLevelTitle,
  getTrustLabel,
  getXPForLevel,
  getXPForNextLevel,
  useGameState,
} from '../hooks/useGameState'
import { getChapter } from '../data/roleRegistry'
import CharacterSetup from '../components/common/CharacterSetup'
import ChapterFlow from '../components/chapter/ChapterFlow'
import ChapterSelect from '../components/chapter/ChapterSelect'
import ChapterClear from '../components/chapter/ChapterClear'
import GameOver from '../components/common/GameOver'
import GameComplete from '../components/common/GameComplete'

export default function GamePlay() {
  const state = useGameState()

  useEffect(() => {
    window.render_game_to_text = () => {
      const chapter = getChapter(state.currentChapter, state.playerRole || 'pm')
      return [
        `phase=${state.phase}`,
        `chapter=${state.currentChapter}`,
        `chapterPhase=${state.chapterPhase}`,
        `title=${chapter?.title || ''}`,
        `level=${state.level}`,
        `confidence=${state.confidence}`,
        `coachMode=${state.coachMode ? 'on' : 'off'}`,
      ].join('\n')
    }

    window.advanceTime = async (ms = 1000) => new Promise((resolve) => window.setTimeout(resolve, ms))

    return () => {
      delete window.render_game_to_text
      delete window.advanceTime
    }
  }, [state])

  if (state.isHydrating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
        <p className="text-sm text-white/50">세이브를 불러오는 중...</p>
      </div>
    )
  }

  if (state.phase === 'title' || state.phase === 'setup') return <CharacterSetup />
  if (state.phase === 'chapter_select') return <ChapterSelect />
  if (state.phase === 'chapter_clear') return <ChapterClear />
  if (state.phase === 'game_over') return <GameOver />
  if (state.phase === 'game_complete') return <GameComplete />

  if (state.phase === 'playing') {
    const chapter = getChapter(state.currentChapter, state.playerRole || 'pm')
    const levelTitle = getLevelTitle(state.level, state.playerRole || 'pm')
    const currentLevelXP = getXPForLevel(state.level)
    const nextLevelXP = getXPForNextLevel(state.level)
    const progress = nextLevelXP > currentLevelXP
      ? ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
      : 100

    const vnPhases = ['opening', 'briefing', 'clear', 'event']
    const isBossIntro = state.chapterPhase === 'boss' && !state.bossIntroShown && Boolean(chapter?.bossIntro)
    const isVN = vnPhases.includes(state.chapterPhase) || isBossIntro

    if (isVN) return <ChapterFlow />

    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                Quest {state.currentChapter} · {chapter?.title}
              </p>
              <p className="mt-1 text-sm text-white/50">{chapter?.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Lv.{state.level} · {levelTitle}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                자신감 {getTrustLabel(getAffectionStage(state.confidence))} · {state.confidence}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                코치 모드 {state.coachMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-6xl items-center px-6 py-6">
          <div className="w-full">
            <ChapterFlow />
          </div>
        </main>
      </div>
    )
  }

  return null
}
