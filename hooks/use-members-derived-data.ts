"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const flatten = (nodes: OrgNode[] | undefined, acc: string[] = []) => {
      if (!nodes) return acc;
      for (const n of nodes) {
        acc.push(n.name);
        if (n.children && n.children.length > 0) flatten(n.children, acc);
      }
      return acc;
    };
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/organizations.json");
        if (!res.ok) throw new Error("조직 데이터를 불러오지 못했습니다.");
        const data: OrgNode[] = await res.json();
        if (!mounted) return;
        const flat = Array.from(new Set(flatten(data)));
        setOrganizations(flat);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "조직 데이터 로드 실패");
        setOrganizations([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { organizations, loading, error } as const;
}

export function useTitlesFromMembers() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/members");
        if (!res.ok) throw new Error("구성원 목록을 불러오지 못했습니다.");
        const json = await res.json();
        if (!json?.success) throw new Error("구성원 데이터를 불러오는 중 오류");
        if (!mounted) return;
        setMembers(json.members as MemberRecord[]);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "구성원 데이터 로드 실패");
        setMembers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const ranks = useMemo(() => Array.from(new Set(members.map(m => (m.rank || "").trim()).filter(Boolean))), [members]);
  const positions = useMemo(() => Array.from(new Set(members.map(m => (m.position || "").trim()).filter(Boolean))), [members]);
  const jobs = useMemo(() => Array.from(new Set(members.map(m => (m.job || "").trim()).filter(Boolean))), [members]);
  const roles = useMemo(() => Array.from(new Set(members.map(m => (m.role || "").trim()).filter(Boolean))), [members]);

  return { ranks, positions, jobs, roles, loading, error } as const;
}


