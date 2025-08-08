"use client";

import { useState } from 'react';
import styles from './SettingsModal.module.css';
import { getSettingsIcon } from './SettingsIcons';

const SettingsModal = ({ isOpen, onClose, onAddMember }) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 1,
      title: "구성원 추가",
      description: "새로운 구성원을 조직에 등록합니다"
    },
    {
      id: 2,
      title: "조직 관리",
      description: "부서 및 팀 구조를 관리합니다"
    },
    {
      id: 3,
      title: "직급 관리",
      description: "직급 체계를 설정하고 관리합니다"
    },
    {
      id: 4,
      title: "역할 권한",
      description: "사용자 역할과 권한을 설정합니다"
    },
    {
      id: 5,
      title: "업무 분류",
      description: "업무 카테고리를 관리합니다"
    },
    {
      id: 6,
      title: "등급 설정",
      description: "구성원 등급을 설정하고 관리합니다"
    }
  ];

  const handleMenuItemClick = (itemId) => {
    if (itemId === 1) {
      onAddMember();
    } else {
      alert('준비 중인 기능입니다.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>구성원 설정</h2>
            <p className={styles.modalSubtitle}>구성원 관리 옵션을 선택하세요</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.menuList}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={styles.menuItem}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <div className={styles.menuIcon}>
                  {getSettingsIcon(item.id, 20, "#3B82F6")}
                </div>
                <div className={styles.menuContent}>
                  <h3 className={styles.menuTitle}>{item.title}</h3>
                  <p className={styles.menuDescription}>{item.description}</p>
                </div>
                <div className={styles.menuArrow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;