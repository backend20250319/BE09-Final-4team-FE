"use client"

import { useRouter } from 'next/navigation';
import { setAccessToken, clearAccessToken, getAccessToken } from '@/lib/services/common/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface TokenData {
  accessToken: string;
  expiresIn: number;
}

let user: User | null = null

function setUser(userData: User | null) {
  user = userData
}

// TODO: Context API 기반 새로운 방식으로 대체 예정 - 석진
export function useAuth() {
  const router = useRouter();
  const isLoggedIn = !!user

  const login = (userData: User, tokenData: TokenData) => {
    setUser(userData);
    setAccessToken(tokenData.accessToken);
  };

  const logout = () => {
    setUser(null);
    clearAccessToken();
    router.push('/login');
  };

  const requireAuth = (): boolean => {
    if (!isLoggedIn) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireAdmin = (): boolean => {
    if (!requireAuth()) return false;
    if (!user?.isAdmin) {
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: isLoggedIn,
    isAdmin: user?.isAdmin || false
  };
} 