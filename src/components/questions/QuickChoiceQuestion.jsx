import { useMemo, useState } from 'react'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { soundFx, haptics } from '../../utils/feedback'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

function CoachHint({ problem, show, playerGender }) {
  if (!show || !problem.coachHint) return null
  const tone = getCoachingTone(playerGender)
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{tone.coachHeading}</p>
      <p className="mt-2 leading-relaxed text-cyan-50/90">{applyCoachingTone(playerGender, problem.coachHint, 'coach')}</p>
    </div>
  )
}

export default function QuickChoiceQuestion({ problem, onComplete }) {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const tone = getCoachingTone(state.playerGender)
  const [result, setResult] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const activeHint = useMemo(() => {
    if (!showHint || !problem.hints?.length) return null
    const index = Math.min(wrongCount, problem.hints.length - 1)
    return problem.hints[index]
  }, [problem.hints, showHint, wrongCount])

  const handleChoice = (choice) => {
    if (result?.passed) return
    if (choice.isCorrect) {
      soundFx.success()
      haptics.success()
      dispatch({ type: 'ANSWER_CORRECT', payload: { problemId: problem.id, rewards: problem.rewards } })
      setResult({
        passed: true,
        feedback: applyCoachingTone(state.playerGender, choice.feedback || problem.explanation, 'success'),
      })
      return
    }

    soundFx.error()
    haptics.error()
    dispatch({ type: 'ANSWER_INCORRECT', payload: { problemId: problem.id, misconceptionTag: problem.id } })
    setWrongCount((count) => count + 1)
    setResult({
      passed: false,
      feedback: applyCoachingTone(state.playerGender, choice.feedback || problem.explanation, 'retry'),
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Quick Choice</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{problem.title || '선택 미션'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">{problem.question}</p>
          {problem.prompt && <p className="mt-2 text-sm leading-relaxed text-white/55">{problem.prompt}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Hints</p>
          <p className="mt-1 text-lg font-bold text-white/80">{state.hints}</p>
        </div>
      </div>

      <CoachHint problem={problem} show={state.coachMode || wrongCount >= 1} playerGender={state.playerGender} />

      {activeHint && (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-50">
          <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/75">Hint</span>
          {applyCoachingTone(state.playerGender, activeHint, 'hint')}
        </div>
      )}

      <div className="mt-5 grid gap-3">
        {problem.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            disabled={Boolean(result?.passed)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-[15px] leading-relaxed text-white/90 transition hover:border-cyan-200/35 hover:bg-white/8 disabled:cursor-default disabled:hover:border-white/10"
          >
            {choice.text}
          </button>
        ))}
      </div>

      {result && (
        <div className={`mt-5 rounded-2xl border p-4 ${
          result.passed ? 'border-emerald-300/20 bg-emerald-400/10' : 'border-rose-300/20 bg-rose-400/10'
        }`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
            result.passed ? 'text-emerald-200/80' : 'text-rose-200/80'
          }`}>
            {result.passed ? 'Success' : 'Try Again'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{result.feedback}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            dispatch({ type: 'USE_HINT', payload: { problemId: problem.id } })
            setShowHint(true)
          }}
          disabled={state.hints <= 0 || !problem.hints?.length || result?.passed}
          className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/65 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          힌트 보기
        </button>

        <div className="flex gap-2">
          {result && !result.passed && (
            <button
              onClick={() => setResult(null)}
              className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full border border-white/12 px-4 py-2 text-center text-sm leading-none text-white/75 transition hover:border-white/25 hover:text-white"
            >
              {tone.id === 'warm' ? '다시 해볼래요' : '다시 정리하기'}
            </button>
          )}
          {result?.passed && (
            <button
              onClick={() => onComplete(true)}
              className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
            >
              다음으로
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
