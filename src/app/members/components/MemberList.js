"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './MemberList.module.css';
import MemberCard from './MemberCard';
import SearchBar from './SearchBar';

const MemberList = ({ employees, totalEmployees, searchTerm, onSearchChange, selectedOrg, placeholder }) => {
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef();

  // 무한 스크롤 관찰자 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedCount < employees.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedCount, employees.length, isLoading]);

  // 검색어나 필터가 변경되면 카운트 리셋
  useEffect(() => {
    setDisplayedCount(10);
  }, [searchTerm, selectedOrg]);

  const loadMore = () => {
    if (isLoading || displayedCount >= employees.length) return;
    
    setIsLoading(true);
    
    // 로딩 시뮬레이션 (실제로는 즉시 로드)
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 10, employees.length));
      setIsLoading(false);
    }, 300);
  };

  const displayedEmployees = employees.slice(0, displayedCount);

  return (
    <div className={styles.container}>
      {/* 검색바 */}
      <div className={styles.searchContainer}>
        <SearchBar 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={placeholder || "직원명을 입력하여 검색"}
        />
      </div>

      {/* 직원 리스트 */}
      <div className={styles.memberList}>
        {displayedEmployees.map(employee => (
          <MemberCard key={employee.id} employee={employee} />
        ))}
        
        {/* 로딩 인디케이터 */}
        {displayedCount < employees.length && (
          <div ref={loadingRef} className={styles.loadingIndicator}>
            {isLoading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <span>로딩 중...</span>
              </div>
            ) : (
              <div className={styles.loadMoreHint}>
                스크롤하여 더 많은 직원 보기 ({employees.length - displayedCount}명 남음)
              </div>
            )}
          </div>
        )}
      </div>

      {employees.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
          {(selectedOrg || searchTerm) && (
            <p className={styles.emptyStateHint}>
              필터 조건을 변경해보세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberList; 