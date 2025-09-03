"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const { user, isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      router.push('/login');
      return;
    }

    if (requireAdmin && (!isLoggedIn || !isAdmin)) {
      router.push('/');
      return;
    }
  }, [isLoggedIn, user, isAdmin, requireAuth, requireAdmin, router]);

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
