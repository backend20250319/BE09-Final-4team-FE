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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.members || !Array.isArray(body.members)) {
      return NextResponse.json(
        { success: false, message: 'members 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    const membersWithIds = body.members.map((member: any, index: number) => ({
      ...member,
      id: member.id || (Date.now() + index).toString(),
      createdAt: member.createdAt || new Date().toISOString(),
      updatedAt: member.updatedAt || new Date().toISOString()
    }));

    if (writeMembersData(membersWithIds)) {
      return NextResponse.json({
        success: true,
        message: `${membersWithIds.length}명의 구성원이 성공적으로 저장되었습니다.`,
        count: membersWithIds.length
      });
    } else {
      return NextResponse.json(
        { success: false, message: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/members/bulk:', error);
    return NextResponse.json(
      { success: false, message: '구성원 bulk 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 