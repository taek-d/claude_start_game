import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const guestUser = { id: 'guest', email: '게스트 모드', _isGuest: true }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setUser(guestUser)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!supabase) return { data: null, error: { message: '게스트 모드에서는 회원가입이 필요하지 않습니다.' } }
    return supabase.auth.signUp({ email, password })
  }

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: { message: '게스트 모드에서는 로그인 없이 바로 시작할 수 있습니다.' } }
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    if (user?._isGuest) {
      setUser(guestUser)
      return { error: null }
    }
    if (!supabase) return { error: null }
    return supabase.auth.signOut()
  }

  const startGuest = () => {
    setUser(guestUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, startGuest, isGuest: Boolean(user?._isGuest) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
