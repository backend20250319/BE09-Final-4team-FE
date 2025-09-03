"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/lib/services/user/api'
import { setAccessToken, clearAccessToken } from '@/lib/services/common/api-client'

interface User {
  id: number
  email: string
  name: string
  role: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  login: (userData: Omit<User, 'isAdmin'> & { isAdmin?: boolean }, tokens: { accessToken: string; expiresIn: number }) => void
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

  const login = (userData: Omit<User, 'isAdmin'> & { isAdmin?: boolean }, tokens: { accessToken: string; expiresIn: number }) => {
    const userWithAdmin: User = {
      id: Number(userData.id),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isAdmin: userData.isAdmin || userData.role === 'ADMIN'
    }
    
    setUser(userWithAdmin)
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
      const userWithAdmin: User = {
        id: response.userId,
        email: response.email,
        name: response.name,
        role: response.role,
        isAdmin: response.role === 'ADMIN'
      }
      setUser(userWithAdmin)
      setAccessToken(response.accessToken)
    } catch (error) {
      console.error('토큰 갱신 실패:', error)
      setUser(null)
      clearAccessToken()
    }
  }

  // 토큰 갱신 이벤트 리스너
  useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      const { accessToken, userId, email, name, role } = event.detail
      const userWithAdmin: User = {
        id: userId,
        email,
        name,
        role,
        isAdmin: role === 'ADMIN'
      }
      setUser(userWithAdmin)
      setAccessToken(accessToken)
    }

    const handleTokenRefreshError = () => {
      setUser(null)
      clearAccessToken()
    }

    window.addEventListener('auth:token-refreshed', handleTokenRefresh as EventListener)
    window.addEventListener('auth:token-refresh-error', handleTokenRefreshError)

    return () => {
      window.removeEventListener('auth:token-refreshed', handleTokenRefresh as EventListener)
      window.removeEventListener('auth:token-refresh-error', handleTokenRefreshError)
    }
  }, [])

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser()
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
    isLoggedIn: !!user,
    loading,
    login,
    logout,
    refreshUser
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