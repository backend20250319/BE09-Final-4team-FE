import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:9000';

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gateway 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: result.status === 'SUCCESS',
      members: result.data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/members:', error);
    return NextResponse.json(
      { success: false, message: '구성원 데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}