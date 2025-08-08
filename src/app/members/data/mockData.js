// 직원 데이터
export const mockEmployees = [
  {
    id: 1,
    name: '비니비니',
    position: 'CEO',
    email: 'bini.bini@company.com',
    phone: '010-0000-0000',
    address: '서울특별시 강남구',
    joinDate: '2020-01-01',
    organization: 'CEO',
    role: '본부장',
    job: '사업 기획',
    rank: '1급',
    isAdmin: true,
    teams: ['CEO', '인사팀', '경영팀'],
    profileImage: null
  },
  {
    id: 2,
    name: '김철수',
    position: '팀장',
    email: 'kim.cs@company.com',
    phone: '010-1234-5678',
    address: '서울특별시 서초구',
    joinDate: '2021-03-15',
    organization: '개발팀',
    role: '팀장',
    job: '백엔드 개발',
    rank: '2급',
    isAdmin: false,
    teams: ['프론트엔드팀', '백엔드팀', '모바일팀'],
    profileImage: null
  },
  {
    id: 3,
    name: '이영희',
    position: '선임',
    email: 'lee.yh@company.com',
    phone: '010-2345-6789',
    address: '서울특별시 마포구',
    joinDate: '2021-06-01',
    organization: '개발팀',
    role: '팀원',
    job: '프론트엔드 개발',
    rank: '3급',
    isAdmin: false,
    teams: ['UI팀', 'UX팀', '그래픽팀'],
    profileImage: null
  },
  {
    id: 4,
    name: '박민수',
    position: '주임',
    email: 'park.ms@company.com',
    phone: '010-3456-7890',
    address: '경기도 성남시',
    joinDate: '2022-01-10',
    organization: '개발팀',
    role: '팀원',
    job: '백엔드 개발',
    rank: '4급',
    isAdmin: false,
    teams: ['백엔드팀', '프론트엔드팀'],
    profileImage: null
  },
  {
    id: 5,
    name: '최지은',
    position: '대리',
    email: 'choi.je@company.com',
    phone: '010-4567-8901',
    address: '서울특별시 송파구',
    joinDate: '2022-04-01',
    organization: '마케팅팀',
    role: '팀원',
    job: '마케팅',
    rank: '3급',
    isAdmin: false,
    teams: ['브랜드팀', '콘텐츠팀', '홍보팀'],
    profileImage: null
  },

  {
    id: 6,
    name: '정수민',
    position: '사원',
    email: 'jung.sm@company.com',
    phone: '010-5678-9012',
    organization: '개발본부',
    teams: ['프론트엔드팀', '백엔드팀', '모바일팀'],
    profileImage: null
  },
  {
    id: 7,
    name: '한지훈',
    position: '팀장',
    email: 'han.jh@company.com',
    phone: '010-6789-0123',
    organization: '경영진',
    teams: ['경영팀'],
    profileImage: null
  },
  {
    id: 8,
    name: '송미영',
    position: '선임',
    email: 'song.my@company.com',
    phone: '010-7890-1234',
    organization: '개발본부',
    teams: ['백엔드팀', '모바일팀', '프론트엔드팀'],
    profileImage: null
  },
  {
    id: 9,
    name: '강동현',
    position: '주임',
    email: 'kang.dh@company.com',
    phone: '010-8901-2345',
    organization: '디자인본부',
    teams: ['UX팀', '그래픽팀', 'UI팀'],
    profileImage: null
  },
  {
    id: 10,
    name: '윤서연',
    position: '대리',
    email: 'yoon.sy@company.com',
    phone: '010-9012-3456',
    organization: '개발본부',
    teams: ['모바일팀', '프론트엔드팀'],
    profileImage: null
  },
  {
    id: 11,
    name: '임태호',
    position: '사원',
    email: 'lim.th@company.com',
    phone: '010-0123-4567',
    organization: '마케팅본부',
    teams: ['콘텐츠팀', '홍보팀', '브랜드팀'],
    profileImage: null
  },
  {
    id: 12,
    name: '김미영',
    position: '팀장',
    email: 'kim.my@company.com',
    phone: '010-1111-2222',
    organization: '디자인본부',
    teams: ['UI팀', 'UX팀'],
    profileImage: null
  },
  {
    id: 13,
    name: '이준호',
    position: '선임',
    email: 'lee.jh@company.com',
    phone: '010-2222-3333',
    organization: '개발본부',
    teams: ['프론트엔드팀', '백엔드팀', '모바일팀'],
    profileImage: null
  },
  {
    id: 14,
    name: '박수진',
    position: '주임',
    email: 'park.sj@company.com',
    phone: '010-3333-4444',
    organization: '마케팅본부',
    teams: ['브랜드팀', '콘텐츠팀'],
    profileImage: null
  },
  {
    id: 15,
    name: '최동현',
    position: '대리',
    email: 'choi.dh@company.com',
    phone: '010-4444-5555',
    organization: '개발본부',
    teams: ['백엔드팀', '프론트엔드팀', '모바일팀'],
    profileImage: null
  },
  {
    id: 16,
    name: '정민지',
    position: '사원',
    email: 'jung.mj@company.com',
    phone: '010-5555-6666',
    organization: '디자인본부',
    teams: ['UX팀', 'UI팀', '그래픽팀'],
    profileImage: null
  },
  {
    id: 17,
    name: '한승우',
    position: '팀장',
    email: 'han.sw@company.com',
    phone: '010-6666-7777',
    organization: '마케팅본부',
    teams: ['홍보팀', '콘텐츠팀', '브랜드팀'],
    profileImage: null
  },
  {
    id: 18,
    name: '송지현',
    position: '선임',
    email: 'song.jh@company.com',
    phone: '010-7777-8888',
    organization: '개발본부',
    teams: ['프론트엔드팀', '백엔드팀'],
    profileImage: null
  },
  {
    id: 19,
    name: '강현우',
    position: '주임',
    email: 'kang.hw@company.com',
    phone: '010-8888-9999',
    organization: '디자인본부',
    teams: ['그래픽팀', 'UI팀', 'UX팀'],
    profileImage: null
  },
  {
    id: 20,
    name: '윤서진',
    position: '대리',
    email: 'yoon.sj@company.com',
    phone: '010-9999-0000',
    organization: '마케팅본부',
    teams: ['브랜드팀', '홍보팀', '콘텐츠팀'],
    profileImage: null
  },
  {
    id: 21,
    name: '임준호',
    position: '사원',
    email: 'lim.jh@company.com',
    phone: '010-0000-1111',
    organization: '개발본부',
    teams: ['모바일팀', '프론트엔드팀', '백엔드팀'],
    profileImage: null
  },
  {
    id: 22,
    name: '김영수',
    position: '사원',
    email: 'kim.ys@company.com',
    phone: '010-1111-3333',
    organization: '디자인본부',
    teams: ['UX팀', '그래픽팀'],
    profileImage: null
  },
  {
    id: 23,
    name: '이미라',
    position: '대리',
    email: 'lee.mr@company.com',
    phone: '010-2222-4444',
    organization: '마케팅본부',
    teams: ['콘텐츠팀', '홍보팀'],
    profileImage: null
  },
  {
    id: 24,
    name: '박성훈',
    position: '선임',
    email: 'park.sh@company.com',
    phone: '010-3333-5555',
    organization: '개발본부',
    teams: ['프론트엔드팀', '백엔드팀', '모바일팀'],
    profileImage: null
  },
  {
    id: 25,
    name: '최유진',
    position: '사원',
    email: 'choi.yj@company.com',
    phone: '010-4444-6666',
    organization: '디자인본부',
    teams: ['그래픽팀', 'UI팀', 'UX팀'],
    profileImage: null
  },
  {
    id: 26,
    name: '정태우',
    position: '팀장',
    email: 'jung.tw@company.com',
    phone: '010-5555-7777',
    organization: '경영진',
    teams: ['경영팀'],
    profileImage: null
  },
  {
    id: 1754459364615,
    name: '꾸니',
    position: '이사',
    email: 'kuni@hermes.com',
    phone: '010-1234-1234',
    address: '경기도 수원시 권선구',
    joinDate: '2025-08-06',
    organization: '인사팀',
    role: '본부장',
    job: '사업 기획',
    rank: '2급',
    isAdmin: false,
    teams: ['인사팀'],
    profileImage: null
  },
    {
    id: 1754459528056,
    name: '바니바니',
    position: '사장',
    email: 'bani@hermesai.com',
    phone: '010-1234-4321',
    address: '서울시 서초구 서초동',
    joinDate: '2025-08-03',
    organization: '경영팀',
    role: '본부장',
    job: '사업 기획',
    rank: '1급',
    isAdmin: false,
    teams: ['경영팀'],
    profileImage: null
  },
    // 추가 직원들 (27-142) - 다중 팀 소속으로 랜덤 생성 (최대 5개 팀)
  ...Array.from({ length: 116 }, (_, i) => {
    const allTeams = ['프론트엔드팀', '백엔드팀', '모바일팀', 'UI팀', 'UX팀', '그래픽팀', '브랜드팀', '콘텐츠팀', '홍보팀', '경영팀'];
    const organizations = ['개발본부', '디자인본부', '마케팅본부', '경영진'];
    const selectedOrg = organizations[Math.floor(Math.random() * organizations.length)];
    
    // 해당 조직에 맞는 팀들만 선택
    let availableTeams = [];
    if (selectedOrg === '개발본부') {
      availableTeams = ['프론트엔드팀', '백엔드팀', '모바일팀'];
    } else if (selectedOrg === '디자인본부') {
      availableTeams = ['UI팀', 'UX팀', '그래픽팀'];
    } else if (selectedOrg === '마케팅본부') {
      availableTeams = ['브랜드팀', '콘텐츠팀', '홍보팀'];
    } else if (selectedOrg === '경영진') {
      availableTeams = ['인사팀', '경영팀'];
    }
    
    // 1~5개의 팀을 랜덤하게 선택 (최대 5개 팀)
    const maxTeamCount = Math.min(5, availableTeams.length);
    const teamCount = Math.floor(Math.random() * maxTeamCount) + 1;
    const selectedTeams = [];
    const shuffledTeams = [...availableTeams].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < teamCount && j < shuffledTeams.length; j++) {
      selectedTeams.push(shuffledTeams[j]);
    }
    
    const positions = ['팀장', '선임', '주임', '대리', '사원'];
    const roles = ['본부장', '팀장', '팀원', '인턴'];
    const jobs = ['사업 기획', '프론트엔드 개발', '백엔드 개발', '인사 관리', '마케팅', '영업', '디자인'];
    const ranks = ['1급', '2급', '3급', '4급', '5급'];
    const addresses = ['서울특별시 강남구', '서울특별시 서초구', '서울특별시 마포구', '경기도 성남시', '서울특별시 송파구'];
    
    // 입사일을 2020-01-01부터 2024-12-31까지 랜덤 생성
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-12-31');
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const joinDate = new Date(randomTime).toISOString().split('T')[0];

    return {
      id: i + 27,
      name: `직원${i + 26}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      email: `employee${i + 26}@company.com`,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      joinDate: joinDate,
      organization: selectedOrg,
      role: roles[Math.floor(Math.random() * roles.length)],
      job: jobs[Math.floor(Math.random() * jobs.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      isAdmin: false,
      teams: selectedTeams,
      profileImage: null
    };
  })
];

// 조직도 구조 데이터
export const mockOrgStructure = {
  id: 'CEO',
  name: 'CEO',
  children: [
    {
      id: '경영진',
      name: '경영진',
      children: [
        { id: '인사팀', name: '인사팀', children: [] },
        { id: '경영팀', name: '경영팀', children: [] }
      ]
    },
    {
      id: '개발본부',
      name: '개발본부',
      children: [
        { id: '프론트엔드팀', name: '프론트엔드팀', children: [] },
        { id: '백엔드팀', name: '백엔드팀', children: [] },
        { id: '모바일팀', name: '모바일팀', children: [] }
      ]
    },
    {
      id: '디자인본부',
      name: '디자인본부',
      children: [
        { id: 'UI팀', name: 'UI팀', children: [] },
        { id: 'UX팀', name: 'UX팀', children: [] },
        { id: '그래픽팀', name: '그래픽팀', children: [] }
      ]
    },
    {
      id: '마케팅본부',
      name: '마케팅본부',
      children: [
        { id: '브랜드팀', name: '브랜드팀', children: [] },
        { id: '콘텐츠팀', name: '콘텐츠팀', children: [] },
        { id: '홍보팀', name: '홍보팀', children: [] }
      ]
    }
  ]
}; 