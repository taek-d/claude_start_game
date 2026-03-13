import { useMemo, useState } from 'react'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { haptics, soundFx } from '../../utils/feedback'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

function CategorizeCard({ card, categories, value, onAssign }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm leading-relaxed text-white/90">{card.text}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onAssign(card.id, category.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              value === category.id
                ? 'border-cyan-200/45 bg-cyan-400/15 text-cyan-50'
                : 'border-white/12 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SequenceCard({ card, index, total, move }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-black text-cyan-50">
        {index + 1}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-white/90">{card.text}</p>
      <div className="flex gap-2">
        <button
          onClick={() => move(index, -1)}
          disabled={index === 0}
          className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/65 transition hover:border-white/25 hover:text-white disabled:opacity-30"
        >
          위
        </button>
        <button
          onClick={() => move(index, 1)}
          disabled={index === total - 1}
          className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/65 transition hover:border-white/25 hover:text-white disabled:opacity-30"
        >
          아래
        </button>
      </div>
    </div>
  )
}

export default function CardSortQuestion({ problem, onComplete }) {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const tone = getCoachingTone(state.playerGender)
  const [assignments, setAssignments] = useState({})
  const [order, setOrder] = useState(problem.cards || [])
  const [evaluation, setEvaluation] = useState(null)

  const showCoach = state.coachMode || evaluation?.passed === false

  const correctCount = useMemo(() => {
    if (problem.mode === 'sequence') {
      return order.filter((card, index) => card.id === problem.correctOrder[index]).length
    }
    return (problem.cards || []).filter((card) => assignments[card.id] === card.correctCategory).length
  }, [assignments, order, problem])

  const totalCount = problem.cards?.length || 0

  const move = (index, delta) => {
    const nextIndex = index + delta
    if (nextIndex < 0 || nextIndex >= order.length) return
    const next = [...order]
    const [item] = next.splice(index, 1)
    next.splice(nextIndex, 0, item)
    setOrder(next)
  }

  const submit = () => {
    const passed = problem.mode === 'sequence'
      ? correctCount === totalCount
      : correctCount >= (problem.minCorrect || totalCount)

    setEvaluation({ passed, correctCount })

    if (passed) {
      soundFx.success()
      haptics.success()
      dispatch({ type: 'ANSWER_CORRECT', payload: { problemId: problem.id, rewards: problem.rewards } })
      return
    }

    soundFx.error()
    haptics.error()
    dispatch({ type: 'ANSWER_INCORRECT', payload: { problemId: problem.id, misconceptionTag: `${problem.id}-sort` } })
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Card Sort</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{problem.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">{problem.question}</p>
          {problem.prompt && <p className="mt-2 text-sm leading-relaxed text-white/55">{problem.prompt}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Progress</p>
          <p className="mt-1 text-lg font-bold text-white/80">{correctCount}/{totalCount}</p>
        </div>
      </div>

      {showCoach && problem.coachHint && (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm leading-relaxed text-cyan-50/90">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">{tone.coachHeading}</p>
          <p className="mt-2">{applyCoachingTone(state.playerGender, problem.coachHint, 'coach')}</p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {problem.mode === 'sequence'
          ? order.map((card, index) => (
            <SequenceCard
              key={card.id}
              card={card}
              index={index}
              total={order.length}
              move={move}
            />
          ))
          : problem.cards.map((card) => (
            <CategorizeCard
              key={card.id}
              card={card}
              categories={problem.categories}
              value={assignments[card.id]}
              onAssign={(cardId, categoryId) => setAssignments((prev) => ({ ...prev, [cardId]: categoryId }))}
            />
          ))}
      </div>

      {evaluation && (
        <div className={`mt-5 rounded-3xl border p-4 ${
          evaluation.passed ? 'border-emerald-300/20 bg-emerald-400/10' : 'border-rose-300/20 bg-rose-400/10'
        }`}>
          <p className="text-sm leading-relaxed text-white/85">
            {evaluation.passed
              ? applyCoachingTone(state.playerGender, problem.explanation, 'success')
              : applyCoachingTone(state.playerGender, `${evaluation.correctCount}개만 맞았어요. ${problem.explanation}`, 'retry')}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        {evaluation && !evaluation.passed && (
          <button
            onClick={() => setEvaluation(null)}
            className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full border border-white/12 px-4 py-2 text-center text-sm leading-none text-white/75 transition hover:border-white/25 hover:text-white"
          >
            {tone.id === 'warm' ? '다시 해볼래요' : '다시 정리하기'}
          </button>
        )}
        {!evaluation?.passed && (
          <button
            onClick={submit}
            className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
          >
            확인하기
          </button>
        )}
        {evaluation?.passed && (
          <button
            onClick={() => onComplete(true)}
            className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
          >
            다음으로
          </button>
        )}
      </div>
    </div>
  )
}
