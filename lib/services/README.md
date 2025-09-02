# Services Structure

MSA(Microservices Architecture) 환경을 위한 서비스별 API 클라이언트 구조입니다.

## 폴더 구조

```
lib/services/
├── common/                   # 공통 타입 및 유틸리티
│   ├── types.ts              # 공통 API 응답 타입 (ApiResult, PageResult 등)
│   ├── api-client.ts         # 공통 HTTP 클라이언트 설정
│   └── index.ts              # 공통 exports
├── approval/                 # 승인 서비스
│   ├── types.ts              # 승인 서비스 전용 타입
│   ├── api.ts                # 승인 서비스 API 함수들
│   └── index.ts              # 승인 서비스 exports
├── user/                     # 사용자 서비스
│   ├── types.ts              # 사용자 서비스 전용 타입
│   ├── api.ts                # 사용자 서비스 API 함수들
│   └── index.ts              # 사용자 서비스 exports
├── attendance/               # 근태 서비스
│   ├── types.ts              # 근태 서비스 전용 타입
│   ├── api.ts                # 근태 서비스 API 함수들
│   └── index.ts              # 근태 서비스 exports
└── ...
```

## 사용 방법

### 1. 특정 서비스만 임포트
```typescript
import { approvalApi, DocumentStatus } from '@/lib/services/approval'
import { userApi, UserRole } from '@/lib/services/user'
```

### 2. 공통 타입 사용
```typescript
import { ApiResult, PageResult } from '@/lib/services/common'
```

### 3. 개별 서비스를 직접 임포트 (권장)
```typescript
import { approvalApi } from '@/lib/services/approval'
import { userApi } from '@/lib/services/user'
```

## 새로운 서비스 추가하기

1. `lib/services/` 하위에 서비스 이름으로 폴더 생성
2. 해당 폴더에 `types.ts`, `api.ts`, `index.ts` 파일 생성

### 예시

```typescript
// lib/services/approval/types.ts
export interface DocumentResponse {
  id: number
  title: string
  content?: string
  status: DocumentStatus
  authorId: number
  template: TemplateResponse
  createdAt: string
  updatedAt: string
}

// lib/services/approval/api.ts
import apiClient from '../common/api-client'
import { CreateDocumentRequest, DocumentResponse } from './types'
import { ApiResult, PageResult } from '../common/types'

export const documentApi = {
  createDocument: async (request: CreateDocumentRequest): Promise<DocumentResponse> => {
    const response = await apiClient.post<ApiResult<DocumentResponse>>('/api/approval/documents', request)
    return response.data.data
  },
}

// lib/services/approval/index.ts
export * from './types'
export * from './api'
export { default as approvalApi } from './api'
```

## 가이드라인

### `ApiResult<T>`

**직접 제네릭 타입 사용**: `ApiResult<T>`에 대해 타입 별칭을 만들지 말고 직접 사용

```typescript
// ❌ 타입 별칭 사용
export type ApiResultUserResponse = ApiResult<UserResponse>

// ✅ 직접 제네릭 타입 사용
const response = await apiClient.get<ApiResult<UserResponse>>('/api/users')
```
