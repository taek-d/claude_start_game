import { useMemo, useState } from 'react'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { haptics, soundFx } from '../../utils/feedback'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

function evaluatePrompt(problem, answer) {
  const normalized = answer.toLowerCase()
  const present = (patterns = []) => patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))

  const required = (problem.requiredElements || []).map((item) => ({
    ...item,
    matched: present(item.patterns),
  }))
  const bonus = (problem.bonusElements || []).map((item) => ({
    ...item,
    matched: present(item.patterns),
  }))
  const misconceptions = (problem.misconceptions || []).filter((item) => present(item.patterns))
  const requiredCount = required.filter((item) => item.matched).length
  const blocking = misconceptions.filter((item) => item.blocking)

  return {
    required,
    bonus,
    misconceptions,
    requiredCount,
    passed: requiredCount >= (problem.passThreshold || required.length) && blocking.length === 0,
  }
}

function extractContextHints(problem) {
  const hints = []
  const sampleText = [problem.placeholder, problem.goodExample, problem.prompt].filter(Boolean).join(' ')
  const fileMatch = sampleText.match(/@[^\s,]+/)
  if (fileMatch) hints.push(fileMatch[0])

  if ((problem.requiredElements || []).some((item) => item.label?.includes('결과') || item.label?.includes('형식'))) {
    hints.push('결과 형식')
  }

  if ((problem.requiredElements || []).some((item) => item.label?.includes('범위'))) {
    hints.push('범위 좁히기')
  }

  if ((problem.requiredElements || []).some((item) => item.label?.includes('상황'))) {
    hints.push('상황 설명')
  }

  return hints.slice(0, 4)
}

function getWorkspaceLabel(problemId) {
  const questNumber = problemId?.match(/cc_[a-z]?(\d+)/i)?.[1]
  return questNumber
    ? `~/cc101-quest/quest-${questNumber}`
    : '~/cc101-quest/workspace'
}

function getExampleLabel(problem) {
  if (problem.goodExample) return '좋은 요청 예시'
  if (problem.prompt) return '코치 메모'
  return '미션 메모'
}

export default function PromptBuildQuestion({ problem, onComplete }) {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const tone = getCoachingTone(state.playerGender)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [showHint, setShowHint] = useState(false)

  const activeHint = useMemo(() => {
    if (!showHint || !problem.hints?.length) return null
    return problem.hints[Math.min(state.attemptCount, problem.hints.length - 1)]
  }, [problem.hints, showHint, state.attemptCount])

  const contextHints = useMemo(() => extractContextHints(problem), [problem])
  const workspaceLabel = useMemo(() => getWorkspaceLabel(problem.id), [problem.id])
  const requiredChecklist = evaluation?.required || problem.requiredElements || []
  const bonusChecklist = evaluation?.bonus || problem.bonusElements || []

  const handleSubmit = () => {
    if (!answer.trim()) return

    const nextEvaluation = evaluatePrompt(problem, answer)
    setEvaluation(nextEvaluation)

    if (nextEvaluation.passed) {
      soundFx.success()
      haptics.success()
      dispatch({ type: 'ANSWER_CORRECT', payload: { problemId: problem.id, rewards: problem.rewards } })
      return
    }

    soundFx.error()
    haptics.error()
    dispatch({
      type: 'ANSWER_INCORRECT',
      payload: {
        problemId: problem.id,
        misconceptionTag: nextEvaluation.misconceptions[0]?.id || `${problem.id}-missing`,
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-cyan-200/10 bg-[#050c18] shadow-[0_30px_90px_rgba(2,6,23,0.55)]">
      <div className="border-b border-cyan-200/10 bg-[#071325] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/60">Claude Code 실전 창</p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-white md:text-xl">{problem.title}</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-100">
              작업 위치 {workspaceLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-white/70">
              힌트 {state.hints}
            </span>
            <span className={`rounded-full border px-3 py-1.5 font-medium ${
              state.coachMode
                ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
                : 'border-white/10 bg-white/5 text-white/55'
            }`}>
              {tone.label} {state.coachMode ? 'ON' : 'standby'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-cyan-200/10 bg-[#07101d] p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/65">미션 브리프</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{problem.question}</p>
            {problem.prompt && (
              <p className="mt-3 rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-sm leading-relaxed text-white/55">
                {problem.prompt}
              </p>
            )}
          </div>

          <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55">이번 요청에 꼭 넣기</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {requiredChecklist.map((item) => (
                <span
                  key={item.id}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    item.matched
                      ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
                      : 'border-white/10 bg-white/5 text-white/70'
                  }`}
                >
                  {item.matched ? 'OK ' : ''}{item.label}
                </span>
              ))}
              {bonusChecklist.map((item) => (
                <span
                  key={item.id}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    item.matched
                      ? 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100'
                      : 'border-cyan-300/10 bg-cyan-400/5 text-cyan-100/70'
                  }`}
                >
                  + {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55">컨텍스트 힌트</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {contextHints.length > 0 ? (
                contextHints.map((hint) => (
                  <span key={hint} className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-3 py-1.5 text-xs font-medium text-cyan-50/85">
                    {hint}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
                  상황과 목표를 분명하게
                </span>
              )}
            </div>
          </div>

          {Boolean(state.coachMode || evaluation?.misconceptions?.length) && problem.coachHint && (
            <div className="mt-4 rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-100/75">{tone.coachHeading}</p>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
                {applyCoachingTone(state.playerGender, problem.coachHint, 'coach')}
              </p>
            </div>
          )}

          {activeHint && (
            <div className="mt-4 rounded-3xl border border-amber-300/15 bg-amber-400/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-100/75">힌트 열림</p>
              <p className="mt-3 text-sm leading-relaxed text-amber-50/90">
                {applyCoachingTone(state.playerGender, activeHint, 'hint')}
              </p>
            </div>
          )}
        </aside>

        <section className="bg-[#040a14] p-5">
          <div className="rounded-[28px] border border-cyan-200/10 bg-[#081120] shadow-inner shadow-cyan-500/5">
            <div className="border-b border-cyan-200/10 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-2.5 py-1 font-semibold text-cyan-100/85">
                    프롬프트 작성
                  </span>
                  <span className="text-white/50">Ctrl/Cmd + Enter 로 제출</span>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/55">
                  안전한 재시도 가능
                </span>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-3xl border border-white/8 bg-[#0a1629] p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/60">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-[10px] tracking-normal text-cyan-100">
                    coach
                  </span>
                  미션 입력
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{problem.question}</p>
                {problem.prompt && (
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{problem.prompt}</p>
                )}
              </div>

              {evaluation && (
                <div className={`rounded-3xl border p-4 ${
                  evaluation.passed
                    ? 'border-emerald-300/15 bg-emerald-400/10'
                    : 'border-rose-300/15 bg-rose-400/10'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] tracking-normal ${
                        evaluation.passed
                          ? 'border-emerald-300/20 bg-emerald-400/15 text-emerald-100'
                          : 'border-rose-300/20 bg-rose-400/15 text-rose-100'
                      }`}>
                        cc
                      </span>
                      <span className={evaluation.passed ? 'text-emerald-100/80' : 'text-rose-100/80'}>
                        {evaluation.passed ? '요청 통과' : '요청 수정 필요'}
                      </span>
                    </div>
                    <span className="text-xs text-white/55">
                      충족 {evaluation.requiredCount}/{problem.requiredElements?.length || 0}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/85">
                    {evaluation.misconceptions.length > 0 ? (
                      evaluation.misconceptions.map((item) => (
                        <p key={item.id}>- {applyCoachingTone(state.playerGender, item.feedback, 'retry')}</p>
                      ))
                    ) : evaluation.passed ? (
                      <p>- {applyCoachingTone(state.playerGender, '요청에 필요한 요소가 잘 들어갔습니다. 이제 실제 Claude Code에 붙여 넣어도 흐름이 크게 흔들리지 않을 거예요.', 'success')}</p>
                    ) : (
                      <p>- {applyCoachingTone(state.playerGender, '방향은 맞아요. 빠진 요소만 조금 더 채우면 바로 통과할 수 있어요.', 'retry')}</p>
                    )}
                  </div>

                  {!evaluation.passed && (
                    <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-[#071325] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/65">
                        {getExampleLabel(problem)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">
                        {problem.goodExample || problem.prompt}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#02060d]">
                <div className="flex items-center justify-between border-b border-white/8 bg-[#050b15] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-cyan-300">$ claude</span>
                    <span className="text-xs text-white/50">요청 초안 작성 중...</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55">
                      미션 텍스트
                    </span>
                    {state.coachMode && (
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-100/80">
                        코치 보조
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_45%)] p-4">
                  <div className="mb-3 rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2 font-mono text-xs leading-relaxed text-white/55">
                    {workspaceLabel} {contextHints.length ? `· ${contextHints.join(' · ')}` : ''}
                  </div>
                  <div className="relative rounded-3xl border border-cyan-200/10 bg-[#06101f]">
                    <span className="pointer-events-none absolute left-4 top-4 font-mono text-sm text-cyan-300/80">&gt;</span>
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      onKeyDown={(event) => {
                        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                          event.preventDefault()
                          handleSubmit()
                        }
                      }}
                      placeholder={problem.placeholder}
                      className="min-h-[160px] w-full resize-y bg-transparent py-4 pl-9 pr-4 font-mono text-[15px] leading-7 text-white/92 outline-none placeholder:text-white/25 md:min-h-[260px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cyan-200/10 bg-[#050b15] px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    dispatch({ type: 'USE_HINT', payload: { problemId: problem.id } })
                    setShowHint(true)
                  }}
                  disabled={state.hints <= 0 || !problem.hints?.length || evaluation?.passed}
                  className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/65 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  힌트 보기
                </button>
                {evaluation && !evaluation.passed && (
                  <button
                    onClick={() => setEvaluation(null)}
                    className="rounded-full border border-cyan-300/15 bg-cyan-400/8 px-4 py-2 text-sm text-cyan-50/80 transition hover:border-cyan-300/30 hover:bg-cyan-400/12"
                  >
                    {getCoachingTone(state.playerGender).id === 'warm' ? '다시 써볼래요' : '다시 정리하기'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/50">실제 Claude Code처럼 써보고 통과하면 다음으로 넘어갑니다.</span>
                {!evaluation?.passed && (
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="inline-flex min-w-[104px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    제출하기
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
          </div>
        </section>
      </div>
    </div>
  )
}
