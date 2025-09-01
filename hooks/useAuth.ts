"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('currentUser');
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: User, tokenData: TokenData) => {
    setUser(userData);
    setIsLoggedIn(true);
    
    localStorage.setItem('accessToken', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('tokenExpiry', String(Date.now() + tokenData.expiresIn * 1000));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setIsLoggedIn(false);
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
    loading,
    login,
    logout,
    requireAuth,
    requireAdmin,
    getAuthHeaders,
    isAuthenticated: isLoggedIn,
    isAdmin: user?.isAdmin || false
  };
} 