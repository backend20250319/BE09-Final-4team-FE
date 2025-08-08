"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoPerson, IoLockClosed } from 'react-icons/io5';
import styles from './login.module.css';
import PasswordResetModal from './PasswordResetModal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 기본 관리자 계정들
    if (email === 'bini@hermesai.com' && password === '12341234') {
      const adminUser = {
        email: 'bini@hermesai.com',
        name: '비니비니',
        isAdmin: true,
        needsPasswordReset: false
      };
      
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('isLoggedIn', 'true');
      alert('로그인 성공!');
      router.push('/dashboard');
      return;
    }
    
    // 동적으로 추가된 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        needsPasswordReset: user.needsPasswordReset
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // 임시 비밀번호로 로그인한 경우 비밀번호 재설정 모달 표시
      if (user.needsPasswordReset) {
        setCurrentUser(userData);
        setShowPasswordResetModal(true);
      } else {
        alert('로그인 성공!');
        router.push('/dashboard');
      }
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handlePasswordResetClose = () => {
    setShowPasswordResetModal(false);
    setCurrentUser(null);
    // 로그아웃 처리
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.blurredShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>
      </div>
      
      <div className={styles.modal}>
        
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20Z" fill="#FF6B35"/>
              <path d="M15 18L20 13L25 18M20 13V27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.hermes}>HERMÈS</span>
            <span className={styles.paris}>PARIS</span>
          </div>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>HR 시스템 로그인</h1>
          <p className={styles.subtitle}>직원 포털에 로그인하세요</p>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email / ID</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className={styles.input}
                  required
                />
                <IoPerson className={styles.inputIcon} />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className={styles.input}
                  required
                />
                <IoLockClosed className={styles.inputIcon} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? "숨기기" : "보기"}
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          
          <p className={styles.note}>
            비밀번호를 잊어버렸을 경우 관리자에게 문의 바랍니다.
          </p>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={handlePasswordResetClose}
        userEmail={currentUser?.email}
        userName={currentUser?.name}
      />
    </div>
  );
} 