import { useNavigate } from 'react-router-dom'
import { clearSavedGame, useGameDispatch, useGameState } from '../../hooks/useGameState'

export default function GameOver() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-slate-950/85 p-8 text-center shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-200/70">Pause</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">잠깐 다시 정비할까요?</h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          퀘스트 {state.currentChapter}에서 흐름이 끊겼어요. 초보자 코스에서는 잠깐 멈추는 것도 과정의 일부예요. 세이브를 지우지 않고 다시 시작하거나 퀘스트 보드로 돌아갈 수 있습니다.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => dispatch({ type: 'SELECT_CHAPTER', payload: state.currentChapter })}
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
          >
            현재 퀘스트 다시 시작
          </button>
          <button
            onClick={() => dispatch({ type: 'RETURN_TO_QUEST_BOARD' })}
            className="rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:text-white"
          >
            퀘스트 보드로
          </button>
        </div>

        <button
          onClick={() => {
            clearSavedGame()
            dispatch({ type: 'RESET' })
            navigate('/')
          }}
          className="mt-5 rounded-full border border-rose-300/20 bg-rose-400/10 px-6 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/15"
        >
          세이브 지우고 처음으로
        </button>
      </div>
    </div>
  )
}
