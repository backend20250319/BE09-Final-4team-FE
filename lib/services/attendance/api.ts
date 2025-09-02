import apiClient from "../common/api-client";
import {
  // Types
  AttendanceResponse,
  CheckInRequest,
  CheckOutRequest,
  ScheduleResponseDto,
  CreateScheduleRequestDto,
  UpdateScheduleRequestDto,
  WorkPolicyResponseDto,
  WorkPolicyRequestDto,
  AnnualLeaveResponseDto,
  AnnualLeaveRequestDto,
  AnnualLeaveUpdateDto,
  LeaveRequestResponseDto,
  CreateLeaveRequestDto,
  WorkMonitorDto,
  AdjustWorkTimeRequestDto,
  WorkTimeAdjustment,
  UserWorkPolicyDto,
  ColleagueScheduleResponseDto,
  WeeklyWorkDetail,
  // Enums
  AttendanceStatus,
  WorkStatus,
  // API Result Types
  ApiResultAttendanceResponse,
  ApiResultScheduleResponseDto,
  ApiResultListScheduleResponseDto,
  ApiResultWorkPolicyResponseDto,
  ApiResultListWorkPolicyResponseDto,
  ApiResultAnnualLeaveResponseDto,
  ApiResultListAnnualLeaveResponseDto,
  ApiResultLeaveRequestResponseDto,
  ApiResultWorkTimeAdjustment,
  ApiResultUserWorkPolicyDto,
  ApiResultColleagueScheduleResponseDto,
  ApiResultWeeklyWorkDetail,
  ApiResultWorkMonitorDto,
  ApiResultInteger,
  ApiResultVoid,
  ApiResultMapStringObject,
} from "./types";

// Attendance API
export const attendanceApi = {
  // 출근 체크인
  checkIn: async (request: CheckInRequest): Promise<AttendanceResponse> => {
    const response = await apiClient.post<ApiResultAttendanceResponse>(
      "/api/attendance/check-in",
      request
    );
    return response.data.data;
  },

  // 퇴근 체크아웃
  checkOut: async (request: CheckOutRequest): Promise<AttendanceResponse> => {
    const response = await apiClient.post<ApiResultAttendanceResponse>(
      "/api/attendance/check-out",
      request
    );
    return response.data.data;
  },

  // 출근 상태 기록
  markAttendanceStatus: async (
    userId: number,
    date: string,
    attendanceStatus: AttendanceStatus,
    autoRecorded: boolean = true,
    checkInTime?: string,
    checkOutTime?: string
  ): Promise<AttendanceResponse> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      date,
      attendanceStatus,
      autoRecorded: autoRecorded.toString(),
    });

    if (checkInTime) params.append("checkInTime", checkInTime);
    if (checkOutTime) params.append("checkOutTime", checkOutTime);

    const response = await apiClient.post<ApiResultAttendanceResponse>(
      `/api/attendance/attendance-status?${params}`
    );
    return response.data.data;
  },

  // 근무 상태 기록
  markWorkStatus: async (
    userId: number,
    date: string,
    workStatus: WorkStatus,
    autoRecorded: boolean = true,
    checkInTime?: string,
    checkOutTime?: string
  ): Promise<AttendanceResponse> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      date,
      workStatus,
      autoRecorded: autoRecorded.toString(),
    });

    if (checkInTime) params.append("checkInTime", checkInTime);
    if (checkOutTime) params.append("checkOutTime", checkOutTime);

    const response = await apiClient.post<ApiResultAttendanceResponse>(
      `/api/attendance/work-status?${params}`
    );
    return response.data.data;
  },

  // 주간 근무 조회
  getWeeklyAttendance: async (
    userId: number,
    weekStart: string
  ): Promise<WeeklyWorkDetail> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      weekStart,
    });
    const response = await apiClient.get<ApiResultWeeklyWorkDetail>(
      `/api/attendance/weekly?${params}`
    );
    return response.data.data;
  },

  // 이번 주 근무 조회
  getThisWeekAttendance: async (userId: number): Promise<WeeklyWorkDetail> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
    });
    const response = await apiClient.get<ApiResultWeeklyWorkDetail>(
      `/api/attendance/weekly/this?${params}`
    );
    return response.data.data;
  },

  // 출근 가능 시간 조회
  getCheckInAvailableTime: async (
    userId: number
  ): Promise<Record<string, any>> => {
    const params = new URLSearchParams({
      userId: userId.toString(),
    });
    const response = await apiClient.get<ApiResultMapStringObject>(
      `/api/attendance/check-in-available-time?${params}`
    );
    return response.data.data;
  },
};

// Work Schedule API
export const workScheduleApi = {
  // 스케줄 생성
  createSchedule: async (
    request: CreateScheduleRequestDto
  ): Promise<ScheduleResponseDto> => {
    const response = await apiClient.post<ApiResultScheduleResponseDto>(
      "/api/work-schedule/schedules",
      request
    );
    return response.data.data;
  },

  // 스케줄 조회 (사용자별)
  getUserSchedules: async (userId: number): Promise<ScheduleResponseDto[]> => {
    const response = await apiClient.get<ApiResultListScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/schedules`
    );
    return response.data.data;
  },

  // 스케줄 조회 (날짜 범위)
  getUserSchedulesByDateRange: async (
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<ScheduleResponseDto[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await apiClient.get<ApiResultListScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/schedules/range?${params}`
    );
    return response.data.data;
  },

  // 스케줄 조회 (ID)
  getScheduleById: async (
    userId: number,
    scheduleId: number
  ): Promise<ScheduleResponseDto> => {
    const response = await apiClient.get<ApiResultScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/schedules/${scheduleId}`
    );
    return response.data.data;
  },

  // 스케줄 수정
  updateSchedule: async (
    userId: number,
    scheduleId: number,
    request: UpdateScheduleRequestDto
  ): Promise<ScheduleResponseDto> => {
    const response = await apiClient.put<ApiResultScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/schedules/${scheduleId}`,
      request
    );
    return response.data.data;
  },

  // 스케줄 삭제
  deleteSchedule: async (userId: number, scheduleId: number): Promise<void> => {
    await apiClient.delete<ApiResultVoid>(
      `/api/work-schedule/users/${userId}/schedules/${scheduleId}`
    );
  },

  // 고정 스케줄 생성
  createFixedSchedules: async (
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<ScheduleResponseDto[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await apiClient.post<ApiResultListScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/fixed-schedules?${params}`
    );
    return response.data.data;
  },

  // 근무 정책 적용
  applyWorkPolicyToSchedule: async (
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<ScheduleResponseDto[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await apiClient.post<ApiResultListScheduleResponseDto>(
      `/api/work-schedule/users/${userId}/apply-work-policy?${params}`
    );
    return response.data.data;
  },

  // 사용자 근무 정책 조회
  getUserWorkPolicy: async (userId: number): Promise<UserWorkPolicyDto> => {
    const response = await apiClient.get<ApiResultUserWorkPolicyDto>(
      `/api/work-schedule/users/${userId}/work-policy`
    );
    return response.data.data;
  },

  // 동료 스케줄 조회
  getColleagueSchedule: async (
    colleagueId: number,
    startDate: string,
    endDate: string
  ): Promise<ColleagueScheduleResponseDto> => {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await apiClient.get<ApiResultColleagueScheduleResponseDto>(
      `/api/work-schedule/colleagues/${colleagueId}/schedules?${params}`
    );
    return response.data.data;
  },

  // 근무 시간 조정
  createWorkTimeAdjustment: async (
    request: AdjustWorkTimeRequestDto
  ): Promise<WorkTimeAdjustment> => {
    const response = await apiClient.post<ApiResultWorkTimeAdjustment>(
      "/api/work-schedule/work-time-adjustments",
      request
    );
    return response.data.data;
  },
};

// Work Policy API
export const workPolicyApi = {
  // 전체 근무 정책 목록 조회
  getAllWorkPolicies: async (): Promise<WorkPolicyResponseDto[]> => {
    const response = await apiClient.get<ApiResultListWorkPolicyResponseDto>(
      "/api/workpolicy"
    );
    return response.data.data;
  },

  // 근무 정책 조회 (ID)
  getWorkPolicyById: async (
    workPolicyId: number
  ): Promise<WorkPolicyResponseDto> => {
    const response = await apiClient.get<ApiResultWorkPolicyResponseDto>(
      `/api/workpolicy/${workPolicyId}`
    );
    return response.data.data;
  },

  // 근무 정책 생성
  createWorkPolicy: async (
    request: WorkPolicyRequestDto
  ): Promise<WorkPolicyResponseDto> => {
    const response = await apiClient.post<ApiResultWorkPolicyResponseDto>(
      "/api/workpolicy",
      request
    );
    return response.data.data;
  },
};

// Annual Leave API
export const annualLeaveApi = {
  // 연차 정책 조회 (ID)
  getAnnualLeaveById: async (id: number): Promise<AnnualLeaveResponseDto> => {
    const response = await apiClient.get<ApiResultAnnualLeaveResponseDto>(
      `/api/annual-leaves/${id}`
    );
    return response.data.data;
  },

  // 연차 정책 수정
  updateAnnualLeave: async (
    id: number,
    request: AnnualLeaveUpdateDto
  ): Promise<AnnualLeaveResponseDto> => {
    const response = await apiClient.put<ApiResultAnnualLeaveResponseDto>(
      `/api/annual-leaves/${id}`,
      request
    );
    return response.data.data;
  },

  // 연차 정책 삭제
  deleteAnnualLeave: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResultVoid>(`/api/annual-leaves/${id}`);
  },

  // 근무 정책별 연차 정책 목록 조회
  getAnnualLeavesByWorkPolicyId: async (
    workPolicyId: number
  ): Promise<AnnualLeaveResponseDto[]> => {
    const response = await apiClient.get<ApiResultListAnnualLeaveResponseDto>(
      `/api/annual-leaves/work-policies/${workPolicyId}`
    );
    return response.data.data;
  },

  // 연차 정책 생성
  createAnnualLeave: async (
    workPolicyId: number,
    request: AnnualLeaveRequestDto
  ): Promise<AnnualLeaveResponseDto> => {
    const response = await apiClient.post<ApiResultAnnualLeaveResponseDto>(
      `/api/annual-leaves/work-policies/${workPolicyId}`,
      request
    );
    return response.data.data;
  },

  // 근무 정책별 총 연차 일수 계산
  calculateTotalLeaveDays: async (workPolicyId: number): Promise<number> => {
    const response = await apiClient.get<ApiResultInteger>(
      `/api/annual-leaves/work-policies/${workPolicyId}/total-leave-days`
    );
    return response.data.data;
  },

  // 근무 정책별 총 휴일 일수 계산
  calculateTotalHolidayDays: async (workPolicyId: number): Promise<number> => {
    const response = await apiClient.get<ApiResultInteger>(
      `/api/annual-leaves/work-policies/${workPolicyId}/total-holiday-days`
    );
    return response.data.data;
  },
};

// Leave API
export const leaveApi = {
  // 휴가 신청 생성
  createLeaveRequest: async (
    request: CreateLeaveRequestDto
  ): Promise<LeaveRequestResponseDto> => {
    const response = await apiClient.post<ApiResultLeaveRequestResponseDto>(
      "/api/leaves",
      request
    );
    return response.data.data;
  },

  // 휴가 신청 조회
  getLeaveRequest: async (
    requestId: number
  ): Promise<LeaveRequestResponseDto> => {
    const response = await apiClient.get<ApiResultLeaveRequestResponseDto>(
      `/api/leaves/${requestId}`
    );
    return response.data.data;
  },

  // 휴가 신청 수정
  modifyLeaveRequest: async (
    requestId: number,
    request: CreateLeaveRequestDto
  ): Promise<LeaveRequestResponseDto> => {
    const response = await apiClient.put<ApiResultLeaveRequestResponseDto>(
      `/api/leaves/${requestId}`,
      request
    );
    return response.data.data;
  },
};

// Work Monitor API
export const workMonitorApi = {
  // 특정 날짜 근무 모니터링 조회
  getWorkMonitorByDate: async (date: string): Promise<WorkMonitorDto> => {
    const response = await apiClient.get<ApiResultWorkMonitorDto>(
      `/api/work-monitor/${date}`
    );
    return response.data.data;
  },

  // 오늘 근무 모니터링 조회
  getTodayWorkMonitor: async (): Promise<WorkMonitorDto> => {
    const response = await apiClient.get<ApiResultWorkMonitorDto>(
      "/api/work-monitor/today"
    );
    return response.data.data;
  },

  // 특정 날짜 근무 모니터링 데이터 갱신
  updateWorkMonitorData: async (date: string): Promise<WorkMonitorDto> => {
    const response = await apiClient.post<ApiResultWorkMonitorDto>(
      `/api/work-monitor/update/${date}`
    );
    return response.data.data;
  },

  // 오늘 근무 모니터링 데이터 갱신
  updateTodayWorkMonitorData: async (): Promise<WorkMonitorDto> => {
    const response = await apiClient.post<ApiResultWorkMonitorDto>(
      "/api/work-monitor/update/today"
    );
    return response.data.data;
  },
};
