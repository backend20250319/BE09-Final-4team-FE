"use client";

import { useState, useEffect } from 'react';
import styles from './members.module.css';
import MemberList from './components/MemberList';
import OrgTree from './components/OrgTree';
import SettingsModal from './components/SettingsModal';
import AddMemberModal from './components/AddMemberModal';
import { mockEmployees, mockOrgStructure } from './data/mockData';

const MembersPage = () => {
  // localStorage에서 저장된 구성원 데이터를 가져오거나 기본 데이터 사용
  const getInitialEmployees = () => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      return JSON.parse(savedEmployees);
    }
    // 기본 데이터를 입사일 기준으로 정렬 (최신순)
    const sortedEmployees = [...mockEmployees].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    return sortedEmployees;
  };

  const [employees, setEmployees] = useState(getInitialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(getInitialEmployees);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 구성원 데이터 불러오기
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      const parsedEmployees = JSON.parse(savedEmployees);
      setEmployees(parsedEmployees);
      setFilteredEmployees(parsedEmployees);
    } else {
      // 기본 데이터를 localStorage에 저장
      const sortedEmployees = [...mockEmployees].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
      localStorage.setItem('employees', JSON.stringify(sortedEmployees));
    }
  }, []);

  // 검색어 변경 시 필터링
  useEffect(() => {
    let filtered = employees;
    
    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(emp => {
        const searchLower = searchTerm.toLowerCase();
        
        // 직원명 검색
        const nameMatch = emp.name.toLowerCase().includes(searchLower);
        
        // 조직명 검색
        const orgMatch = emp.organization.toLowerCase().includes(searchLower);
        
        // 팀명 검색
        const teamMatch = emp.teams && emp.teams.some(team => 
          team.toLowerCase().includes(searchLower)
        );
        
        return nameMatch || orgMatch || teamMatch;
      });
    }
    
    // 선택된 조직 필터링
    if (selectedOrg) {
      filtered = filtered.filter(emp => {
        // organization이 정확히 일치하는지 확인
        const orgMatch = emp.organization === selectedOrg;
        
        // teams 배열에 정확히 일치하는 팀이 있는지 확인
        const teamMatch = emp.teams && emp.teams.includes(selectedOrg);
        
        return orgMatch || teamMatch;
      });
    }
    
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, selectedOrg]);

  // 조직 선택 핸들러
  const handleOrgSelect = (orgName) => {
    if (orgName === selectedOrg) {
      setSelectedOrg(null);
    } else {
      setSelectedOrg(orgName);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // 필터 상태에 따른 제목 생성
  const getTitle = () => {
    if (selectedOrg) {
      return `구성원 - ${selectedOrg}`;
    }
    return '구성원';
  };

  // 필터 상태에 따른 부제목 생성
  const getSubtitle = () => {
    let subtitle = `직원 수: ${filteredEmployees.length}`;
    
    if (selectedOrg) {
      subtitle += ` (${selectedOrg} 필터링됨)`;
    }
    
    if (searchTerm) {
      subtitle += ` (검색어: "${searchTerm}")`;
    }
    
    return subtitle;
  };

  // 설정 모달 핸들러
  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
  };

  const handleAddMember = () => {
    setShowSettingsModal(false);
    setShowAddMemberModal(true);
  };

  const handleAddMemberClose = () => {
    setShowAddMemberModal(false);
  };

  const handleAddMemberBack = () => {
    setShowAddMemberModal(false);
    setShowSettingsModal(true);
  };

  const handleAddMemberSave = async (memberData) => {
    try {
      // API를 통해 실제 파일에 구성원 추가
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (result.success) {
        // 새로운 구성원 데이터 생성 (localStorage용)
        const newMember = {
          id: result.member.id,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone || '',
          address: memberData.address || '',
          joinDate: memberData.joinDate,
          organization: memberData.organization,
          position: memberData.position,
          role: memberData.role,
          job: memberData.job,
          rank: memberData.rank || '',
          isAdmin: memberData.isAdmin,
          tempPassword: memberData.tempPassword,
          needsPasswordReset: true,
          teams: [memberData.organization]
        };

        // 직원 목록에 추가하고 입사일 기준으로 정렬
        const updatedEmployees = [...employees, newMember].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
        setEmployees(updatedEmployees);
        
        // localStorage에 구성원 데이터 영구 저장
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));

        // 로컬 스토리지에 저장 (로그인 시스템용)
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
          email: memberData.email,
          password: memberData.tempPassword,
          name: memberData.name,
          isAdmin: memberData.isAdmin,
          needsPasswordReset: true
        };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        setShowAddMemberModal(false);
        alert('구성원이 성공적으로 추가되었습니다.');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('구성원 추가 오류:', error);
      alert('구성원 추가 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* 페이지 헤더 */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{getTitle()}</h1>
          <button className={styles.settingsButton} onClick={handleSettingsClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#6B7280" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        <p className={styles.pageSubtitle}>{getSubtitle()}</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 좌측: 구성원 리스트 */}
        <div className={styles.memberSection}>
          <MemberList 
            employees={filteredEmployees}
            totalEmployees={employees.length}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedOrg={selectedOrg}
            placeholder="직원명, 조직명, 팀명으로 검색"
          />
        </div>
        
        {/* 우측: 조직도 패널 */}
        <div className={styles.orgSection}>
          <OrgTree 
            orgStructure={mockOrgStructure}
            employees={employees}
            selectedOrg={selectedOrg}
            onOrgSelect={handleOrgSelect}
          />
        </div>
      </div>

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        onAddMember={handleAddMember}
      />

      {/* 구성원 추가 모달 */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={handleAddMemberClose}
        onSave={handleAddMemberSave}
        onBack={handleAddMemberBack}
      />
    </div>
  );
};

export default MembersPage; 