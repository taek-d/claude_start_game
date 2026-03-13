import { useState } from 'react'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { haptics, soundFx } from '../../utils/feedback'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

export default function WorkflowSimQuestion({ problem, onComplete }) {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const tone = getCoachingTone(state.playerGender)
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [completed, setCompleted] = useState(false)
  const step = problem.steps[stepIndex]

  const handleChoice = (choice) => {
    if (completed) return
    if (choice.correct) {
      soundFx.click()
      setResult({ passed: true, feedback: applyCoachingTone(state.playerGender, choice.feedback, 'success') })
      return
    }
    soundFx.error()
    haptics.error()
    dispatch({ type: 'ANSWER_INCORRECT', payload: { problemId: problem.id, misconceptionTag: `${problem.id}-${step.id}` } })
    setResult({ passed: false, feedback: applyCoachingTone(state.playerGender, choice.feedback, 'retry') })
  }

  const advance = () => {
    if (!result?.passed) return
    if (stepIndex === problem.steps.length - 1) {
      soundFx.success()
      haptics.success()
      dispatch({ type: 'ANSWER_CORRECT', payload: { problemId: problem.id, rewards: problem.rewards } })
      setCompleted(true)
      return
    }
    setStepIndex((index) => index + 1)
    setResult(null)
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Workflow Sim</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{problem.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">{problem.scenario}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Step</p>
          <p className="mt-1 text-lg font-bold text-white/80">{completed ? problem.steps.length : stepIndex + 1}/{problem.steps.length}</p>
        </div>
      </div>

      {(state.coachMode || !result?.passed) && problem.coachHint && (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm leading-relaxed text-cyan-50/90">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">{tone.coachHeading}</p>
          <p className="mt-2">{applyCoachingTone(state.playerGender, problem.coachHint, 'coach')}</p>
        </div>
      )}

      {!completed ? (
        <>
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">현재 단계</p>
            <p className="mt-3 text-[17px] font-semibold leading-relaxed text-white">{step.prompt}</p>
          </div>

          <div className="mt-5 grid gap-3">
            {step.choices.map((choice, index) => (
              <button
                key={`${step.id}-${index}`}
                onClick={() => handleChoice(choice)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-[15px] leading-relaxed text-white/90 transition hover:border-cyan-200/35 hover:bg-white/8"
              >
                {choice.text}
              </button>
            ))}
          </div>

          {result && (
            <div className={`mt-5 rounded-3xl border p-4 ${
              result.passed ? 'border-emerald-300/20 bg-emerald-400/10' : 'border-rose-300/20 bg-rose-400/10'
            }`}>
              <p className="text-sm leading-relaxed text-white/85">{result.feedback}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            {result && !result.passed && (
              <button
                onClick={() => setResult(null)}
                className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full border border-white/12 px-4 py-2 text-center text-sm leading-none text-white/75 transition hover:border-white/25 hover:text-white"
              >
                {tone.id === 'warm' ? '다시 볼게요' : '다시 선택하기'}
              </button>
            )}
            {result?.passed && (
              <button
                onClick={advance}
                className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
              >
                {stepIndex === problem.steps.length - 1 ? '미션 완료' : '다음 단계'}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">Mission Clear</p>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{applyCoachingTone(state.playerGender, problem.completionSummary, 'summary')}</p>
          <button
            onClick={() => onComplete(true)}
            className="mt-5 inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
          >
            다음으로
          </button>
        </div>
      )}
    </div>
  )
}
