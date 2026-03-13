import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { GameProvider } from './hooks/useGameState'
import LoginPage from './components/auth/LoginPage'
import GameStart from './components/common/GameStart'
import GamePlay from './pages/GamePlay'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
        <p className="text-sm text-white/50">로딩 중...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameStart />} />
          <Route path="/play" element={<GamePlay />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
