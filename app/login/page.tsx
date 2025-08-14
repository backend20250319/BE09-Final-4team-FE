"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface User {
  email: string
  name: string
  isAdmin: boolean
  needsPasswordReset: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    try {
      if (!email.trim() || !password.trim()) {
        setLoginError('이메일과 비밀번호를 모두 입력해주세요.')
        setIsLoading(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setLoginError('올바른 이메일 형식을 입력해주세요.')
        setIsLoading(false)
        return
      }

      if (email === 'bini@hermesai.com') {
        if (password === '12341234') {
          const adminUser: User = {
            email: 'bini@hermesai.com',
            name: '비니비니',
            isAdmin: true,
            needsPasswordReset: false
          }
          
          const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]')
          const biniExists = existingEmployees.find((emp: any) => emp.email === 'bini@hermesai.com')
          // login 전용 관리자 DB
          if (!biniExists) {
            const newBini = {
              id: Date.now().toString(),
              name: '비니비니',
              email: 'bini@hermesai.com',
              phone: '010-0000-0000',
              address: '서울시 강남구',
              joinDate: '2020-01-01',
              organization: '경영진',
              position: 'CEO',
              role: '경영진',
              job: '사업 기획',
              rank: 'CEO',
              isAdmin: true,
              teams: ['경영진', 'CEO', '인사팀', '경영팀'],
              profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
            }
            
            const updatedEmployees = [...existingEmployees, newBini].sort((a, b) => {
              const dateA = new Date(b.joinDate).getTime()
              const dateB = new Date(a.joinDate).getTime()
              return dateA - dateB
            })
            localStorage.setItem('employees', JSON.stringify(updatedEmployees))
          }
          
          localStorage.setItem('currentUser', JSON.stringify(adminUser))
          localStorage.setItem('isLoggedIn', 'true')
          toast.success('로그인 성공!')
          router.push('/')
          return
        } else {
          setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.')
          setIsLoading(false)
          return
        }
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === email && u.password === password)
      
      if (user) {
        const userData: User = {
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          needsPasswordReset: user.needsPasswordReset
        }
        
        localStorage.setItem('currentUser', JSON.stringify(userData))
        localStorage.setItem('isLoggedIn', 'true')
        
        if (user.needsPasswordReset) {
          router.push('/reset-password')
        } else {
          toast.success('로그인 성공!')
          router.push('/')
        }
      } else {
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/80 border-0 shadow-2xl login-card">
        <CardHeader className="text-center">
          {/* 로고 */}
          <div className="flex justify-center mb-4 login-logo">
            <Image src="/logo.png" alt="Hermes Logo" width={200} height={200} />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-wide login-title">
            Sign In
          </CardTitle>
          {/* <CardDescription className="text-gray-600 font-medium text-lg leading-relaxed login-description">
            에르메스의 특별한 경험을 시작하세요
          </CardDescription> */}
        </CardHeader>

        <CardContent className="login-content">
          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div className="space-y-2 login-email">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 tracking-wide">
                Email / ID
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className={`pl-10 h-12 font-medium ${
                    emailError || loginError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
            </div>
            
            <div className="space-y-2 login-password">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className={`pl-10 pr-12 h-12 font-medium ${
                    passwordError || loginError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                {loginError && <p className="text-red-500 text-xs mt-1">{loginError}</p>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>로그인 중...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-6 font-medium tracking-wide login-footer">
            비밀번호를 잊어버렸을 경우 관리자에게 문의 바랍니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 