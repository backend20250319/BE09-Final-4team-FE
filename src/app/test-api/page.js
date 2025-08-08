"use client";

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAddMember = async () => {
    setLoading(true);
    try {
      const testMemberData = {
        name: '테스트 구성원',
        email: 'test@example.com',
        phone: '010-1234-5678',
        address: '서울특별시 강남구',
        joinDate: '2024-01-15',
        organization: '개발팀',
        position: '사원',
        role: '팀원',
        job: '프론트엔드 개발',
        rank: '5급',
        isAdmin: false,
        tempPassword: 'test123456'
      };

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMemberData),
      });

      const result = await response.json();
      setResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setResult('오류: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>구성원 추가 API 테스트</h1>
      
      <button 
        onClick={testAddMember} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '처리 중...' : '테스트 구성원 추가'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>결과:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
            {result}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <p><strong>주의:</strong> 이 테스트는 실제로 mockData.js 파일을 수정합니다.</p>
        <p>테스트 후에는 파일을 확인해보세요.</p>
      </div>
    </div>
  );
}