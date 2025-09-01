import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:9000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/auth/login → Gateway 호출');
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('로그인 실패:', response.status, errorText);
      throw new Error(`로그인 실패: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('로그인 성공:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json(
      { 
        status: 'ERROR',
        message: '로그인 중 오류가 발생했습니다.',
        data: null 
      },
      { status: 500 }
    );
  }
}
