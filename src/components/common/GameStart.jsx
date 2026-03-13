import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { beginNewGameSession, getSavedGame, hasSavedGame, useGameDispatch } from '../../hooks/useGameState'
import { useAuth } from '../../hooks/useAuth'
import { getRoleBackgrounds } from '../../data/roleRegistry'

const backgrounds = getRoleBackgrounds('pm')

function NewGameConfirmModal({ saved, starting, onCancel, onConfirm }) {
  if (!saved) return null

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/75">새 퀘스트 시작 확인</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">현재 진행을 덮어쓸까요?</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          지금 저장된 진행은 `퀘스트 {saved.currentChapter} · Lv.{saved.level}` 입니다. 새로 시작하면 이 세이브는 지워지고 처음부터 다시 시작합니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={starting}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {starting ? '새 퀘스트 준비 중...' : '지우고 새로 시작'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GameStart() {
  const dispatch = useGameDispatch()
  const navigate = useNavigate()
  const { user, signOut, isGuest } = useAuth()
  const [starting, setStarting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const savedExists = hasSavedGame()
  const saved = savedExists ? getSavedGame() : null

  const proceedNewGame = async () => {
    if (starting) return
    setStarting(true)
    await beginNewGameSession()
    dispatch({ type: 'RESET' })
    navigate('/play')
  }

  const startNew = async () => {
    if (savedExists) {
      setShowConfirm(true)
      return
    }
    await proceedNewGame()
  }

  const resume = () => {
    if (!saved) return
    dispatch({ type: 'LOAD_GAME', payload: saved })
    navigate('/play')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {showConfirm && (
        <NewGameConfirmModal
          saved={saved}
          starting={starting}
          onCancel={() => setShowConfirm(false)}
          onConfirm={proceedNewGame}
        />
      )}

      <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${backgrounds.office_day})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,177,255,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 to-slate-950" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-200/70">Mission Intro Game</p>
          <h1 className="mt-5 text-6xl font-black tracking-tight text-white md:text-7xl">CC101 Quest</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
            처음 배우는 사람도 겁먹지 않고 들어와, 짧은 퀘스트를 깨며 Claude Code의 첫 실전 감각을 익히는 미션형 입문 게임
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['첫 5분 성공', '실패해도 안전', '게임 밖으로 연결'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                {item}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3">
            <button
              onClick={startNew}
              disabled={starting}
              className="rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {starting ? '새 퀘스트 준비 중...' : '새 퀘스트 시작'}
            </button>
            {savedExists && (
              <button
                onClick={resume}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/8"
              >
                이어하기
                <span className="mt-1 block text-sm font-normal text-white/55">
                  퀘스트 {saved.currentChapter} · Lv.{saved.level}
                </span>
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="absolute right-6 top-5 z-10 flex items-center gap-3 text-xs text-white/50">
        <span>{isGuest ? '게스트 모드' : user?.email}</span>
        {!isGuest && (
          <button onClick={signOut} className="transition hover:text-white/70">
            로그아웃
          </button>
        )}
      </div>
    </div>
  )
}
