export interface CreateOrganizationRequest {
  name: string;
  parentId?: number;
}

export interface UpdateOrganizationRequest {
  name: string;
  parentId?: number;
}

export interface OrganizationDto {
  organizationId: number;
  name: string;
  parentId?: number;
  parentName?: string;
  children?: OrganizationDto[];
  memberCount: number;
  leaderCount: number;
}

export interface OrganizationHierarchyDto {
  organizationId: number;
  name: string;
  parentId?: number;
  parentName?: string;
  children?: OrganizationHierarchyDto[];
  memberCount: number;
  leaderCount: number;
  isExpanded: boolean;
}

export interface CreateAssignmentRequest {
  employeeId: number;
  organizationId: number;
  isPrimary?: boolean;
  isLeader?: boolean;
}

export interface EmployeeAssignmentDto {
  assignmentId: number;
  employeeId: number;
  employeeName: string;
  organizationId: number;
  organizationName: string;
  isPrimary: boolean;
  isLeader: boolean;
  assignedAt: string;
}

export interface ApiResultOrganizationDto {
  status: string;
  message: string;
  data: OrganizationDto;
}

export interface ApiResultListOrganizationDto {
  status: string;
  message: string;
  data: OrganizationDto[];
}

export interface ApiResultListOrganizationHierarchyDto {
  status: string;
  message: string;
  data: OrganizationHierarchyDto[];
}

export interface ApiResultEmployeeAssignmentDto {
  status: string;
  message: string;
  data: EmployeeAssignmentDto;
}

export interface ApiResultListEmployeeAssignmentDto {
  status: string;
  message: string;
  data: EmployeeAssignmentDto[];
}

export interface ApiResultVoid {
  status: string;
  message: string;
  data: any;
}
