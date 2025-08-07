import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  needsPasswordReset: boolean
  role?: string
  department?: string
  position?: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  requireAuth: () => boolean
  requireAdmin: () => boolean
  isAuthenticated: boolean
  isAdmin: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
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
        // 시연용이므로 에러가 있어도 데모 사용자로 설정
        setDemoUser()
      }
    } else {
      // 로그인되지 않은 경우 데모 사용자로 설정 (시연용)
      setDemoUser()
    }
    
    setIsLoading(false)
  }, [])

  const setDemoUser = () => {
    const demoUser: User = {
      id: 'demo-1',
      email: 'demo@hermesai.com',
      name: '데모 사용자',
      isAdmin: true,
      needsPasswordReset: false,
      role: '관리자',
      department: '경영진',
      position: 'CEO',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
    setUser(demoUser)
  }

  const login = (userData: User) => {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', 'true')
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isLoggedIn')
    setUser(null)
    // 시연용이므로 로그아웃해도 데모 사용자로 다시 설정
    setDemoUser()
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    }
  }

  const requireAuth = () => {
    // 시연용이므로 항상 true 반환
    return true
  }

  const requireAdmin = () => {
    // 시연용이므로 항상 true 반환
    return true
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 