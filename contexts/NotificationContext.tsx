"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  webSocketService,
  NotificationMessage,
  NotificationCallback,
} from "@/lib/services/websocket";
import { getAccessToken } from "@/lib/services/common/api-client";

interface NotificationContextType {
  // 웹소켓 연결 상태
  isConnected: boolean;
  // 읽지 않은 알림 여부
  hasUnreadNotifications: boolean;
  // 최근 알림 목록 (실시간으로 받은 것들)
  recentNotifications: NotificationMessage[];
  // 토스트 표시할 알림
  toastNotifications: NotificationMessage[];
  // 알림 읽음 처리
  markAsRead: (notificationId: number) => void;
  // 토스트 제거
  removeToast: (notificationId: number) => void;
  // 읽지 않은 알림 상태 새로고침
  refreshUnreadStatus: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<
    NotificationMessage[]
  >([]);
  const [toastNotifications, setToastNotifications] = useState<
    NotificationMessage[]
  >([]);

  // 새 알림 처리
  const handleNewNotification: NotificationCallback = useCallback(
    (notification) => {
      console.log("새 알림 수신:", notification);

      // 중복 체크: 이미 받은 알림인지 확인
      setRecentNotifications((prev) => {
        const isDuplicate = prev.some(
          (n) => n.notificationId === notification.notificationId
        );
        if (isDuplicate) {
          console.log("중복 알림 무시:", notification.notificationId);
          return prev;
        }
        // 최근 알림 목록에 추가 (최대 10개 유지)
        return [notification, ...prev.slice(0, 9)];
      });

      // 토스트 알림에 추가 (중복 체크)
      setToastNotifications((prev) => {
        const isDuplicate = prev.some(
          (n) => n.notificationId === notification.notificationId
        );
        if (isDuplicate) {
          console.log("토스트 중복 알림 무시:", notification.notificationId);
          return prev;
        }
        return [...prev, notification];
      });

      // 읽지 않은 알림 상태 업데이트
      setHasUnreadNotifications(true);
    },
    []
  );

  // 웹소켓 연결
  const connectWebSocket = useCallback(async () => {
    const token = getAccessToken();
    const gatewayUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

    console.log("🔄 웹소켓 연결 시도 중...");
    console.log("🌐 Gateway URL:", gatewayUrl);
    console.log("🔑 Token present:", !!token);
    
    if (token) {
      console.log("🔑 Token preview:", token.substring(0, 20) + '...');
    }

    if (!token) {
      console.warn("⚠️ 토큰이 없어서 웹소켓 연결을 건너뜁니다");
      console.log("💡 토큰 설정을 확인하세요. 로그인이 완료되었는지 확인해주세요.");
      return;
    }

    try {
      await webSocketService.connect({
        gatewayUrl,
        token,
        debug: true, // 항상 디버그 모드로 설정
        reconnectInterval: 3000,
        maxReconnectAttempts: 15,
      });

      console.log("✅ 웹소켓 연결 성공, 구독 시작...");
      
      // 연결 직후 약간의 지연을 두고 구독 시작
      setTimeout(() => {
        try {
          // 모든 알림 채널 구독
          const unsubscribe = webSocketService.subscribeToAllNotifications(handleNewNotification);
          console.log("🎉 웹소켓 연결 및 구독 완료!");
          
          // 구독 해제 함수를 저장해둘 수 있도록 처리
          (window as any).__wsUnsubscribe = unsubscribe;
        } catch (subscribeError) {
          console.error("❌ 구독 실패:", subscribeError);
        }
      }, 500);
      
      setIsConnected(true);
    } catch (error) {
      console.error("💥 웹소켓 연결 실패:", error);
      setIsConnected(false);
    }
  }, [handleNewNotification]);

  // 알림 읽음 처리
  const markAsRead = useCallback((notificationId: number) => {
    // 최근 알림에서 읽음 처리
    setRecentNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // 토스트에서 제거
    setToastNotifications((prev) =>
      prev.filter((notification) => notification.notificationId !== notificationId)
    );

    // TODO: API 호출로 서버에 읽음 처리 전송
    // await notificationApi.markAsRead(notificationId);
  }, []);

  // 토스트 제거
  const removeToast = useCallback((notificationId: number) => {
    setToastNotifications((prev) =>
      prev.filter((notification) => notification.notificationId !== notificationId)
    );
  }, []);

  // 읽지 않은 알림 상태 새로고침
  const refreshUnreadStatus = useCallback(async () => {
    try {
      // TODO: API 호출로 읽지 않은 알림 여부 확인
      // const response = await notificationApi.hasUnreadNotifications();
      // setHasUnreadNotifications(response.data || false);

      // 임시로 최근 알림에서 읽지 않은 것이 있는지 확인
      const hasUnread = recentNotifications.some(
        (notification) => !notification.isRead
      );
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error("읽지 않은 알림 상태 확인 실패:", error);
    }
  }, [recentNotifications]);

  // 토큰 이벤트 기반 웹소켓 연결 관리
  useEffect(() => {
    // 초기 토큰 확인 및 연결 시도
    const token = getAccessToken();
    if (token) {
      console.log("🔑 초기 토큰 발견, 웹소켓 연결 시도");
      connectWebSocket();
    } else {
      console.log("⏳ 초기 토큰 없음, auth 이벤트 대기 중");
    }

    // 토큰 갱신 이벤트 리스너 - 로그인/토큰 갱신 시
    const handleTokenRefreshed = () => {
      console.log("🔑 토큰 갱신됨, 웹소켓 연결 시도");
      webSocketService.disconnect();
      setTimeout(connectWebSocket, 1000);
    };

    // 토큰 만료 이벤트 리스너 - 로그아웃 시
    const handleTokenExpired = () => {
      console.log("🚪 토큰 만료됨, 웹소켓 연결 해제 및 상태 초기화");
      webSocketService.disconnect();
      setIsConnected(false);
      setHasUnreadNotifications(false);
      setRecentNotifications([]);
      setToastNotifications([]);
    };

    window.addEventListener("auth:token-refreshed", handleTokenRefreshed);
    window.addEventListener("auth:token-expired", handleTokenExpired);

    return () => {
      webSocketService.disconnect();
      window.removeEventListener("auth:token-refreshed", handleTokenRefreshed);
      window.removeEventListener("auth:token-expired", handleTokenExpired);
    };
  }, [connectWebSocket]);

  const contextValue: NotificationContextType = {
    isConnected,
    hasUnreadNotifications,
    recentNotifications,
    toastNotifications,
    markAsRead,
    removeToast,
    refreshUnreadStatus,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
