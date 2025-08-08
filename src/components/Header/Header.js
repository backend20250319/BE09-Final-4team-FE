"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '사용자', email: '' });
  const [notifications, setNotifications] = useState([
    { id: 1, text: '새로운 구성원이 추가되었습니다.', time: '2시간 전' },
    { id: 2, text: '시스템 업데이트가 완료되었습니다.', time: '1일 전' },
    { id: 3, text: '로그인 성공: 비니비니님 환영합니다.', time: '3일 전' }
  ]);
  const pathname = usePathname();
  const router = useRouter();

  // 사용자 정보 업데이트 함수
  const updateUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.name) {
      setCurrentUser(user);
    } else {
      setCurrentUser({ name: '사용자', email: '' });
    }
  };

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    updateUserInfo();

    // localStorage 변경 감지 (다른 탭에서의 변경)
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        updateUserInfo();
      }
    };

    // 윈도우 포커스 시 사용자 정보 업데이트
    const handleFocus = () => {
      updateUserInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 페이지 경로 변경 시에도 사용자 정보 업데이트
  useEffect(() => {
    updateUserInfo();
  }, [pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationDropdown = document.querySelector(`.${styles.notificationDropdown}`);
      const userDropdown = document.querySelector(`.${styles.dropdown}`);
      
      if (notificationDropdown && !notificationDropdown.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      
      if (userDropdown && !userDropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
    
    // 로그인 페이지로 이동
    router.push('/login');
  };

  // 사용자의 프로필 이미지 생성 (구성원 리스트와 동일한 방식)
  const getProfileImage = (name) => {
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `https://picsum.photos/96/96?random=${hash}`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/dashboard">
            <img src="/logo.svg" alt="Logo" />
          </Link>
        </div>
        
        <div className={styles.userSection}>
          <div className={styles.notificationDropdown}>
            <div 
              className={styles.notification}
              onClick={toggleNotification}
            >
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_187)">
                  <path d="M7.87421 0C7.25195 0 6.74921 0.502734 6.74921 1.125V1.7543C4.20039 2.15859 2.24921 4.36641 2.24921 7.03125V8.20547C2.24921 9.80156 1.70429 11.352 0.70937 12.5965L0.185542 13.2539C-0.0183643 13.507 -0.0570361 13.8551 0.0835889 14.1469C0.224214 14.4387 0.519526 14.625 0.842964 14.625H14.9055C15.2289 14.625 15.5242 14.4387 15.6648 14.1469C15.8055 13.8551 15.7668 13.507 15.5629 13.2539L15.0391 12.6C14.0441 11.352 13.4992 9.80156 13.4992 8.20547V7.03125C13.4992 4.36641 11.548 2.15859 8.99921 1.7543V1.125C8.99921 0.502734 8.49648 0 7.87421 0ZM7.87421 3.375H8.15546C10.1734 3.375 11.8117 5.01328 11.8117 7.03125V8.20547C11.8117 9.88945 12.3004 11.5312 13.2074 12.9375H2.54101C3.44804 11.5312 3.93671 9.88945 3.93671 8.20547V7.03125C3.93671 5.01328 5.575 3.375 7.59296 3.375H7.87421ZM10.1242 15.75H7.87421H5.62421C5.62421 16.3477 5.85976 16.9207 6.28164 17.3426C6.70351 17.7645 7.27656 18 7.87421 18C8.47187 18 9.04492 17.7645 9.46679 17.3426C9.88867 16.9207 10.1242 16.3477 10.1242 15.75Z" fill="#4B5563"/>
                </g>
                <defs>
                  <clipPath id="clip0_0_187">
                    <path d="M0 0H15.75V18H0V0Z" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              {notifications.length > 0 && (
                <div className={styles.notificationBadge}>
                  {notifications.length > 99 ? '99+' : notifications.length}
                </div>
              )}
            </div>
            
            {isNotificationOpen && (
              <div className={styles.notificationMenu}>
                <div className={styles.notificationHeader}>
                  <span className={styles.notificationTitle}>알림</span>
                </div>
                <div className={styles.notificationList}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                          <div className={styles.notificationText}>
                            {notification.text}
                          </div>
                          <div className={styles.notificationTime}>
                            {notification.time}
                          </div>
                        </div>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => deleteNotification(notification.id)}
                          title="알림 삭제"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 3L3 9M3 3L9 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className={styles.notificationEmpty}>
                      <span>새로운 알림이 없습니다.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.dropdown}>
            <div 
              className={styles.userInfo}
              onClick={toggleDropdown}
            >
              <div className={styles.avatar}>
                <img 
                  src={getProfileImage(currentUser.name)}
                  alt="User Avatar" 
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ec4899&color=fff&size=96&font-size=0.4&length=1`;
                  }}
                />
              </div>
              <span className={styles.userName}>{currentUser.name}</span>
            </div>
            
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/profile" className={styles.dropdownItem}>
                  프로필
                </Link>
                <div className={styles.divider}></div>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
