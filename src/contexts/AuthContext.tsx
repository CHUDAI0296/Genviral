'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getUserCredits, UserCredits } from '@/lib/credits'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  credits: UserCredits | null
  creditsLoading: boolean
  refreshCredits: () => Promise<void>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(false)

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(null)
      return
    }

    setCreditsLoading(true)
    try {
      const userCredits = await getUserCredits(user.id)
      setCredits(userCredits)
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    } finally {
      setCreditsLoading(false)
    }
  }, [user])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Refresh credits when user changes
      if (session?.user) {
        refreshCredits()
      } else {
        setCredits(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [refreshCredits])

  // Refresh credits when user changes
  useEffect(() => {
    if (user) {
      refreshCredits()
    }
  }, [user, refreshCredits])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    credits,
    creditsLoading,
    refreshCredits,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}