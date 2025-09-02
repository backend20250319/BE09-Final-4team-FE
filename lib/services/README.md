# Services Structure

MSA(Microservices Architecture) 환경을 위한 서비스별 API 클라이언트 구조입니다.

## 폴더 구조

```
lib/services/
├── common/                    # 공통 타입 및 유틸리티
│   ├── types.ts              # 공통 API 응답 타입 (ApiResult, PageResult 등)
│   ├── api-client.ts         # 공통 HTTP 클라이언트 설정
│   └── index.ts              # 공통 exports
├── approval/                  # 승인 서비스
│   ├── types.ts              # 승인 서비스 전용 타입
│   ├── api.ts                # 승인 서비스 API 함수들
│   └── index.ts              # 승인 서비스 exports
├── user/                      # 사용자 서비스 (예시)
│   ├── types.ts              # 사용자 서비스 전용 타입
│   ├── api.ts                # 사용자 서비스 API 함수들
│   └── index.ts              # 사용자 서비스 exports
├── notification/              # 알림 서비스 (예시)
│   ├── types.ts              # 알림 서비스 전용 타입
│   ├── api.ts                # 알림 서비스 API 함수들
│   └── index.ts              # 알림 서비스 exports
└── index.ts                   # 전체 서비스 exports
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

### 3. 모든 서비스 임포트
```typescript
import { approvalApi, userApi, notificationApi } from '@/lib/services'
```

## 새로운 서비스 추가하기

1. `lib/services/` 하위에 서비스 이름으로 폴더 생성
2. 해당 폴더에 `types.ts`, `api.ts`, `index.ts` 파일 생성
3. `lib/services/index.ts`에 새 서비스 export 추가

### 예시: File Service 추가

```typescript
// lib/services/file/types.ts
export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
}

// lib/services/file/api.ts
import apiClient from '../common/api-client'
import { FileUploadResponse } from './types'

export const fileApi = {
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data
  }
}

// lib/services/file/index.ts
export * from './types'
export * from './api'
export { fileApi as default } from './api'

// lib/services/index.ts에 추가
export * from './file'
```

## 타입 정의 가이드라인

### API 응답 타입
- **직접 제네릭 타입 사용**: `ApiResult<T>` 타입 별칭을 만들지 말고 직접 `ApiResult<UserResponse>` 형태로 사용
- **명시적 타입 정의**: 타입 별칭보다는 명확한 제네릭 타입을 선호

```typescript
// ❌ 지양: 타입 별칭 사용
export type ApiResultUserResponse = ApiResult<UserResponse>

// ✅ 권장: 직접 제네릭 타입 사용
const response = await apiClient.get<ApiResult<UserResponse>>('/api/users')
```
