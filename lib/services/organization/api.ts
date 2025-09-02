import apiClient from '../common/api-client';
import {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationDto,
  OrganizationHierarchyDto,
  CreateAssignmentRequest,
  EmployeeAssignmentDto,
  ApiResultOrganizationDto,
  ApiResultListOrganizationDto,
  ApiResultListOrganizationHierarchyDto,
  ApiResultEmployeeAssignmentDto,
  ApiResultListEmployeeAssignmentDto,
  ApiResultVoid,
} from './types';

export const organizationApi = {
  getAllOrganizations: async (): Promise<OrganizationDto[]> => {
    const response = await apiClient.get('/api/organizations');
    return response.data;
  },

  getOrganization: async (organizationId: number): Promise<OrganizationDto> => {
    const response = await apiClient.get(`/api/organizations/${organizationId}`);
    return response.data;
  },

  createOrganization: async (data: CreateOrganizationRequest): Promise<OrganizationDto> => {
    const response = await apiClient.post('/api/organizations', data);
    return response.data;
  },

  updateOrganization: async (organizationId: number, data: UpdateOrganizationRequest): Promise<OrganizationDto> => {
    const response = await apiClient.put(`/api/organizations/${organizationId}`, data);
    return response.data;
  },

  deleteOrganization: async (organizationId: number): Promise<ApiResultVoid> => {
    const response = await apiClient.delete(`/api/organizations/${organizationId}`);
    return response.data;
  },

  searchOrganizations: async (keyword: string): Promise<OrganizationDto[]> => {
    const response = await apiClient.get('/api/organizations/search', {
      params: { keyword },
    });
    return response.data;
  },

  getRootOrganizations: async (): Promise<OrganizationDto[]> => {
    const response = await apiClient.get('/api/organizations/root');
    return response.data;
  },

  getOrganizationHierarchy: async (): Promise<OrganizationHierarchyDto[]> => {
    const response = await apiClient.get('/api/organizations/hierarchy');
    return response.data;
  },

  getAllAssignments: async (): Promise<EmployeeAssignmentDto[]> => {
    const response = await apiClient.get('/api/assignments');
    return response.data.data;
  },

  getAssignment: async (assignmentId: number): Promise<EmployeeAssignmentDto> => {
    const response = await apiClient.get(`/api/assignments/${assignmentId}`);
    return response.data.data;
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<EmployeeAssignmentDto> => {
    const response = await apiClient.post('/api/assignments', data);
    return response.data.data;
  },

  updateAssignment: async (assignmentId: number, data: CreateAssignmentRequest): Promise<EmployeeAssignmentDto> => {
    const response = await apiClient.put(`/api/assignments/${assignmentId}`, data);
    return response.data.data;
  },

  deleteAssignment: async (assignmentId: number): Promise<ApiResultVoid> => {
    const response = await apiClient.delete(`/api/assignments/${assignmentId}`);
    return response.data;
  },

  getAssignmentsByOrganizationId: async (organizationId: number): Promise<EmployeeAssignmentDto[]> => {
    const response = await apiClient.get(`/api/assignments/organization/${organizationId}`);
    return response.data.data;
  },

  getLeadersByOrganizationId: async (organizationId: number): Promise<EmployeeAssignmentDto[]> => {
    const response = await apiClient.get(`/api/assignments/organization/${organizationId}/leaders`);
    return response.data.data;
  },

  getAssignmentsByEmployeeId: async (employeeId: number): Promise<EmployeeAssignmentDto[]> => {
    const response = await apiClient.get(`/api/assignments/employee/${employeeId}`);
    return response.data.data;
  },

  getPrimaryAssignmentsByEmployeeId: async (employeeId: number): Promise<EmployeeAssignmentDto[]> => {
    const response = await apiClient.get(`/api/assignments/employee/${employeeId}/primary`);
    return response.data.data;
  },
};
