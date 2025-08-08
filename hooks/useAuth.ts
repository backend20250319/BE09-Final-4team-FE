"use client"

import { useState, useEffect } from 'react'

interface User {
  email: string
  name: string
  isAdmin: boolean
  needsPasswordReset?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 로그인 상태 확인
    const currentUser = localStorage.getItem('currentUser')
    const loginStatus = localStorage.getItem('isLoggedIn')
    
    if (currentUser && loginStatus === 'true') {
      try {
        const userData = JSON.parse(currentUser)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error)
        // 잘못된 데이터면 로그아웃 처리
        logout()
      }
    }
    
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', 'true')
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isLoggedIn')
  }

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout
  }
} 