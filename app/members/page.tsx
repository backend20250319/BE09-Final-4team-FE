"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Settings,
  Building2,
  ChevronDown,
  ChevronRight,
  Expand,
  Minimize,
} from "lucide-react";
import { toast } from "sonner";
import AddMemberModal from "./components/AddMemberModal";
import SettingsModal from "./components/SettingsModal";
import MemberList from "./components/MemberList";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  organization?: string;
  organizations?: string[];
  position: string;
  role: string;
  job: string;
  rank?: string;
  isAdmin: boolean;
  teams: string[];
  profileImage?: string;
}

interface OrgStructure {
  name: string;
  children?: OrgStructure[];
  employeeCount: number;
  isExpanded?: boolean;
}

export default function MembersPage() {
  const { isLoading, isLoggedIn, getAuthHeaders } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [orgStructure, setOrgStructure] = useState<OrgStructure[]>([]);
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter((emp) => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = emp.name.toLowerCase().includes(searchLower);
        const orgMatch = (emp.organization && emp.organization.toLowerCase().includes(searchLower)) ||
          (Array.isArray(emp.organizations) && emp.organizations.some((o) => o.toLowerCase().includes(searchLower)));
        const teamMatch = emp.teams && emp.teams.some((team) => team.toLowerCase().includes(searchLower));
        return nameMatch || orgMatch || teamMatch;
      });
    }

    if (selectedOrg) {
      filtered = filtered.filter((emp) => {
        const orgMatch = emp.organization === selectedOrg ||
          (Array.isArray(emp.organizations) && emp.organizations.includes(selectedOrg));
        const teamMatch = emp.teams && emp.teams.includes(selectedOrg);
        return orgMatch || teamMatch;
      });
    }

    return filtered;
  }, [employees, searchTerm, selectedOrg]);

  const calculateEmployeeCounts = (employees: Employee[]) => {
    const orgCounts: Record<string, number> = {};
    const teamCounts: Record<string, number> = {};

    employees.forEach((emp) => {
      const orgList = Array.isArray(emp.organizations) && emp.organizations.length > 0
        ? emp.organizations
        : emp.organization ? [emp.organization] : [];
      
      orgList.forEach((orgName) => {
        orgCounts[orgName] = (orgCounts[orgName] || 0) + 1;
      });

      if (emp.teams) {
        emp.teams.forEach((team) => {
          teamCounts[team] = (teamCounts[team] || 0) + 1;
        });
      }
    });

    return { orgCounts, teamCounts };
  };

  const buildOrgStructure = (employees: Employee[]): OrgStructure[] => {
    const { orgCounts, teamCounts } = calculateEmployeeCounts(employees);
    
    const orgs = Object.keys(orgCounts).map(orgName => ({
      name: orgName,
      employeeCount: orgCounts[orgName],
      isExpanded: false,
      children: Object.keys(teamCounts)
        .filter(teamName => teamName.includes(orgName) || orgName.includes(teamName))
        .map(teamName => ({
          name: teamName,
          employeeCount: teamCounts[teamName],
          isExpanded: false
        }))
    }));

    return orgs;
  };

  const fetchEmployees = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setDataLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch("/api/members", { headers });
      const data = await response.json();

      if (data.success && data.members) {
        setEmployees(data.members);
        setOrgStructure(buildOrgStructure(data.members));
      } else {
        toast.error("직원 데이터를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("직원 데이터 로드 오류:", error);
      toast.error("직원 데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setDataLoading(false);
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoading, isLoggedIn, fetchEmployees]);

  const handleOrgSelect = (orgName: string) => {
    setSelectedOrg(orgName === selectedOrg ? null : orgName);
  };

  const handleOrgToggle = (orgName: string) => {
    setOrgStructure((prev) => {
      const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
        return orgs.map((org) => {
          if (org.name === orgName) {
            return { ...org, isExpanded: !org.isExpanded };
          }
          if (org.children) {
            return { ...org, children: updateOrg(org.children) };
          }
          return org;
        });
      };
      return updateOrg(prev);
    });
  };

  const handleExpandAllToggle = () => {
    const newExpandedState = !isAllExpanded;
    setIsAllExpanded(newExpandedState);
    setOrgStructure((prev) => {
      const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
        return orgs.map((org) => ({
          ...org,
          isExpanded: newExpandedState,
          children: org.children ? updateOrg(org.children) : undefined,
        }));
      };
      return updateOrg(prev);
    });
  };

  const filteredOrgStructure = useMemo(() => {
    if (!orgSearchTerm) return orgStructure;
    
    const term = orgSearchTerm.toLowerCase();
    const filterTree = (orgs: OrgStructure[]): OrgStructure[] => {
      const result: OrgStructure[] = [];
      for (const org of orgs) {
        const selfMatch = org.name.toLowerCase().includes(term);
        const filteredChildren = org.children ? filterTree(org.children) : undefined;

        if (selfMatch) {
          result.push({
            ...org,
            isExpanded: filteredChildren && filteredChildren.length > 0,
            children: filteredChildren,
          });
        } else if (filteredChildren && filteredChildren.length > 0) {
          result.push({ ...org, isExpanded: true, children: filteredChildren });
        }
      }
      return result;
    };

    return filterTree(orgStructure);
  }, [orgStructure, orgSearchTerm]);

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees((prev) => prev.map((emp) => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };

  const handleAddMemberSave = async (memberData: any) => {
    try {
      const headers = getAuthHeaders();
      
      const response = await fetch("/api/members", {
        method: "POST",
        headers,
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (result.success) {
        const newMember: Employee = {
          id: result.member.id,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone || "",
          address: memberData.address || "",
          joinDate: memberData.joinDate,
          organization: memberData.organization,
          organizations: Array.isArray(memberData.organizations) ? memberData.organizations : undefined,
          position: memberData.position,
          role: memberData.role,
          job: memberData.job,
          rank: memberData.rank || "",
          isAdmin: Boolean(memberData.isAdmin),
          teams: memberData.teams || [],
        };

        const updatedEmployees = [...employees, newMember];
        setEmployees(updatedEmployees);
        setOrgStructure(buildOrgStructure(updatedEmployees));
        setShowAddMemberModal(false);
        toast.success("구성원이 성공적으로 추가되었습니다.");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("구성원 추가 오류:", error);
      toast.error("구성원 추가 중 오류가 발생했습니다: " + (error as Error).message);
    }
  };

  const OrgTreeItem = ({ org, level = 0 }: { org: OrgStructure; level?: number }) => (
    <div className="ml-4">
      <button
        onClick={() => handleOrgSelect(org.name)}
        className={`group w-full text-left p-2 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 ${
          selectedOrg === org.name
            ? "bg-blue-50 text-blue-800 ring-1 ring-blue-200 hover:ring-blue-300"
            : "bg-white hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-200 hover:shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {org.children && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrgToggle(org.name);
                }}
                className="p-1 hover:bg-gray-200 rounded cursor-pointer"
              >
                {org.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            )}
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{org.name}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {org.employeeCount}명
          </Badge>
        </div>
      </button>
      {org.children && org.isExpanded && (
        <div className="mt-1">
          {org.children.map((child, index) => (
            <OrgTreeItem key={index} org={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading || dataLoading) {
    return (
      <MainLayout requireAuth={true}>
        <div className="flex justify-center items-center h-screen w-full">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth={true}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedOrg ? `구성원 - ${selectedOrg}` : "구성원"}
          </h1>
          <div className="flex items-center gap-2">
            <GradientButton variant="primary" onClick={() => setShowSettingsModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              설정
            </GradientButton>
          </div>
        </div>
        <p className="text-gray-600">
          직원 수: {filteredEmployees.length}
          {selectedOrg && ` (${selectedOrg} 필터링됨)`}
          {searchTerm && ` (검색어: "${searchTerm}")`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">구성원 목록</h3>
            </div>
            <MemberList
              employees={filteredEmployees}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrg={selectedOrg}
              placeholder="직원명, 조직명, 팀명으로 검색"
              onEmployeeUpdate={handleEmployeeUpdate}
            />
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">조직도</h3>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="조직명을 입력하여 검색"
                  value={orgSearchTerm}
                  onChange={(e) => setOrgSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExpandAllToggle}
                className="flex items-center gap-1"
              >
                {isAllExpanded ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                모두 {isAllExpanded ? "접기" : "펼치기"}
              </Button>
            </div>

            <div className="space-y-1">
              {filteredOrgStructure.map((org, index) => (
                <OrgTreeItem key={index} org={org} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSave={handleAddMemberSave}
        onBack={() => {
          setShowAddMemberModal(false);
          setShowSettingsModal(true);
        }}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onAddMember={() => {
          setShowSettingsModal(false);
          setShowAddMemberModal(true);
        }}
      />
    </MainLayout>
  );
}