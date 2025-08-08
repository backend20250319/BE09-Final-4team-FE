"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './CustomDatePicker.module.css';

const CustomDatePicker = ({ value, onChange, onBlur, className, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatValueDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formattedDate = formatValueDate(date);
    onChange(formattedDate);
    setIsOpen(false);
    // onBlur를 약간 지연시켜서 onChange가 먼저 처리되도록 함
    if (onBlur) {
      setTimeout(() => {
        onBlur(formattedDate);
      }, 10);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const goToToday = () => {
    const today = new Date();
    const formattedDate = formatValueDate(today);
    setCurrentMonth(today);
    setSelectedDate(today);
    onChange(formattedDate);
    setIsOpen(false);
    // onBlur를 약간 지연시켜서 onChange가 먼저 처리되도록 함
    if (onBlur) {
      setTimeout(() => {
        onBlur(formattedDate);
      }, 10);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div 
        className={`${styles.input} ${className || ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate ? (
          <span className={styles.dateText}>
            {formatDisplayDate(selectedDate)}
          </span>
        ) : (
          <span className={`${styles.dateText} ${styles.placeholder}`}>
            {placeholder || '날짜를 선택하세요'}
          </span>
        )}
        <div className={styles.calendarIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 2H12V1C12 0.4 11.6 0 11 0S10 0.4 10 1V2H6V1C6 0.4 5.6 0 5 0S4 0.4 4 1V2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2ZM14 14H2V6H14V14Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.header}>
            <button 
              className={styles.navButton}
              onClick={() => navigateMonth(-1)}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <span className={styles.monthYear}>
              {currentMonth.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </span>
            <button 
              className={styles.navButton}
              onClick={() => navigateMonth(1)}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </div>

          <div className={styles.weekdays}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.days}>
            {getDaysInMonth().map((date, index) => (
              <button
                key={index}
                className={`${styles.day} ${
                  date ? '' : styles.empty
                } ${
                  date && isToday(date) ? styles.today : ''
                } ${
                  date && isSelected(date) ? styles.selected : ''
                }`}
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                type="button"
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>

          <div className={styles.footer}>
            <button 
              className={styles.todayButton}
              onClick={goToToday}
              type="button"
            >
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;