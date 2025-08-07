import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  name: string
  isAdmin: boolean
  needsPasswordReset: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('currentUser')
    
    if (isLoggedIn && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error)
        logout()
      }
    } else {
      const defaultUser: User = {
        email: 'demo@hermesai.com',
        name: '데모 사용자',
        isAdmin: false,
        needsPasswordReset: false
      }
      setUser(defaultUser)
    }
    
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', 'true')
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isLoggedIn')
    setUser(null)
    router.push('/login')
  }

  const requireAuth = () => {
    return true
  }

  const requireAdmin = () => {
    if (!requireAuth()) return false
    if (!user?.isAdmin) {
      router.push('/')
      return false
    }
    return true
  }

  return {
    user,
    isLoading,
    login,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  }
} 