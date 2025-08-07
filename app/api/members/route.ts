import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'members.json');

const ensureDataFile = () => {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

const readMembersData = () => {
  ensureDataFile();
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading members data:', error);
    return [];
  }
};

const writeMembersData = (data: any[]) => {
  ensureDataFile();
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing members data:', error);
    return false;
  }
};

export async function GET() {
  try {
    console.log('GET /api/members 호출됨');
    console.log('데이터 파일 경로:', dataFilePath);
    console.log('파일 존재 여부:', fs.existsSync(dataFilePath));
    
    const members = readMembersData();
    console.log('읽어온 멤버 수:', members.length);
    console.log('멤버 데이터:', members);
    
    return NextResponse.json({ 
      success: true, 
      members 
    });
  } catch (error) {
    console.error('Error in GET /api/members:', error);
    return NextResponse.json(
      { success: false, message: '구성원 데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requiredFields = ['name', 'email', 'organization', 'position', 'role', 'job', 'joinDate'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          { success: false, message: `${field} 필드는 필수입니다.` },
          { status: 400 }
        );
      }
    }

    const existingMembers = readMembersData();
    const emailExists = existingMembers.some((member: any) => member.email === body.email);
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: '이미 존재하는 이메일입니다.' },
        { status: 400 }
      );
    }

    const newMember = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      address: body.address || '',
      joinDate: body.joinDate,
      organization: body.organization,
      position: body.position,
      role: body.role,
      job: body.job,
      rank: body.rank || '',
      isAdmin: body.isAdmin || false,
      tempPassword: body.tempPassword || '',
      needsPasswordReset: true,
      teams: [body.organization],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedMembers = [...existingMembers, newMember];
    
    if (writeMembersData(updatedMembers)) {
      return NextResponse.json({
        success: true,
        message: '구성원이 성공적으로 추가되었습니다.',
        member: newMember
      });
    } else {
      return NextResponse.json(
        { success: false, message: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/members:', error);
    return NextResponse.json(
      { success: false, message: '구성원 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/members 호출됨');
    const body = await request.json();
    console.log('받은 데이터:', body);
    
    if (!body.id) {
      console.log('ID가 없음');
      return NextResponse.json(
        { success: false, message: '구성원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const existingMembers = readMembersData();
    console.log('기존 멤버 수:', existingMembers.length);
    const memberIndex = existingMembers.findIndex((member: any) => member.id === body.id);
    console.log('찾은 멤버 인덱스:', memberIndex);
    
    if (memberIndex === -1) {
      console.log('멤버를 찾을 수 없음');
      return NextResponse.json(
        { success: false, message: '해당 구성원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('기존 멤버 데이터:', existingMembers[memberIndex]);
    console.log('업데이트할 데이터:', body);

    const updatedMember = {
      ...existingMembers[memberIndex],
      ...body,
      profileImage: body.profileImage || existingMembers[memberIndex].profileImage,
      selfIntroduction: body.selfIntroduction || existingMembers[memberIndex].selfIntroduction,
      remainingLeave: body.remainingLeave || existingMembers[memberIndex].remainingLeave,
      weeklyWorkHours: body.weeklyWorkHours || existingMembers[memberIndex].weeklyWorkHours,
      weeklySchedule: body.weeklySchedule || existingMembers[memberIndex].weeklySchedule,
      updatedAt: new Date().toISOString()
    };

    console.log('최종 업데이트된 멤버:', updatedMember);

    existingMembers[memberIndex] = updatedMember;
    
    const writeResult = writeMembersData(existingMembers);
    console.log('파일 저장 결과:', writeResult);
    
    if (writeResult) {
      console.log('성공적으로 저장됨');
      return NextResponse.json({
        success: true,
        message: '구성원 정보가 성공적으로 수정되었습니다.',
        member: updatedMember
      });
    } else {
      console.log('파일 저장 실패');
      return NextResponse.json(
        { success: false, message: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PUT /api/members:', error);
    return NextResponse.json(
      { success: false, message: '구성원 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: '구성원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const existingMembers = readMembersData();
    const memberIndex = existingMembers.findIndex((member: any) => member.id === id);
    
    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, message: '해당 구성원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    existingMembers.splice(memberIndex, 1);
    
    if (writeMembersData(existingMembers)) {
      return NextResponse.json({
        success: true,
        message: '구성원이 성공적으로 삭제되었습니다.'
      });
    } else {
      return NextResponse.json(
        { success: false, message: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/members:', error);
    return NextResponse.json(
      { success: false, message: '구성원 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 