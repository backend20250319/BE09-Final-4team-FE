"use client";

import { useState, useEffect } from 'react';
import { IoPeople, IoTime, IoCalendar, IoDocument, IoNotifications, IoNewspaper, IoSettings, IoFolder, IoGlobeOutline, IoCheckmarkCircle, IoClock, IoDocumentText } from 'react-icons/io5';
import styles from '../dashboard.module.css';

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false); // false: 직원, true: 관리자
  const [currentTime, setCurrentTime] = useState('');
  const [currentIP, setCurrentIP] = useState('');
  const [attendanceState, setAttendanceState] = useState({
    checkInTime: null,
    checkOutTime: null,
    isCheckedIn: false,
    isCheckedOut: false,
    lastCheckInDate: null
  });
  
  const currentDate = new Date();
  const dayString = currentDate.toLocaleDateString('ko-KR', { weekday: 'short' });
  const monthString = currentDate.toLocaleDateString('ko-KR', { month: 'long' });
  const yearString = currentDate.getFullYear();
  const dayNumber = currentDate.getDate();

  // 현재 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // IP 주소 가져오기
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setCurrentIP(data.ip);
      } catch (error) {
        setCurrentIP('000.000.000.000'); // 기본값
      }
    };
    
    getIP();
  }, []);

  // 날짜가 바뀌었는지 확인하고 상태 초기화
  useEffect(() => {
    const today = new Date().toDateString();
    if (attendanceState.lastCheckInDate && attendanceState.lastCheckInDate !== today) {
      setAttendanceState({
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
        lastCheckInDate: null
      });
    }
  }, [attendanceState.lastCheckInDate]);

  // 출근 핸들러
  const handleCheckIn = () => {
    const now = new Date();
    setAttendanceState({
      ...attendanceState,
      checkInTime: now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      isCheckedIn: true,
      lastCheckInDate: now.toDateString()
    });
  };

  // 퇴근 핸들러
  const handleCheckOut = () => {
    const now = new Date();
    setAttendanceState({
      ...attendanceState,
      checkOutTime: now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      isCheckedOut: true
    });
  };



  // 직원 모드 데이터
  const employeeData = {
    // 출퇴근 데이터
    attendanceData: {
      currentTime: currentTime,
      ipAddress: currentIP,
      checkInTime: '09:00',
      checkOutTime: '18:00'
    },

    // 연차 데이터
    leaveData: {
      remaining: 12,
      total: 15,
      used: 3
    },

    // 팀원 데이터
    teamMembers: [
      {
        name: '김개발',
        role: 'Senior Developer',
        email: 'kim@company.com',
        phone: '010-1234-5678',
        avatar: '/api/placeholder/40/40'
      },
      {
        name: '이프론트',
        role: 'Frontend Developer',
        email: 'lee@company.com',
        phone: '010-2345-6789',
        avatar: '/api/placeholder/40/40'
      }
    ],

    // 공지 데이터
    notices: [
      { title: '2025년 하반기 인사발령', date: '2025.08.01', borderColor: '#007BFF', bgColor: '#EEF6FC' },
      { title: '여름 휴가 신청 안내', date: '2025.07.30', borderColor: '#00C56B', bgColor: '#E8FFF2' },
      { title: '사무실 이전 공지', date: '2025.07.28', borderColor: '#8F8F8F', bgColor: '#F9FAFB' }
    ],

    // 근로시간 데이터
    workHoursData: {
      weekly: 42,
      dailyAverage: 8.4,
      overtime: 2
    }
  };

  // 관리자 모드 데이터
  const adminData = {
    // 출근 현황
    attendanceStats: [
      {
        title: '출근',
        value: '1,004',
        total: '1056',
        unit: 'people',
        icon: IoPeople,
        backgroundColor: '#E8FFF2',
        iconColor: '#00C56B'
      },
      {
        title: '지각',
        value: '4',
        unit: 'people',
        icon: IoTime,
        backgroundColor: '#FFF5CC',
        iconColor: '#FF4D4F'
      },
      {
        title: '휴가',
        value: '21',
        unit: 'people',
        icon: IoCalendar,
        backgroundColor: '#E3F0FF',
        iconColor: '#00A8F7'
      }
    ],

    // 공지 데이터
    notices: [
      { title: '2025년 하반기 인사발령', date: '2025.08.01', borderColor: '#007BFF', bgColor: '#EEF6FC' },
      { title: '여름 휴가 신청 안내', date: '2025.07.30', borderColor: '#00C56B', bgColor: '#E8FFF2' },
      { title: '사무실 이전 공지', date: '2025.07.28', borderColor: '#8F8F8F', bgColor: '#F9FAFB' }
    ],

    // 뉴스 데이터
    news: [
      { title: '2025년 최저임금 인상률 확정', source: '경제신문', time: '1시간 전', url: 'https://news.example.com/1' },
      { title: '원격근무 확대 정책 발표', source: 'IT뉴스', time: '3시간 전', url: 'https://news.example.com/2' },
      { title: '직장 내 괴롭힘 방지법 개정', source: '법률신문', time: '5시간 전', url: 'https://news.example.com/3' }
    ]
  };

  // 직원 모드 렌더링
  const renderEmployeeMode = () => (
    <div className={styles.contentGrid}>
      {/* 출퇴근 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>출퇴근</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.timeDisplay}>
            <span className={styles.currentTime}>{currentTime}</span>
            <span className={styles.ipAddress}>Your IP: {currentIP}</span>
          </div>
          <div className={styles.attendanceButtons}>
            <button 
              className={`${styles.attendanceBtn} ${styles.checkInBtn}`}
              onClick={handleCheckIn}
              disabled={attendanceState.isCheckedIn}
            >
              출근 {attendanceState.checkInTime || currentTime}
            </button>
            <button 
              className={`${styles.attendanceBtn} ${styles.checkOutBtn}`}
              onClick={handleCheckOut}
              disabled={!attendanceState.isCheckedIn || attendanceState.isCheckedOut}
            >
              퇴근 {attendanceState.checkOutTime || (attendanceState.isCheckedIn ? currentTime : '')}
            </button>
          </div>
        </div>
      </div>



      {/* 결재 현황 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>결재 현황</h3>
        </div>
        <div className={styles.cardContent}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#FFF5CC', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EA580C' }}>5건</div>
              <div style={{ fontSize: '12px', color: '#666' }}>내가 결재해야 할 문서</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#E3F0FF', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007BFF' }}>3건</div>
              <div style={{ fontSize: '12px', color: '#666' }}>내가 신청한 문서</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#E8FFF2', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C56B' }}>12건</div>
              <div style={{ fontSize: '12px', color: '#666' }}>결재 완료된 문서</div>
            </div>
          </div>
        </div>
      </div>

      {/* 나의 연차 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>나의 연차</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.leaveDisplay}>
            <div className={styles.leaveBox}>
              <span className={styles.leaveDays}>{employeeData.leaveData.remaining}일</span>
              <span className={styles.leaveLabel}>남은 연차</span>
            </div>
            <div className={styles.leaveInfo}>
              <span>총 연차 {employeeData.leaveData.total}일</span>
              <span>사용 연차 {employeeData.leaveData.used}일</span>
            </div>
          </div>
        </div>
      </div>

      {/* 뉴스 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>뉴스</h3>
        </div>
        <div className={styles.cardContent}>
          {adminData.news.map((item, index) => (
            <a
              key={index}
              className={styles.newsItem}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={styles.newsIcon}>
                <IoGlobeOutline size={16} color="#6B7280" />
              </div>
              <div className={styles.newsContent}>
                <h4 className={styles.newsTitle}>{item.title}</h4>
                <div className={styles.newsMeta}>
                  <span className={styles.newsSource}>{item.source}</span>
                  <span className={styles.newsTime}>{item.time}</span>
                </div>
              </div>
              <div className={styles.newsArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 공지 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>공지</h3>
        </div>
        <div className={styles.cardContent}>
          {employeeData.notices.map((item, index) => (
            <div key={index} className={styles.noticeItem} style={{ 
              backgroundColor: item.bgColor,
              borderLeftColor: item.borderColor 
            }}>
              <div className={styles.noticeContent}>
                <h4 className={styles.noticeTitle}>{item.title}</h4>
                <span className={styles.noticeDate}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 이번 주 근로시간 Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>이번 주 근로시간</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.workHoursDisplay}>
            <div className={styles.workHoursBox}>
              <span className={styles.workHoursValue}>{employeeData.workHoursData.weekly}h</span>
              <span className={styles.workHoursLabel}>이번 주 근무시간</span>
            </div>
            <div className={styles.workHoursInfo}>
              <span>일 평균 {employeeData.workHoursData.dailyAverage}h</span>
              <span className={styles.overtimeText}>초과근무 {employeeData.workHoursData.overtime}h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 관리자 모드 렌더링
  const renderAdminMode = () => (
    <>
      {/* Metrics Cards */}
      <div className={styles.metricsGrid}>
        {adminData.attendanceStats.map((metric, index) => (
          <div 
            key={index} 
            className={styles.metricCard}
            style={{ backgroundColor: metric.backgroundColor }}
          >
            <div className={styles.metricIconWrapper}>
              <div className={styles.metricIconCircle} style={{ backgroundColor: metric.iconColor }}>
                <metric.icon size={24} color="white" />
              </div>
            </div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricTitle} style={{ color: metric.iconColor }}>{metric.title}</h3>
              <div className={styles.metricValue}>
                {metric.total ? (
                  <span className={styles.value} style={{ color: metric.iconColor }}>
                    {metric.value} / {metric.total}
                  </span>
                ) : (
                  <span className={styles.value} style={{ color: metric.iconColor }}>{metric.value}</span>
                )}
              </div>
              <span className={styles.unit}>{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className={styles.contentGrid}>


        {/* 결재 현황 Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>결재 현황</h3>
          </div>
          <div className={styles.cardContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#FFF5CC', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EA580C' }}>23건</div>
                <div style={{ fontSize: '12px', color: '#666' }}>대기 중인 결재</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#E3F0FF', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007BFF' }}>8건</div>
                <div style={{ fontSize: '12px', color: '#666' }}>검토 중인 결재</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#E8FFF2', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00C56B' }}>45건</div>
                <div style={{ fontSize: '12px', color: '#666' }}>승인된 결재</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#FFE8E8', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4D4F' }}>3건</div>
                <div style={{ fontSize: '12px', color: '#666' }}>반려된 결재</div>
              </div>
            </div>
          </div>
        </div>

        {/* 공지 Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>공지</h3>
          </div>
          <div className={styles.cardContent}>
            {adminData.notices.map((item, index) => (
              <div key={index} className={styles.noticeItem} style={{ 
                backgroundColor: item.bgColor,
                borderLeftColor: item.borderColor 
              }}>
                <div className={styles.noticeContent}>
                  <h4 className={styles.noticeTitle}>{item.title}</h4>
                  <span className={styles.noticeDate}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 뉴스 Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>뉴스</h3>
          </div>
          <div className={styles.cardContent}>
            {adminData.news.map((item, index) => (
              <a
                key={index}
                className={styles.newsItem}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.newsIcon}>
                  <IoGlobeOutline size={16} color="#6B7280" />
                </div>
                <div className={styles.newsContent}>
                  <h4 className={styles.newsTitle}>{item.title}</h4>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsSource}>{item.source}</span>
                    <span className={styles.newsTime}>{item.time}</span>
                  </div>
                </div>
                <div className={styles.newsArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.dashboard}>
      {/* Header with date and toggle */}
      <div className={styles.dashboardHeader}>
                 <div className={styles.dateInfo}>
           <div className={styles.mainDate}>
             <span className={styles.month}>{monthString}</span>
             <span className={styles.dayNumber}>{dayNumber}일</span>
             <span className={styles.dayName}>{dayString}요일</span>
             <span className={styles.year}>{yearString}년</span>
           </div>
         </div>
        
        <div className={styles.modeToggle}>
          <span className={styles.toggleLabel}>
            {isAdmin ? '관리자 모드' : '직원 모드'}
          </span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin((prev) => !prev)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      {/* 조건부 렌더링 */}
      {isAdmin ? renderAdminMode() : renderEmployeeMode()}
    </div>
  );
} 