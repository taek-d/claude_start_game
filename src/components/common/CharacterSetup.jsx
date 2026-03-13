import { useState } from 'react'
import { finalizeNewGameSession, useGameDispatch } from '../../hooks/useGameState'

const companionOptions = [
  {
    id: 'female',
    label: '이서아와 가볍게 시작하기',
    summary: '짧고 응원형 피드백으로 먼저 감을 붙이게 돕습니다.',
    fit: '이런 분께 잘 맞아요: 처음이라 긴 설명보다 “지금 이 정도면 돼요” 같은 가벼운 안내가 편한 사람',
    style: '이런 느낌으로 말해줘요: “괜찮아요. 먼저 이 정도만 보면 돼요.”',
  },
  {
    id: 'male',
    label: '이서아와 차분하게 시작하기',
    summary: '순서와 기준을 차근차근 짚어주는 단계형 피드백으로 진행합니다.',
    fit: '이런 분께 잘 맞아요: 왜 이게 맞는지, 어떤 순서로 보면 되는지 단계별 설명이 있어야 안심되는 사람',
    style: '이런 느낌으로 말해줘요: “순서를 나눠서 보면 됩니다. 다음 기준으로 확인해볼게요.”',
  },
]

export default function CharacterSetup() {
  const dispatch = useGameDispatch()
  const [name, setName] = useState('')
  const [gender, setGender] = useState('female')
  const [beginnerMode, setBeginnerMode] = useState(false)
  const [coachModeAlwaysOn, setCoachModeAlwaysOn] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    finalizeNewGameSession()
    dispatch({
      type: 'START_NEW_GAME',
      payload: {
        name: name.trim(),
        gender,
        role: 'pm',
        beginnerMode,
        coachModeAlwaysOn,
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Quest Setup</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">첫 작업실 프로필 만들기</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          이름 하나와 코치 톤을 고르면 바로 시작할 수 있어요. 여기서는 복잡한 설명보다 첫 성공 경험을 빠르게 만드는 것이 더 중요합니다.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white/75">이름</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 민지"
              maxLength={12}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white outline-none transition focus:border-cyan-200/35"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white/75">이서아의 코칭 톤</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              둘 다 같은 내용을 배우지만, 말투와 힌트 방식이 다릅니다. 편해 보이는 쪽을 고르면 됩니다.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {companionOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    gender === option.id
                      ? 'border-cyan-200/35 bg-cyan-400/12'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <p className="text-[15px] font-bold text-white">{option.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-50/90">{option.summary}</p>
                  <div className="mt-4 space-y-2 text-sm leading-relaxed text-white/60">
                    <p>{option.fit}</p>
                    <p>{option.style}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-cyan-50">이번 코스에서 바로 하게 될 것</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
              <li>- 작업 폴더에서 Claude Code를 시작하는 흐름 익히기</li>
              <li>- 처음 요청을 너무 길지 않게, 대신 구체적으로 만드는 법 배우기</li>
              <li>- 결과가 마음에 안 들 때 멈추고 되돌리고 다시 말하는 안전 루프 익히기</li>
            </ul>
          </div>

          <label className="flex cursor-pointer items-start gap-4 rounded-3xl border border-emerald-200/15 bg-emerald-400/10 p-5 transition hover:border-emerald-200/30 hover:bg-emerald-400/12">
            <input
              type="checkbox"
              checked={beginnerMode}
              onChange={(event) => {
                const nextValue = event.target.checked
                setBeginnerMode(nextValue)
                if (nextValue) setCoachModeAlwaysOn(true)
              }}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-950/80 text-emerald-400 focus:ring-emerald-300/40"
            />
            <div>
              <p className="text-sm font-semibold text-emerald-50">완전 초보 모드</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                터미널, 폴더, 파일 개념이 아직 낯설다면 이 모드로 시작하세요. 코치 모드가 함께 켜지고, 퀘스트 보드와 현실 체크에서 더 쉬운 안내를 먼저 보여줍니다.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-4 rounded-3xl border border-cyan-200/15 bg-cyan-400/10 p-5 transition hover:border-cyan-200/30 hover:bg-cyan-400/12">
            <input
              type="checkbox"
              checked={coachModeAlwaysOn}
              onChange={(event) => setCoachModeAlwaysOn(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-950/80 text-cyan-400 focus:ring-cyan-300/40"
            />
            <div>
              <p className="text-sm font-semibold text-cyan-50">코치 모드 항상 켜기</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                문제를 틀리지 않아도 코치 힌트를 먼저 보여줍니다. 처음 배우는 흐름을 더 안전하게 따라가고 싶다면 켜두세요.
              </p>
            </div>
          </label>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-35"
          >
            작업실 입장하기
          </button>
        </form>
      </div>
    </div>
  )
}
