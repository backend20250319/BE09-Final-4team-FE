"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PasswordResetModal.module.css';

const PasswordResetModal = ({ isOpen, onClose, userEmail, userName }) => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('8자 이상이어야 합니다');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('대문자를 포함해야 합니다');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('소문자를 포함해야 합니다');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('숫자를 포함해야 합니다');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('특수문자(!@#$%^&*)를 포함해야 합니다');
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    
    // 실시간 유효성 검사
    const newErrors = { ...errors };
    
    if (field === 'newPassword') {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ');
      } else {
        delete newErrors.newPassword;
      }
      
      // 확인 비밀번호도 다시 검사
      if (passwords.confirmPassword && value !== passwords.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      } else if (passwords.confirmPassword && value === passwords.confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }
    
    if (field === 'confirmPassword') {
      if (value !== passwords.newPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 최종 유효성 검사
    const newPasswordErrors = validatePassword(passwords.newPassword);
    const finalErrors = {};

    if (newPasswordErrors.length > 0) {
      finalErrors.newPassword = newPasswordErrors.join(', ');
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      finalErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!passwords.newPassword) {
      finalErrors.newPassword = '새 비밀번호를 입력해주세요';
    }

    if (!passwords.confirmPassword) {
      finalErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 사용자 비밀번호 업데이트
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(user => user.email === userEmail);
      
      if (userIndex !== -1) {
        users[userIndex].password = passwords.newPassword;
        users[userIndex].needsPasswordReset = false;
        localStorage.setItem('users', JSON.stringify(users));

        // 세션 업데이트
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.needsPasswordReset = false;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
        router.push('/dashboard');
      } else {
        throw new Error('사용자를 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      alert('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // 로그아웃 처리
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    onClose();
    router.push('/login');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#e5e7eb' };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*]/.test(password)
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { strength: score, label: '약함', color: '#ef4444' };
    if (score <= 3) return { strength: score, label: '보통', color: '#f59e0b' };
    if (score <= 4) return { strength: score, label: '강함', color: '#10b981' };
    return { strength: score, label: '매우 강함', color: '#059669' };
  };

  const passwordStrength = getPasswordStrength(passwords.newPassword);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h2 className={styles.modalTitle}>비밀번호 재설정 필요</h2>
            <p className={styles.modalSubtitle}>
              안녕하세요, {userName}님. 보안을 위해 비밀번호를 재설정해주세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>새 비밀번호</label>
            <input
              type="password"
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              value={passwords.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              required
            />
            {passwords.newPassword && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={styles.strengthFill}
                    style={{ 
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span 
                  className={styles.strengthLabel}
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.newPassword && (
              <div className={styles.errorText}>{errors.newPassword}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호 확인</label>
            <input
              type="password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              value={passwords.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {errors.confirmPassword && (
              <div className={styles.errorText}>{errors.confirmPassword}</div>
            )}
          </div>

          <div className={styles.requirements}>
            <h4 className={styles.requirementsTitle}>비밀번호 요구사항:</h4>
            <ul className={styles.requirementsList}>
              <li className={passwords.newPassword?.length >= 8 ? styles.valid : ''}>
                8자 이상
              </li>
              <li className={/[A-Z]/.test(passwords.newPassword) ? styles.valid : ''}>
                대문자 포함
              </li>
              <li className={/[a-z]/.test(passwords.newPassword) ? styles.valid : ''}>
                소문자 포함
              </li>
              <li className={/[0-9]/.test(passwords.newPassword) ? styles.valid : ''}>
                숫자 포함
              </li>
              <li className={/[!@#$%^&*]/.test(passwords.newPassword) ? styles.valid : ''}>
                특수문자 포함 (!@#$%^&*)
              </li>
            </ul>
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              나중에 하기
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetModal;