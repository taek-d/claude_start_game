import { useEffect, useState } from 'react'

const TYPE_ORDER = { bridge: 0, reality: 1 }

export function buildJournalEntries(state, chapterTitleMap) {
  const entries = []

  Object.entries(state.bridgeResponses || {}).forEach(([questId, entry]) => {
    if (!entry?.text) return
    entries.push({
      id: `bridge-${questId}`,
      type: 'bridge',
      questId: Number(questId),
      questTitle: chapterTitleMap[Number(questId)] || '브릿지',
      label: '브릿지 메모',
      text: entry.text,
      choiceValue: entry.choiceValue,
    })
  })

  Object.entries(state.realityChecks || {}).forEach(([questId, entry]) => {
    if (!entry?.note) return
    entries.push({
      id: `reality-${questId}`,
      type: 'reality',
      questId: Number(questId),
      questTitle: chapterTitleMap[Number(questId)] || '현실 체크',
      label: '현실 체크 메모',
      text: entry.note,
      checkedStepIds: entry.checkedStepIds || [],
    })
  })

  return entries.sort((left, right) => {
    if (left.questId !== right.questId) return left.questId - right.questId
    return TYPE_ORDER[left.type] - TYPE_ORDER[right.type]
  })
}

export function JournalEditModal({ entry, realityMeta, onCancel, onSave }) {
  const [text, setText] = useState(entry?.text || '')
  const [checkedStepIds, setCheckedStepIds] = useState(entry?.checkedStepIds || [])
  const isReality = entry?.type === 'reality'
  const minNoteLength = realityMeta?.minNoteLength || 1

  useEffect(() => {
    if (!entry) {
      setText('')
      setCheckedStepIds([])
      return
    }
    setText(entry.text || '')
    setCheckedStepIds(entry.checkedStepIds || [])
  }, [entry])

  if (!entry) return null

  const canSave = isReality
    ? checkedStepIds.length === (realityMeta?.steps?.length || 0) && text.trim().length >= minNoteLength
    : text.trim().length > 0

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">메모 수정</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">{entry.label}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Quest {entry.questId} · {entry.questTitle}
        </p>

        {isReality && realityMeta?.steps?.length > 0 && (
          <div className="mt-5 rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">체크리스트 수정</p>
            <div className="mt-3 space-y-3">
              {realityMeta.steps.map((step) => {
                const isChecked = checkedStepIds.includes(step.id)
                return (
                  <label
                    key={step.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
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
                          setCheckedStepIds((current) => [...current, step.id])
                          return
                        }
                        setCheckedStepIds((current) => current.filter((item) => item !== step.id))
                      }}
                      className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-950/80 text-emerald-400 focus:ring-emerald-300/40"
                    />
                    <span className="text-sm leading-relaxed text-white/85">{step.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        <div className={`mt-5 rounded-3xl border p-4 ${
          isReality ? 'border-emerald-300/15 bg-emerald-400/10' : 'border-cyan-300/15 bg-cyan-400/10'
        }`}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-[180px] w-full resize-y rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/20"
          />
          {isReality && (
            <p className="mt-3 text-xs text-white/55">
              현실 체크는 체크리스트를 모두 완료하고 메모를 남겨야 저장됩니다.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (!canSave) return
              onSave({
                text: text.trim(),
                checkedStepIds,
              })
            }}
            disabled={!canSave}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LearningJournalModal({ entries, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">학습 기록</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">브릿지 · 현실 체크 전체 기록</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              퀘스트별로 남긴 메모를 한 번에 보고, 필요하면 여기서 바로 수정할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
          >
            닫기
          </button>
        </div>

        <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/60">
              아직 남겨진 브릿지 메모나 현실 체크 메모가 없습니다.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-3xl border p-5 ${
                  entry.type === 'reality'
                    ? 'border-emerald-300/15 bg-emerald-400/10'
                    : 'border-cyan-300/15 bg-cyan-400/10'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Quest {entry.questId} · {entry.questTitle}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-white">{entry.label}</h3>
                  </div>
                  <button
                    onClick={() => onEdit(entry)}
                    className="rounded-full border border-white/12 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
                  >
                    수정하기
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/90">{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
