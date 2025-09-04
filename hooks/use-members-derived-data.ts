"use client";

import { useEffect, useMemo, useState } from "react";
import { organizationApi } from "@/lib/services/organization/api";
import { userApi } from "@/lib/services/user/api";
import { OrganizationDto } from "@/lib/services/organization/types";
import { workPolicyApi } from "@/lib/services/attendance/api";
import { WorkPolicyResponseDto } from "@/lib/services/attendance/types";

interface MemberRecord {
    id: string;
    name: string;
    email: string;
    rank?: string;
    position?: string;
    job?: string;
    role?: string;
    organization?: string;
    organizations?: string[];
}

export function useOrganizationsList() {
    const [organizations, setOrganizations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadOrganizations = async () => {
            try {
                const data: OrganizationDto[] = await organizationApi.getAllOrganizations();
                
                const flatten = (orgs: OrganizationDto[] | undefined, acc: string[] = []): string[] => {
                    if (!orgs) return acc;
                    for (const org of orgs) {
                        acc.push(org.name);
                        if (org.children && org.children.length > 0) {
                            flatten(org.children, acc);
                        }
                    }
                    return acc;
                };
                
                const flat = Array.from(new Set(flatten(data)));
                if (mounted) {
                    setOrganizations(flat);
                    setError(null);
                }
            } catch (e: any) {
                console.error('조직 데이터 로드 실패:', e);
                if (mounted) {
                    setError(e?.message || "조직 데이터 로드 실패");
                    setOrganizations([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        loadOrganizations();
        return () => {
            mounted = false;
        };
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: OrganizationDto[] = await organizationApi.getAllOrganizations();
            
            const flatten = (orgs: OrganizationDto[] | undefined, acc: string[] = []): string[] => {
                if (!orgs) return acc;
                for (const org of orgs) {
                    acc.push(org.name);
                    if (org.children && org.children.length > 0) {
                        flatten(org.children, acc);
                    }
                }
                return acc;
            };
            
            const flat = Array.from(new Set(flatten(data)));
            setOrganizations(flat);
            setError(null);
        } catch (e: any) {
            console.error('조직 데이터 재로드 실패:', e);
            setError(e?.message || "조직 데이터 로드 실패");
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    return { organizations, loading, error, refetch } as const;
}

export function useWorkPoliciesList() {
    const [workPolicies, setWorkPolicies] = useState<WorkPolicyResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadWorkPolicies = async () => {
            try {
                const data: WorkPolicyResponseDto[] = await workPolicyApi.getAllWorkPolicies();
                if (mounted) {
                    setWorkPolicies(data);
                    setError(null);
                }
            } catch (e: any) {
                console.error('근무 정책 데이터 로드 실패:', e);
                if (mounted) {
                    setError(e?.message || "근무 정책 데이터 로드 실패");
                    setWorkPolicies([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        loadWorkPolicies();
        return () => {
            mounted = false;
        };
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: WorkPolicyResponseDto[] = await workPolicyApi.getAllWorkPolicies();
            setWorkPolicies(data);
            setError(null);
        } catch (e: any) {
            console.error('근무 정책 데이터 재로드 실패:', e);
            setError(e?.message || "근무 정책 데이터 로드 실패");
            setWorkPolicies([]);
        } finally {
            setLoading(false);
        }
    };

    return { workPolicies, loading, error, refetch } as const;
}

export function useTitlesFromMembers(membersData?: MemberRecord[]) {
    const safeMembersData = membersData || [];

    const ranks = useMemo(
        () => Array.from(new Set(safeMembersData.map(m => (m.rank || "").trim()).filter(Boolean))),
        [safeMembersData]
    );

    const positions = useMemo(
        () => Array.from(new Set(safeMembersData.map(m => (m.position || "").trim()).filter(Boolean))),
        [safeMembersData]
    );

    const jobs = useMemo(
        () => Array.from(new Set(safeMembersData.map(m => (m.job || "").trim()).filter(Boolean))),
        [safeMembersData]
    );

    const roles = useMemo(
        () => Array.from(new Set(safeMembersData.map(m => (m.role || "").trim()).filter(Boolean))),
        [safeMembersData]
    );

    return {
        ranks,
        positions,
        jobs,
        roles
    } as const;
}