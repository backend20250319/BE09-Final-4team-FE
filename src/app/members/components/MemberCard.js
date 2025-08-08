"use client";

import styles from './MemberCard.module.css';

const MemberCard = ({ employee }) => {
  const getTeamColor = (team) => {
    const teamColors = {
      '개발팀': '#10b981',
      '기획팀': '#3b82f6',
      '디자인팀': '#8b5cf6',
      'QA팀': '#f59e0b',
      '마케팅팀': '#ec4899',
      '프론트엔드팀': '#3b82f6',
      '백엔드팀': '#10b981',
      '모바일팀': '#f59e0b',
      'UI팀': '#8b5cf6',
      'UX팀': '#ec4899',
      '그래픽팀': '#ef4444',
      '브랜드팀': '#06b6d4',
      '콘텐츠팀': '#84cc16',
      '홍보팀': '#f97316',
      '경영팀': '#6366f1',
      '인사팀': '#ec4899'
    };
    return teamColors[team] || '#6b7280';
  };

  // 랜덤 고품질 이미지 생성
  const getProfileImage = (name) => {
    // 이름을 기반으로 일관된 랜덤 이미지를 생성하기 위해 해시 사용
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Picsum을 사용한 랜덤 고품질 이미지
    return `https://picsum.photos/96/96?random=${hash}`;
  };

  // teams 배열이 있으면 사용하고, 없으면 기존 team 필드 사용 (하위 호환성)
  const teams = employee.teams || [employee.team].filter(Boolean);
  
  // 최대 3개 팀만 표시
  const displayTeams = teams.slice(0, 3);

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        <img 
          src={getProfileImage(employee.name)}
          alt={employee.name}
          className={styles.profileImage}
          onError={(e) => {
            // 이미지 로드 실패시 대체 이미지 사용
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=ec4899&color=fff&size=96&font-size=0.4&length=1`;
          }}
        />
      </div>
      
      <div className={styles.info}>
        <div className={styles.namePosition}>
          <h3 className={styles.name}>{employee.name}</h3>
          <span className={styles.position}>{employee.position}</span>
        </div>
        <div>
          {displayTeams.map((team, index) => (
            <span 
              key={index}
              className={styles.tag}
              style={{ backgroundColor: getTeamColor(team) }}
            >
              {team}
            </span>
          ))}
        </div>
      </div>
      
      <div className={styles.contact}>
        <p className={styles.email}>{employee.email}</p>
        <p className={styles.phone}>{employee.phone}</p>
      </div>
      
      <div className={styles.arrow}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L10 8L6 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default MemberCard; 