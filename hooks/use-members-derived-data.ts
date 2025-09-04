"use client";

import { useEffect, useMemo, useState } from "react";
import { organizationApi } from "@/lib/services/organization/api";
import { userApi } from "@/lib/services/user/api";

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

interface OrgNode {
    id: string;
    name: string;
    parentId?: string;
    children?: OrgNode[];
}

export function useOrganizationsList() {
    const [organizations, setOrganizations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadOrganizations = async () => {
            try {
                const res = await fetch("/organizations.json");
                if (!res.ok) throw new Error("조직 데이터를 불러오지 못했습니다.");
                const data: OrgNode[] = await res.json();
                const flatten = (nodes: OrgNode[] | undefined, acc: string[] = []) => {
                    if (!nodes) return acc;
                    for (const n of nodes) {
                        acc.push(n.name);
                        if (n.children && n.children.length > 0) flatten(n.children, acc);
                    }
                    return acc;
                };
                const flat = Array.from(new Set(flatten(data)));
                if (mounted) {
                    setOrganizations(flat);
                    setError(null);
                }
            } catch (e: any) {
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
            const res = await fetch("/organizations.json");
            if (!res.ok) throw new Error("조직 데이터를 불러오지 못했습니다.");
            const data: OrgNode[] = await res.json();
            const flatten = (nodes: OrgNode[] | undefined, acc: string[] = []) => {
                if (!nodes) return acc;
                for (const n of nodes) {
                    acc.push(n.name);
                    if (n.children && n.children.length > 0) flatten(n.children, acc);
                }
                return acc;
            };
            const flat = Array.from(new Set(flatten(data)));
            setOrganizations(flat);
            setError(null);
        } catch (e: any) {
            setError(e?.message || "조직 데이터 로드 실패");
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    return { organizations, loading, error, refetch } as const;
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