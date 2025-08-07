import { NextResponse } from 'next/server'

// Mock data for members
const mockMembers = [
  {
    id: "1",
    name: "김철수",
    email: "kim@hermesai.com",
    phone: "010-1234-5678",
    address: "서울시 강남구",
    joinDate: "2023-01-15",
    organization: "개발팀",
    position: "팀장",
    role: "개발자",
    job: "프론트엔드 개발",
    rank: "수석",
    isAdmin: true,
    teams: ["React", "TypeScript"],
    profileImage: null
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@hermesai.com",
    phone: "010-2345-6789",
    address: "서울시 서초구",
    joinDate: "2023-02-20",
    organization: "디자인팀",
    position: "팀원",
    role: "디자이너",
    job: "UI/UX 디자인",
    rank: "대리",
    isAdmin: false,
    teams: ["Figma", "Adobe"],
    profileImage: null
  },
  {
    id: "3",
    name: "박민수",
    email: "park@hermesai.com",
    phone: "010-3456-7890",
    address: "서울시 마포구",
    joinDate: "2023-03-10",
    organization: "개발팀",
    position: "팀원",
    role: "개발자",
    job: "백엔드 개발",
    rank: "사원",
    isAdmin: false,
    teams: ["Node.js", "Python"],
    profileImage: null
  },
  {
    id: "4",
    name: "정수진",
    email: "jung@hermesai.com",
    phone: "010-4567-8901",
    address: "서울시 송파구",
    joinDate: "2023-04-05",
    organization: "기획팀",
    position: "팀장",
    role: "기획자",
    job: "서비스 기획",
    rank: "수석",
    isAdmin: true,
    teams: ["기획", "분석"],
    profileImage: null
  },
  {
    id: "5",
    name: "최동현",
    email: "choi@hermesai.com",
    phone: "010-5678-9012",
    address: "서울시 영등포구",
    joinDate: "2023-05-12",
    organization: "개발팀",
    position: "팀원",
    role: "개발자",
    job: "풀스택 개발",
    rank: "대리",
    isAdmin: false,
    teams: ["React", "Node.js"],
    profileImage: null
  }
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({
      success: true,
      members: mockMembers
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Add new member
    const newMember = {
      id: Date.now().toString(),
      ...body,
      joinDate: new Date().toISOString().split('T')[0],
      isAdmin: false,
      teams: body.teams || []
    }
    
    mockMembers.push(newMember)
    
    return NextResponse.json({
      success: true,
      member: newMember
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
