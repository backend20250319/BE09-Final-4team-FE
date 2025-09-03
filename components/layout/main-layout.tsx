"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function MainLayout({ children, requireAuth = false, requireAdmin = false }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    loading: isLoading,
    isLoggedIn,
  } = useAuth();

  useEffect(() => {
    console.log('🔍 MainLayout useEffect 실행:', {
      pathname,
      isLoading,
      isLoggedIn,
      requireAuth,
      requireAdmin,
      user,
    });

    if (isLoading) {
      console.log('🚀 MainLayout: 인증 로딩 중, 대기...');
      return;
    }

    console.log('✅ MainLayout: 인증 로딩 완료. 상태 확인 시작. 현재 isLoggedIn:', isLoggedIn);

    if (pathname === '/login') {
      if (isLoggedIn) {
        console.log('➡️ MainLayout: 이미 로그인된 상태로 로그인 페이지 접근. 메인으로 리다이렉트.');
        router.push('/');
      } else {
        console.log('➡️ MainLayout: 로그인 페이지, 로그인 필요.');
      }
      return;
    }

    // if (requireAuth && !isLoggedIn) {
    //   console.log('🚨 MainLayout: 인증 필요 페이지인데 로그인되지 않음. 로그인 페이지로 리다이렉트.');
    //   router.push('/login');
    //   return;
    // }

    if (requireAdmin && (!isLoggedIn || !user?.isAdmin)) {
      console.log(' MainLayout: 관리자 권한 필요 페이지인데 권한 없음. 메인 페이지로 리다이렉트.');
      router.push('/');
      return;
    }

    console.log('✨ MainLayout: 인증 통과. 페이지 렌더링 계속. 현재 경로:', pathname);

  }, [isLoading, isLoggedIn, user, requireAuth, requireAdmin, router, pathname]);

  if (isLoading) {
    console.log(' MainLayout: 로딩 중 텍스트 렌더링...');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-72">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
