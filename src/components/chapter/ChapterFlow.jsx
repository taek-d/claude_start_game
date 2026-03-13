import { useEffect, useState } from 'react'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { getChapter, getChapterMeta } from '../../data/roleRegistry'
import { BRIDGE_ACTION_META } from '../../data/roles/pm/courseMeta'
import { REALITY_CHECK_META } from '../../data/roles/pm/questSupport'
import VNScene from '../novel/VNScene'
import QuestionRouter from '../questions/QuestionRouter'
import TransitionScene from '../common/TransitionScene'
import BuffSelect from './BuffSelect'
import RealityCheckCard from './RealityCheckCard'

export default function ChapterFlow() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const role = state.playerRole || 'pm'
  const chapter = getChapter(state.currentChapter, role)
  const chapterMeta = getChapterMeta(role).find((item) => item.id === state.currentChapter)
  const bridgeGuide = BRIDGE_ACTION_META[state.currentChapter] || null
  const realityMeta = REALITY_CHECK_META[state.currentChapter] || null
  const [showTransition, setShowTransition] = useState(true)
  const [eventPhase, setEventPhase] = useState('intro')
  const [selectedChoice, setSelectedChoice] = useState(null)

  useEffect(() => {
    setShowTransition(true)
    setEventPhase('intro')
    setSelectedChoice(null)
  }, [state.currentChapter])

  useEffect(() => {
    if (state.chapterPhase === 'problems') {
      const problems = chapter?.problems || []
      if (!problems[state.currentProblemIndex]) {
        dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })
      }
    }
  }, [chapter, dispatch, state.chapterPhase, state.currentProblemIndex])

  useEffect(() => {
    if (state.chapterPhase === 'boss' && !chapter?.bossChallenge && state.bossIntroShown) {
      dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })
    }
    if (state.chapterPhase === 'event' && !chapter?.event) {
      dispatch({ type: 'CHAPTER_COMPLETE' })
    }
  }, [chapter, dispatch, state.bossIntroShown, state.chapterPhase])

  if (!chapter) return null

  if (showTransition && state.chapterPhase === 'opening') {
    return (
      <TransitionScene
        day={state.currentChapter}
        title={chapter.title}
        subtitle={chapter.subtitle}
        onComplete={() => setShowTransition(false)}
      />
    )
  }

  if (state.chapterPhase === 'opening') {
    return (
      <VNScene
        key={`ch${state.currentChapter}-opening`}
        background={chapter.opening.background}
        characters={chapter.opening.characters}
        dialogues={chapter.opening.dialogues}
        playerName={state.playerName}
        onComplete={() => dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })}
      />
    )
  }

  if (state.chapterPhase === 'briefing') {
    return (
      <VNScene
        key={`ch${state.currentChapter}-briefing`}
        background={chapter.briefing.background}
        characters={chapter.briefing.characters}
        dialogues={chapter.briefing.dialogues}
        playerName={state.playerName}
        onComplete={() => dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })}
      />
    )
  }

  if (state.chapterPhase === 'problems') {
    const problemId = chapter.problems?.[state.currentProblemIndex]
    if (!problemId) return null
    return (
      <div className="w-full">
        <div className="mb-3 text-center">
          <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-semibold text-cyan-100">
            연습 {state.currentProblemIndex + 1}/{chapter.problems.length}
          </span>
        </div>
        <QuestionRouter
          key={problemId}
          problemId={problemId}
          onComplete={() => {
            if (state.currentProblemIndex < chapter.problems.length - 1) {
              dispatch({ type: 'NEXT_PROBLEM' })
            } else {
              dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })
            }
          }}
        />
      </div>
    )
  }

  if (state.chapterPhase === 'boss') {
    if (!state.bossIntroShown && chapter.bossIntro) {
      return (
        <VNScene
          key={`ch${state.currentChapter}-boss-intro`}
          background={chapter.bossIntro.background}
          characters={chapter.bossIntro.characters}
          dialogues={chapter.bossIntro.dialogues}
          playerName={state.playerName}
          onComplete={() => dispatch({ type: 'MARK_BOSS_INTRO_SHOWN' })}
        />
      )
    }

    return (
      <QuestionRouter
        key={chapter.bossChallenge}
        problemId={chapter.bossChallenge}
        onComplete={() => dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })}
      />
    )
  }

  if (state.chapterPhase === 'clear') {
    return (
      <VNScene
        key={`ch${state.currentChapter}-clear`}
        background={chapter.clear.background}
        characters={chapter.clear.characters}
        dialogues={chapter.clear.dialogues}
        playerName={state.playerName}
        onComplete={() => dispatch({ type: 'ADVANCE_CHAPTER_PHASE' })}
      />
    )
  }

  if (state.chapterPhase === 'event') {
    const event = chapter.event
    if (!event) return null

    if (eventPhase === 'intro') {
      return (
        <VNScene
          key={`ch${state.currentChapter}-event-intro`}
          background={event.background}
          dialogues={event.intro.dialogues}
          playerName={state.playerName}
          onComplete={() => setEventPhase('select')}
        />
      )
    }

    if (eventPhase === 'select') {
      return (
        <BuffSelect
          questId={state.currentChapter}
          bridgeTask={chapterMeta?.bridgeTask}
          coachFallback={chapterMeta?.coachFallback}
          guide={bridgeGuide}
          savedResponse={state.bridgeResponses?.[state.currentChapter] || null}
          beginnerMode={state.beginnerMode}
          playerGender={state.playerGender}
          choices={event.choices}
          onSelect={(_, choice, bridgeResponseText, bridgeRubricResult) => {
            setSelectedChoice(choice)
            dispatch({
              type: 'CHOICE_MADE',
              payload: {
                xpChange: choice.xpChange || 0,
                confidenceChange: choice.confidenceChange || 0,
                hintChange: choice.hintChange || 0,
                bridgeChoice: choice.bridgeChoice || null,
                bridgeResponseText,
                bridgeRubricResult,
              },
            })
            setEventPhase('response')
          }}
        />
      )
    }

    if (eventPhase === 'response' && selectedChoice) {
      return (
        <VNScene
          key={`ch${state.currentChapter}-event-response`}
          background={event.background}
          dialogues={selectedChoice.response}
          playerName={state.playerName}
          onComplete={() => {
            if (realityMeta && selectedChoice?.bridgeChoice?.recommended) {
              setEventPhase('reality')
              return
            }
            dispatch({ type: 'CHAPTER_COMPLETE' })
          }}
        />
      )
    }

    if (eventPhase === 'reality' && realityMeta) {
      return (
        <RealityCheckCard
          questId={state.currentChapter}
          meta={realityMeta}
          savedCheck={state.realityChecks?.[state.currentChapter] || null}
          bridgeResponse={state.bridgeResponses?.[state.currentChapter] || null}
          beginnerMode={state.beginnerMode}
          playerGender={state.playerGender}
          onComplete={({ checkedStepIds, note }) => {
            dispatch({
              type: 'SAVE_REALITY_CHECK',
              payload: {
                questId: state.currentChapter,
                checkedStepIds,
                note,
              },
            })
            dispatch({ type: 'CHAPTER_COMPLETE' })
          }}
        />
      )
    }
  }

  return null
}
