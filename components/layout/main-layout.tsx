"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import ChatbotSticker from "@/app/aichat/components/ChatbotSticker.jsx";
import Chatbot from "@/app/aichat/components/Chatbot.jsx";

interface MainLayoutProps {
  children: ReactNode;
  userName?: string;
  showNotifications?: boolean;
  showUserProfile?: boolean;
  onMenuItemClick?: (index: number) => void;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function MainLayout({
  children,
  userName,
  showNotifications,
  showUserProfile,
  onMenuItemClick,
  requireAuth = false,
  requireAdmin = false,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {
    user,
    isLoading,
    requireAuth: authCheck,
    requireAdmin: adminCheck,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !authCheck()) {
        return;
      }
      if (requireAdmin && !adminCheck()) {
        return;
      }
    }
  }, [isLoading, requireAuth, requireAdmin, authCheck, adminCheck]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar onMenuItemClick={onMenuItemClick} isOpen={sidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Header
          userName={userName}
          showNotifications={showNotifications}
          showUserProfile={showUserProfile}
          onToggleSidebar={toggleSidebar}
        />
        <div className="p-8">{children}</div>
      </div>

      {/* AI 챗봇 스티커 - 항상 표시 */}
      <ChatbotSticker isOpen={isChatOpen} onToggle={toggleChat} />

      {/* AI 챗봇 창 - 열렸을 때만 표시 */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
