import { getChapter, getMaxChapter } from '../../data/roleRegistry'
import StarRating from '../common/StarRating'
import { getTitleById } from '../../data/titles'
import { useGameDispatch, useGameState } from '../../hooks/useGameState'
import { TOOL_CARDS } from '../../data/roles/pm/courseMeta'

function SavedNoteCard({ title, tone, text }) {
  if (!text) return null
  const classes = tone === 'reality'
    ? 'border-emerald-300/15 bg-emerald-400/10 text-emerald-50/85'
    : 'border-cyan-300/15 bg-cyan-400/10 text-cyan-50/85'

  return (
    <div className={`rounded-3xl border p-5 ${classes}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{title}</p>
      <p className="mt-3 text-sm leading-relaxed">{text}</p>
    </div>
  )
}

export default function ChapterClear() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const role = state.playerRole || 'pm'
  const chapter = getChapter(state.currentChapter, role)
  const stars = state.chapterStars[state.currentChapter] || 0
  const nextBadge = state.pendingTitleUnlock[0] ? getTitleById(state.pendingTitleUnlock[0]) : null
  const artifact = state.lastUnlockedArtifact ? TOOL_CARDS[state.lastUnlockedArtifact] : null
  const isLastChapter = state.currentChapter >= getMaxChapter(role)
  const bridgeMemo = state.bridgeResponses?.[state.currentChapter]?.text || ''
  const realityMemo = state.realityChecks?.[state.currentChapter]?.note || ''

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Quest Clear</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">{chapter?.title}</h1>
        <p className="mt-2 text-white/55">{chapter?.subtitle}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Stars</p>
            <div className="mt-2 flex justify-center"><StarRating count={stars} /></div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">자신감</p>
            <p className="mt-2 text-2xl font-black text-rose-50">{state.confidence}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">랭크</p>
            <p className="mt-2 text-lg font-black text-cyan-50">Lv.{state.level}</p>
            <p className="mt-1 text-sm text-white/50">{state.currentTitle}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">이번 퀘스트 요약</p>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            정답 {state.chapterCorrect}/{state.chapterTotal} · 실수 {state.chapterMistakes}회 · 힌트 {state.hintUsedThisChapter ? '사용함' : '사용 안 함'}
          </p>
        </div>

        {(bridgeMemo || realityMemo) && (
          <div className="mt-6 grid gap-4">
            <SavedNoteCard title="이번 퀘스트의 브릿지 메모" tone="bridge" text={bridgeMemo} />
            <SavedNoteCard title="이번 퀘스트의 현실 체크 메모" tone="reality" text={realityMemo} />
          </div>
        )}

        {artifact && (
          <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">도구 카드 해금</p>
            <p className="mt-3 text-lg font-black text-white">{artifact.icon} {artifact.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-cyan-50/85">{artifact.description}</p>
          </div>
        )}

        {nextBadge && (
          <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/75">새 배지</p>
            <p className="mt-3 text-lg font-black text-white">{nextBadge.icon} {nextBadge.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-amber-50/85">{nextBadge.desc}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => {
              dispatch({ type: 'CLEAR_PENDING_TITLES' })
              dispatch({ type: 'SELECT_CHAPTER', payload: state.currentChapter })
            }}
            className="inline-flex min-w-[108px] items-center justify-center whitespace-nowrap rounded-full border border-white/12 px-5 py-2.5 text-center text-sm font-semibold leading-none text-white/80 transition hover:border-white/25 hover:text-white"
          >
            다시 도전
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'CLEAR_PENDING_TITLES' })
              dispatch({ type: 'NEXT_CHAPTER' })
            }}
            className="inline-flex min-w-[108px] items-center justify-center whitespace-nowrap rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-bold leading-none text-slate-950 transition hover:scale-[1.02]"
          >
            {isLastChapter ? '수료 화면 보기' : '다음 퀘스트'}
          </button>
        </div>
      </div>
    </div>
  )
}
