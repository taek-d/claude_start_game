import { useMemo, useState } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { CATEGORY_META, RARITY_META, TITLES } from '../../data/titles'
import StatsRadar from './StatsRadar'

const CATEGORIES = ['mission', 'mastery', 'coach', 'hidden']

export default function TitleCollectionModal({ onClose }) {
  const state = useGameState()
  const [category, setCategory] = useState('mission')
  const unlocked = state.unlockedTitles || []

  const filtered = useMemo(() => TITLES.filter((title) => title.category === category), [category])
  const totalUnlocked = TITLES.filter((title) => unlocked.includes(title.id)).length

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40">
        <div className="border-b border-white/8 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">Badge Vault</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">배지 보관함</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/65 transition hover:border-white/25 hover:text-white"
            >
              닫기
            </button>
          </div>
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">해금한 배지</p>
              <p className="text-lg font-bold text-cyan-50">{totalUnlocked}/{TITLES.length}</p>
            </div>
            <p className="mt-2 text-sm text-white/55">현재 랭크: {state.currentTitle}</p>
          </div>
          <div className="mt-4">
            <StatsRadar />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((item) => {
              const meta = CATEGORY_META[item]
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    category === item
                      ? 'border-cyan-200/35 bg-cyan-400/12 text-cyan-50'
                      : 'border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="space-y-3">
            {filtered.map((title) => {
              const isUnlocked = unlocked.includes(title.id)
              const rarity = RARITY_META[title.rarity]
              return (
                <div
                  key={title.id}
                  className={`rounded-3xl border p-4 ${
                    isUnlocked ? 'border-white/10 bg-white/5' : 'border-white/6 bg-white/[0.03] opacity-55'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-2xl">
                      {isUnlocked || !title.secret ? title.icon : '❔'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-bold text-white">{isUnlocked || !title.secret ? title.name : '비밀 배지'}</p>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${rarity.color}20`, color: rarity.color }}>
                          {rarity.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {isUnlocked || !title.secret ? title.desc : '조건을 만족하면 정체가 공개됩니다.'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
