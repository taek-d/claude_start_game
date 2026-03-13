import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSavedGame, useGameDispatch, useGameState } from '../../hooks/useGameState'
import { TOOL_CARDS } from '../../data/roles/pm/courseMeta'
import { REALITY_CHECK_META } from '../../data/roles/pm/questSupport'
import { getChapterMeta } from '../../data/roleRegistry'
import LearningJournalModal, { JournalEditModal, buildJournalEntries } from './LearningJournalModal'

const skillLabels = {
  toolSense: '도구 감각',
  promptCraft: '요청 설계',
  recovery: '복구 감각',
  workflow: '흐름 운영',
}

const readinessMeta = {
  warming_up: {
    title: '시작 준비 중',
    description: '게임 안 흐름은 익혔지만, 실제 환경에서 한 번 더 손을 움직여보면 훨씬 안정됩니다.',
    tone: 'border-amber-300/15 bg-amber-400/10 text-amber-50',
  },
  solid_progress: {
    title: '거의 준비됨',
    description: '브릿지 메모와 현실 체크가 꽤 쌓였습니다. 작은 실제 폴더 하나만 정해 바로 시작해도 좋습니다.',
    tone: 'border-cyan-300/15 bg-cyan-400/10 text-cyan-50',
  },
  ready_to_launch: {
    title: '첫 실전 준비 완료',
    description: '브릿지 과제와 현실 체크를 충분히 통과했습니다. 이제 작은 실제 작업에서 Claude Code를 켜볼 준비가 됐습니다.',
    tone: 'border-emerald-300/15 bg-emerald-400/10 text-emerald-50',
  },
}

export default function GameComplete() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const navigate = useNavigate()
  const summary = state.completionSummary || { weakestSkills: [], pendingRealityQuestIds: [], bridgeNeedsWorkIds: [] }
  const chapterTitleMap = Object.fromEntries(
    getChapterMeta(state.playerRole || 'pm').map((chapter) => [String(chapter.id), chapter.title]),
  )
  const journalEntries = useMemo(() => buildJournalEntries(state, chapterTitleMap), [chapterTitleMap, state])
  const recentBridgeNotes = Object.entries(state.bridgeResponses || {})
    .sort(([leftId], [rightId]) => Number(leftId) - Number(rightId))
    .slice(-3)
  const recentRealityChecks = Object.entries(state.realityChecks || {})
    .filter(([, entry]) => entry?.completed)
    .sort(([leftId], [rightId]) => Number(leftId) - Number(rightId))
    .slice(-3)
  const readiness = readinessMeta[summary.readinessLevel] || readinessMeta.warming_up
  const totalRealityChecks = Object.keys(REALITY_CHECK_META).length

  const [showJournal, setShowJournal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  const saveEditedNote = ({ text, checkedStepIds }) => {
    if (!editingEntry) return

    if (editingEntry.type === 'bridge') {
      dispatch({
        type: 'UPDATE_BRIDGE_RESPONSE',
        payload: {
          questId: editingEntry.questId,
          text,
        },
      })
    } else {
      dispatch({
        type: 'UPDATE_REALITY_CHECK',
        payload: {
          questId: editingEntry.questId,
          note: text,
          checkedStepIds,
        },
      })
    }

    setEditingEntry(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      {showJournal && (
        <LearningJournalModal
          entries={journalEntries}
          onClose={() => setShowJournal(false)}
          onEdit={(entry) => {
            setShowJournal(false)
            setEditingEntry(entry)
          }}
        />
      )}
      {editingEntry && (
        <JournalEditModal
          entry={editingEntry}
          realityMeta={editingEntry.type === 'reality' ? REALITY_CHECK_META[editingEntry.questId] : null}
          onCancel={() => setEditingEntry(null)}
          onSave={saveEditedNote}
        />
      )}

      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Course Complete</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-white">첫 실전 준비도 리포트</h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          이제 당신은 Claude Code를 처음 켜서 작업 폴더에서 시작하고, 자료를 읽히고, 요청을 고치고, 막히면 복구하는 기본 루프를 경험했습니다.
        </p>

        <div className={`mt-6 rounded-[28px] border p-5 ${readiness.tone}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">Readiness</p>
          <h2 className="mt-2 text-2xl font-black text-white">{readiness.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed opacity-90">{readiness.description}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">최종 레벨</p>
            <p className="mt-2 text-2xl font-black text-cyan-50">Lv.{state.level}</p>
            <p className="mt-1 text-sm text-white/50">{state.currentTitle}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">자신감</p>
            <p className="mt-2 text-2xl font-black text-rose-50">{state.confidence}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">도구 카드</p>
            <p className="mt-2 text-2xl font-black text-white">{state.artifactUnlocks.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">브릿지 통과</p>
            <p className="mt-2 text-2xl font-black text-white">
              {summary.bridgeReadyCount || 0}/{summary.totalBridgeEvaluated || 0}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">현실 체크</p>
            <p className="mt-2 text-2xl font-black text-white">
              {summary.realityCheckCount || 0}/{totalRealityChecks}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowJournal(true)}
            className="rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
          >
            전체 기록 보기
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">내가 모은 도구 카드</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {state.artifactUnlocks.map((artifactId) => {
                const artifact = TOOL_CARDS[artifactId]
                if (!artifact) return null
                return (
                  <div key={artifact.id} className="rounded-3xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                    <p className="text-lg font-black text-white">{artifact.icon} {artifact.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{artifact.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">다음에 더 챙기면 좋은 것</p>
            <div className="mt-4 space-y-3">
              {summary.weakestSkills.map((key) => (
                <div key={key} className="rounded-3xl border border-white/10 bg-black/15 p-4">
                  <p className="text-sm font-bold text-white">{skillLabels[key]}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    다음 실제 작업에서 이 감각을 한 번 더 써보면 훨씬 빠르게 익숙해집니다.
                  </p>
                </div>
              ))}

              {summary.pendingRealityQuestIds?.length > 0 && (
                <div className="rounded-3xl border border-amber-300/15 bg-amber-400/10 p-4">
                  <p className="text-sm font-bold text-white">아직 현실 체크가 비어 있는 퀘스트</p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-50/85">
                    {summary.pendingRealityQuestIds.map((questId) => `Quest ${questId} ${chapterTitleMap[String(questId)] || ''}`).join(', ')}
                  </p>
                </div>
              )}

              {summary.bridgeNeedsWorkIds?.length > 0 && (
                <div className="rounded-3xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                  <p className="text-sm font-bold text-white">브릿지 메모를 더 구체화하면 좋은 퀘스트</p>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">
                    {summary.bridgeNeedsWorkIds.map((questId) => `Quest ${questId} ${chapterTitleMap[String(questId)] || ''}`).join(', ')}
                  </p>
                </div>
              )}

              <div className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-4">
                <p className="text-sm font-bold text-white">첫 실전 추천</p>
                <p className="mt-2 text-sm leading-relaxed text-emerald-50/85">
                  진짜 폴더 하나를 정한 뒤, 먼저 구조를 설명해 달라는 요청으로 시작해보세요. 처음부터 구현보다 “읽고 파악하기”가 훨씬 안전합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {recentBridgeNotes.length > 0 && (
          <div className="mt-6 rounded-[28px] border border-cyan-300/15 bg-cyan-400/8 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">최근 브릿지 메모</p>
            <div className="mt-4 grid gap-3">
              {recentBridgeNotes.map(([questId, entry]) => (
                <div key={questId} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-bold text-white">
                    Quest {questId} · {chapterTitleMap[questId] || '브릿지'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentRealityChecks.length > 0 && (
          <div className="mt-6 rounded-[28px] border border-emerald-300/15 bg-emerald-400/8 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/75">최근 현실 체크 메모</p>
            <div className="mt-4 grid gap-3">
              {recentRealityChecks.map(([questId, entry]) => (
                <div key={questId} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-bold text-white">
                    Quest {questId} · {chapterTitleMap[questId] || '현실 체크'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-50/85">{entry.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => {
              clearSavedGame()
              dispatch({ type: 'RESET' })
              navigate('/')
            }}
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
          >
            처음부터 다시 시작
          </button>
        </div>
      </div>
    </div>
  )
}
