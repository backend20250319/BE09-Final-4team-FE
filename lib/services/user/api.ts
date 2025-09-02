import apiClient from '../common/api-client';
import {
  UserCreateDto,
  UserUpdateDto,
  UserResponseDto,
  LoginRequestDto,
  LoginResponse,
  MainProfileResponseDto,
  DetailProfileResponseDto,
  ColleagueSearchRequestDto,
  ColleagueResponseDto,
} from './types';
import { ApiResult } from '../common/types';

export const authApi = {
  login: async (data: LoginRequestDto): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResult<LoginResponse>>('/api/auth/login', data, {withCredentials: true});
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResult<void>>('/api/auth/logout');
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResult<LoginResponse>>('/api/auth/refresh', null, {withCredentials: true});
    return response.data.data;
  },
}

export const userApi = {
  getAllUsers: async (): Promise<UserResponseDto[]> => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  getUser: async (userId: number): Promise<UserResponseDto> => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  },

  createUser: async (data: UserCreateDto): Promise<UserResponseDto> => {
    const response = await apiClient.post('/api/users', data);
    return response.data;
  },

  updateUser: async (userId: number, data: UserUpdateDto): Promise<UserResponseDto> => {
    const response = await apiClient.patch(`/api/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<ApiResult<void>> => {
    const response = await apiClient.delete(`/api/users/${userId}`);
    return response.data;
  },

  getUserSimple: async (userId: number): Promise<any> => {
    const response = await apiClient.get(`/api/users/${userId}/simple`);
    return response.data;
  },

  getMainProfile: async (userId: number): Promise<MainProfileResponseDto> => {
    const response = await apiClient.get(`/api/users/${userId}/profile`);
    return response.data;
  },

  getDetailProfile: async (userId: number): Promise<DetailProfileResponseDto> => {
    const response = await apiClient.get(`/api/users/${userId}/profile/detail`);
    return response.data;
  },

  getTotalUsers: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/api/users/count');
    return response.data.data;
  },

  getColleagues: async (searchRequest: ColleagueSearchRequestDto): Promise<ColleagueResponseDto[]> => {
    const response = await apiClient.get('/api/users/colleagues', {
      params: searchRequest,
    });
    return response.data.data;
  },

  syncUserOrganization: async (userId: number): Promise<ApiResult<void>> => {
    const response = await apiClient.post(`/api/users/${userId}/sync-organization`);
    return response.data;
  },

  syncAllUsersOrganizations: async (): Promise<ApiResult<void>> => {
    const response = await apiClient.post('/api/users/sync-organizations');
    return response.data;
  },
};
