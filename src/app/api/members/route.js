import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const memberData = await request.json();
    
    // mockData.js 파일 경로
    const mockDataPath = path.join(process.cwd(), 'src/app/members/data/mockData.js');
    
    // 현재 파일 내용 읽기
    const fileContent = fs.readFileSync(mockDataPath, 'utf8');
    
    // 새로운 구성원 데이터 생성
    const newMember = {
      id: Date.now(), // 고유 ID 생성
      name: memberData.name,
      position: memberData.position,
      email: memberData.email,
      phone: memberData.phone || '',
      address: memberData.address || '',
      joinDate: memberData.joinDate,
      organization: memberData.organization,
      role: memberData.role,
      job: memberData.job,
      rank: memberData.rank || '',
      isAdmin: memberData.isAdmin,
      teams: [memberData.organization],
      profileImage: null
    };
    
    // 새 구성원을 문자열로 변환
    const newMemberString = `  {
    id: ${newMember.id},
    name: '${newMember.name}',
    position: '${newMember.position}',
    email: '${newMember.email}',
    phone: '${newMember.phone}',
    address: '${newMember.address}',
    joinDate: '${newMember.joinDate}',
    organization: '${newMember.organization}',
    role: '${newMember.role}',
    job: '${newMember.job}',
    rank: '${newMember.rank}',
    isAdmin: ${newMember.isAdmin},
    teams: ['${newMember.organization}'],
    profileImage: null
  },`;
    
    // 더 안전한 방법으로 파일 수정
    // "// 추가 직원들" 주석을 찾아서 그 앞에 새 구성원 추가
    const insertMarker = '  // 추가 직원들';
    const insertPosition = fileContent.indexOf(insertMarker);
    
    if (insertPosition !== -1) {
      // 주석 앞에 새 구성원 추가
      const newContent = 
        fileContent.slice(0, insertPosition) + 
        newMemberString + '\n  ' +
        fileContent.slice(insertPosition);
      
      fs.writeFileSync(mockDataPath, newContent, 'utf8');
    } else {
      // 주석을 찾을 수 없다면 배열의 마지막 요소 뒤에 추가
      // "  }," 패턴을 찾아서 그 다음에 추가
      const lastItemPattern = /  },\n(?=  \/\/ 추가 직원들|  \.\.\.Array\.from)/;
      const match = fileContent.match(lastItemPattern);
      
      if (match) {
        const matchEnd = match.index + match[0].length;
        const newContent = 
          fileContent.slice(0, matchEnd - 1) + 
          newMemberString + '\n' +
          fileContent.slice(matchEnd - 1);
        
        fs.writeFileSync(mockDataPath, newContent, 'utf8');
      } else {
        // 마지막 방법: 배열 선언 끝 바로 전에 추가
        const arrayEndPattern = /  },\n];/;
        const arrayMatch = fileContent.match(arrayEndPattern);
        
        if (arrayMatch) {
          const arrayMatchEnd = arrayMatch.index + 4; // "  }," 까지
          const newContent = 
            fileContent.slice(0, arrayMatchEnd) + 
            newMemberString + '\n' +
            fileContent.slice(arrayMatchEnd);
          
          fs.writeFileSync(mockDataPath, newContent, 'utf8');
        } else {
          throw new Error('mockEmployees 배열에 구성원을 추가할 위치를 찾을 수 없습니다.');
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '구성원이 성공적으로 추가되었습니다.',
      member: newMember 
    });
    
  } catch (error) {
    console.error('구성원 추가 오류:', error);
    return NextResponse.json(
      { success: false, message: '구성원 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}