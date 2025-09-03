"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/lib/services/user/api'
import { setAccessToken, clearAccessToken } from '@/lib/services/common/api-client'

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User, tokens: { accessToken: string; expiresIn: number }) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = (userData: User, tokens: { accessToken: string; expiresIn: number }) => {
    const user: User = {
      id: Number(userData.id),
      email: userData.email,
      name: userData.name,
      role: userData.role
    }
    
    setUser(user)
    setAccessToken(tokens.accessToken)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
    } finally {
      setUser(null)
      clearAccessToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.refresh()
      const user: User = {
        id: response.userId,
        email: response.email,
        name: response.name,
        role: response.role
      }
      setUser(user)
      setAccessToken(response.accessToken)
      console.log('인증 갱신 성공:', user)
    } catch (error) {
      console.error('인증 갱신 실패:', error)
      setUser(null)
      clearAccessToken()
    }
  }

  // 토큰 갱신 이벤트 리스너
  useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      const { userId, email, name, role } = event.detail
      const user: User = {
        id: userId,
        email,
        name,
        role
      }
      setUser(user)
      console.log('인증이 자동으로 갱신되었습니다.')
    }

    const handleTokenExpired = () => {
      setUser(null)
      console.error('인증이 만료되었습니다.')
    }

    window.addEventListener('auth:token-refreshed', handleTokenRefresh as EventListener)
    window.addEventListener('auth:token-expired', handleTokenExpired)

    return () => {
      window.removeEventListener('auth:token-refreshed', handleTokenRefresh as EventListener)
      window.removeEventListener('auth:token-expired', handleTokenExpired)
    }
  }, [])

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (user === null) {
          await refreshUser()
        }
      } catch (error) {
        console.log('초기 인증 확인 실패 (정상적인 경우일 수 있음)')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const value: AuthContextType = {
    user,
    login,
    logout,
    refreshUser
  }

  return !loading && <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  const isLoggedIn = !!context.user
  const isAdmin = context.user?.role === 'ADMIN'
  
  return {
    ...context,
    isLoggedIn,
    isAdmin
  }
}