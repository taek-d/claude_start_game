import { useMemo, useState } from 'react'
import { getChapterMeta, getPartMeta } from '../../data/roleRegistry'
import StarRating from '../common/StarRating'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { REALITY_CHECK_META } from '../../data/roles/pm/questSupport'
import LearningJournalModal, { JournalEditModal, buildJournalEntries } from '../common/LearningJournalModal'
import TitleCollectionModal from '../common/TitleCollectionModal'

function MemoPreview({ title, tone, text, onEdit }) {
  const toneClass = tone === 'reality'
    ? 'border-emerald-300/15 bg-emerald-400/10 text-emerald-50/90'
    : 'border-cyan-300/15 bg-cyan-400/10 text-cyan-50/90'
  const labelClass = tone === 'reality' ? 'text-emerald-200/80' : 'text-cyan-200/75'

  return (
    <div className={`mt-3 rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}>{title}</p>
        <button
          onClick={onEdit}
          className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
        >
          수정
        </button>
      </div>
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {text}
      </p>
      <details className="mt-3 rounded-2xl border border-white/10 bg-black/10 px-3 py-2">
        <summary className="cursor-pointer list-none text-xs font-semibold text-white/75">
          전체 보기
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-white/90">{text}</p>
      </details>
    </div>
  )
}

export default function ChapterSelect() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const role = state.playerRole || 'pm'
  const chapters = useMemo(() => getChapterMeta(role), [role])
  const partMeta = useMemo(() => getPartMeta(role), [role])
  const chapterTitleMap = useMemo(
    () => Object.fromEntries(chapters.map((chapter) => [chapter.id, chapter.title])),
    [chapters],
  )
  const journalEntries = useMemo(() => buildJournalEntries(state, chapterTitleMap), [chapterTitleMap, state])

  const [showVault, setShowVault] = useState(false)
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
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      {showVault && <TitleCollectionModal onClose={() => setShowVault(false)} />}
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

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Quest Map</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">CC101 Quest Board</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              퀘스트를 하나씩 깨며 Claude Code 첫 사용 감각을 익혀보세요. 기본 화면에서는 바로 시작에 필요한 정보만 먼저 보여줍니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">현재 레벨</p>
              <p className="mt-1 text-lg font-black text-cyan-50">Lv.{state.level} · {state.currentTitle}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">자신감</p>
              <p className="mt-1 text-lg font-black text-rose-50">{state.confidence}</p>
            </div>
            <button
              onClick={() => setShowJournal(true)}
              className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/8"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">전체 기록</p>
              <p className="mt-1 text-lg font-black text-white">{journalEntries.length}개 보기</p>
            </button>
            <button
              onClick={() => setShowVault(true)}
              className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/8"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">배지 보관함</p>
              <p className="mt-1 text-lg font-black text-white">{state.unlockedTitles.length}개 열림</p>
            </button>
          </div>
        </div>

        {state.beginnerMode && (
          <div className="mt-6 rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/75">Beginner Mode</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-50/90">
              이 모드에서는 설명보다 “지금 뭘 하면 되는지”를 먼저 따라가면 됩니다. 카드 아래의 <span className="font-semibold">자세히 보기</span>는 필요할 때만 열어도 괜찮아요.
            </p>
          </div>
        )}

        {chapters.length > 0 && (() => {
          const completed = chapters.filter((c) => (state.chapterStars[c.id] || 0) > 0).length
          const pct = Math.round((completed / chapters.length) * 100)
          return (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">코스 진행률</p>
                <p className="text-sm font-bold text-white/80">{completed}/{chapters.length} 퀘스트 · {pct}%</p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })()}

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {chapters.map((chapter) => {
            const unlocked = chapter.id <= state.maxUnlockedChapter
            const stars = state.chapterStars[chapter.id] || 0
            const bridgeMemo = state.bridgeResponses?.[chapter.id]?.text || ''
            const bridgePassed = state.bridgeRubricResults?.[chapter.id]?.passed
            const realityDone = state.realityChecks?.[chapter.id]?.completed
            const realityMemo = state.realityChecks?.[chapter.id]?.note || ''
            const recordCount = Number(Boolean(bridgeMemo)) + Number(Boolean(realityMemo))

            const completed = stars > 0
            const cardClass = completed
              ? 'border-emerald-300/20 bg-emerald-400/5'
              : unlocked
                ? 'border-white/10 bg-white/5'
                : 'border-white/6 bg-white/[0.03] opacity-55'

            return (
              <div
                key={chapter.id}
                className={`rounded-[28px] border p-6 ${cardClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                      {partMeta[chapter.part]?.label} · Quest {chapter.id}
                      {completed && <span className="ml-2 text-emerald-300/80">Clear</span>}
                      {!unlocked && <span className="ml-2 text-white/40">Locked</span>}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{chapter.title}</h2>
                    <p className="mt-2 text-sm text-white/50">{chapter.subtitle}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Stars</p>
                    <div className="mt-1 flex justify-center"><StarRating count={stars} /></div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-white/65">
                    예상 {chapter.estimatedMinutes}분
                  </span>
                  {bridgePassed && (
                    <span className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-cyan-100">
                      브릿지 통과
                    </span>
                  )}
                  {realityDone && (
                    <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-emerald-100">
                      현실 체크 완료
                    </span>
                  )}
                  {recordCount > 0 && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                      기록 {recordCount}개
                    </span>
                  )}
                </div>

                {recordCount > 0 && (
                  <details className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4 open:bg-black/20">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-white/85">
                      내 기록 보기
                    </summary>
                    {bridgeMemo && (
                      <MemoPreview
                        title="내 브릿지 메모"
                        tone="bridge"
                        text={bridgeMemo}
                        onEdit={() => setEditingEntry({
                          id: `bridge-${chapter.id}`,
                          type: 'bridge',
                          questId: chapter.id,
                          questTitle: chapter.title,
                          label: '브릿지 메모',
                          text: bridgeMemo,
                        })}
                      />
                    )}

                    {realityMemo && (
                      <MemoPreview
                        title="내 현실 체크 메모"
                        tone="reality"
                        text={realityMemo}
                        onEdit={() => setEditingEntry({
                          id: `reality-${chapter.id}`,
                          type: 'reality',
                          questId: chapter.id,
                          questTitle: chapter.title,
                          label: '현실 체크 메모',
                          text: realityMemo,
                          checkedStepIds: state.realityChecks?.[chapter.id]?.checkedStepIds || [],
                        })}
                      />
                    )}
                  </details>
                )}

                <details className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4 open:bg-black/20">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white/85">
                    자세히 보기
                  </summary>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Can Do</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{chapter.canDo}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Bridge Task</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{chapter.bridgeTask}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">자주 하는 착각</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{chapter.misconception}</p>
                  </div>
                </details>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 text-sm leading-relaxed text-white/55">
                    {unlocked ? chapter.passRule : '이전 퀘스트를 마치면 열립니다.'}
                  </div>
                  <button
                    onClick={() => unlocked && dispatch({ type: 'SELECT_CHAPTER', payload: chapter.id })}
                    disabled={!unlocked}
                    className={`inline-flex min-w-[108px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-center text-sm font-bold leading-none transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30 ${
                      completed
                        ? 'border border-emerald-300/25 bg-emerald-400/15 text-emerald-50'
                        : 'bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {unlocked ? (completed ? '다시 도전' : '퀘스트 시작') : '잠금'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
