import { useEffect, useMemo, useState } from 'react'
import { applyCoachingTone, getCoachingTone } from '../../utils/coachingTone'

export default function RealityCheckCard({
  questId,
  meta,
  savedCheck,
  bridgeResponse,
  beginnerMode = false,
  playerGender = 'female',
  onComplete,
}) {
  const tone = getCoachingTone(playerGender)
  const [checked, setChecked] = useState([])
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!savedCheck) {
      setChecked([])
      setNote('')
      return
    }

    setChecked(savedCheck.checkedStepIds || [])
    setNote(savedCheck.note || '')
  }, [questId, savedCheck])

  const requiredCount = meta?.steps?.length || 0
  const minNoteLength = meta?.minNoteLength || 12
  const trimmedNote = note.trim()
  const allStepsChecked = checked.length === requiredCount
  const isReady = allStepsChecked && trimmedNote.length >= minNoteLength

  const progressLabel = useMemo(() => `${checked.length}/${requiredCount}`, [checked.length, requiredCount])

  if (!meta) return null

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-emerald-300/12 bg-slate-950/85 p-6 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/70">Reality Check</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{meta.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{meta.summary}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Progress</p>
          <p className="mt-1 text-xl font-black text-emerald-50">{progressLabel}</p>
        </div>
      </div>

      {bridgeResponse?.text && (
        <div className="mt-5 rounded-3xl border border-cyan-300/12 bg-cyan-400/8 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">Bridge Memo</p>
          <p className="mt-2 text-sm leading-relaxed text-cyan-50/90">{bridgeResponse.text}</p>
        </div>
      )}

      {beginnerMode && (
        <div className="mt-5 rounded-3xl border border-amber-300/12 bg-amber-400/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">{tone.coachHeading}</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-50/90">
            {applyCoachingTone(playerGender, '여기서는 정답보다 실제로 손을 움직여 보는 게 중요합니다. 아직 다 못 했어도 지금 한 단계만 해보고, 막힌 지점을 메모로 남겨도 괜찮습니다.', 'reality')}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">오늘 직접 해볼 것</p>
          <div className="mt-4 space-y-3">
            {meta.steps.map((step) => {
              const isChecked = checked.includes(step.id)
              return (
                <label
                  key={step.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-3xl border px-4 py-4 transition ${
                    isChecked
                      ? 'border-emerald-300/20 bg-emerald-400/10'
                      : 'border-white/10 bg-black/15 hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setChecked((current) => [...current, step.id])
                        return
                      }
                      setChecked((current) => current.filter((item) => item !== step.id))
                    }}
                    className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-950/80 text-emerald-400 focus:ring-emerald-300/40"
                  />
                  <span className="text-sm leading-relaxed text-white/85">{step.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{meta.notePrompt}</p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={meta.placeholder}
            className="mt-4 min-h-[190px] w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/35 focus:ring-2 focus:ring-emerald-300/20"
          />

          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-relaxed text-white/65">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">체크 기준</p>
            <ul className="mt-3 space-y-2">
              <li>- 체크리스트 {requiredCount}개를 모두 완료해야 합니다.</li>
              <li>- 메모에는 실제로 해본 내용이나 막힌 지점을 구체적으로 적어주세요.</li>
              <li>- 짧아도 괜찮지만, 다음에 다시 꺼내볼 수 있을 만큼은 남기는 게 좋습니다.</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
              메모 {trimmedNote.length}/{minNoteLength}자
            </span>
            <button
              onClick={() => isReady && onComplete({ checkedStepIds: checked, note: trimmedNote })}
              disabled={!isReady}
              className="inline-flex min-w-[152px] items-center justify-center whitespace-nowrap rounded-full bg-emerald-400 px-6 py-3 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
            >
              현실 체크 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
