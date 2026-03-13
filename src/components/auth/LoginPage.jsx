import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getRoleBackgrounds } from '../../data/roleRegistry'

const backgrounds = getRoleBackgrounds('pm')

export default function LoginPage() {
  const { signIn, signUp, startGuest } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)
      if (authError) {
        setError(authError.message)
      } else if (isSignUp) {
        setMessage('가입 링크를 메일로 보냈어요. 바로 플레이하려면 게스트 모드를 눌러도 됩니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${backgrounds.office_day})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,177,255,0.16),transparent_40%)]" />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/85 p-7 shadow-2xl shadow-black/40 backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-200/70">CC101 Quest</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">계정을 연결할까요?</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            저장을 기기 밖으로 이어가고 싶다면 로그인하세요. 지금 바로 가볍게 시작하려면 게스트 모드로도 충분합니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-200/35"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              required
              minLength={6}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-200/35"
            />
            {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-50">{error}</p>}
            {message && <p className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-50">{message}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? '처리 중...' : isSignUp ? '계정 만들기' : '로그인'}
            </button>
          </form>

          <button
            onClick={() => {
              setError('')
              setMessage('')
              setIsSignUp((value) => !value)
            }}
            className="mt-4 text-sm text-white/55 transition hover:text-white"
          >
            {isSignUp ? '이미 계정이 있나요? 로그인으로 돌아가기' : '처음인가요? 계정 만들기'}
          </button>

          <button
            onClick={startGuest}
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/8"
          >
            로그인 없이 게스트로 시작하기
          </button>
        </div>
      </main>
    </div>
  )
}
