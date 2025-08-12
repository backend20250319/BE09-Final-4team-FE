"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './date-input.module.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SimpleDropdown from "./SimpleDropdown";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Crown, 
  Shield,
  Copy,
  RefreshCw,
  ArrowLeft,
  Save,
  X,
  Clock,
  ChevronDown,
  Check
} from "lucide-react";
import { toast } from 'sonner';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: any) => void;
  onBack?: () => void;
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  joinDate: '',
  organizations: [] as string[],
  position: '',
  role: '',
  job: '',
  rank: '',
  tempPassword: '',
  isAdmin: false,
  workPolicies: [] as string[]
};

const organizations = [
  '개발팀', '디자인팀', '마케팅팀', '인사팀', '기획팀', '영업팀'
];

// 직위 목록 (예시)
const positions = [
  'CEO', 'COO', 'CTO', 'CPO', 'CMO', 'VP', 'Director', 'Head', 'Manager'
];

const roles = [
  '프론트엔드 개발', '백엔드 개발', 'UI/UX 디자인', '디지털 마케팅', 
  '제품 기획', '영업 관리', '인사 관리', '시스템 관리'
];

const jobs = [
  '프론트엔드 개발', '백엔드 개발', 'UI/UX 디자인', '디지털 마케팅', 
  '제품 기획', '영업 관리', '인사 관리', '시스템 관리'
];

const ranks = [
  '사원', '대리', '과장', '차장', '부장', '팀장', '이사', '대표'
];

const workPolicies = [
  { id: 'fixed-9to6', label: '9-6 고정근무', description: '오전 9시 ~ 오후 6시 고정 근무' },
  { id: 'flexible', label: '유연근무', description: '코어타임 내 자유로운 출퇴근' },
  { id: 'autonomous', label: '자율근무', description: '업무 성과 기반 자율 근무' },
  { id: 'remote', label: '재택근무', description: '원격 근무 가능' },
  { id: 'hybrid', label: '하이브리드', description: '사무실 + 재택 혼합 근무' }
];

export default function AddMemberModal({ isOpen, onClose, onSave, onBack }: AddMemberModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const joinDateRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [workPolicyDropdownOpen, setWorkPolicyDropdownOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [organizationDropdownOpen, setOrganizationDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialFormData });
      setErrors({});
      setValidFields({});
      setTouched({});
      setSubmitted(false);
      setShowSaveConfirm(false);
      setShowBackConfirm(false);
      setWorkPolicyDropdownOpen(false);
      setOrganizationDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (workPolicyDropdownOpen && !target.closest('.work-policy-dropdown')) {
        setWorkPolicyDropdownOpen(false);
      }
      
      if (organizationDropdownOpen && !target.closest('.organization-dropdown')) {
        setOrganizationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [workPolicyDropdownOpen, organizationDropdownOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (typeof value === 'string') setValidFields(prev => ({ ...prev, [field]: value.trim().length > 0 }));
  };

  const handleWorkPolicyToggle = (policyId: string) => {
    setFormData(prev => {
      const currentPolicies = prev.workPolicies || [];
      const currentSelected = currentPolicies[0] ?? null;
      const newPolicies = currentSelected === policyId ? [] : [policyId];

      setTimeout(() => {
        validateField('workPolicies', newPolicies);
      }, 0);

      return {
        ...prev,
        workPolicies: newPolicies
      };
    });
    setWorkPolicyDropdownOpen(false);
  };

  const handleOrganizationToggle = (orgName: string) => {
    setFormData(prev => {
      const currentOrgs = prev.organizations || [];
      const isSelected = currentOrgs.includes(orgName);
      
      let newOrgs;
      if (isSelected) {
        newOrgs = currentOrgs.filter(org => org !== orgName);
      } else {
        newOrgs = [...currentOrgs, orgName];
      }
      
      setTimeout(() => {
        validateField('organizations', '');
      }, 0);
      
      return {
        ...prev,
        organizations: newOrgs
      };
    });
  };

  const validateField = (field: string, value: string | string[]) => {
    let isValid = false;
    let errorMessage = '';

    switch (field) {
      case 'name':
        isValid = typeof value === 'string' && value.trim().length >= 2;
        errorMessage = isValid ? '' : '이름을 2자 이상 입력해주세요.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = typeof value === 'string' && emailRegex.test(value);
        errorMessage = isValid ? '' : '올바른 이메일 형식을 입력해주세요.';
        break;
      case 'organizations':
        isValid = Array.isArray(formData.organizations) && formData.organizations.length > 0;
        errorMessage = isValid ? '' : '최소 1개 이상의 조직을 선택해주세요.';
        break;
      case 'position':
      case 'rank':
      case 'role':
      case 'job':
        isValid = true;
        errorMessage = '';
        break;
      case 'joinDate':
        isValid = typeof value === 'string' && value.trim().length > 0;
        errorMessage = isValid ? '' : '입사일을 선택해주세요.';
        break;
      case 'workPolicies': {
        const selected = Array.isArray(value) ? value : formData.workPolicies;
        isValid = Array.isArray(selected) && selected.length > 0;
        errorMessage = isValid ? '' : '필수 입력 항목입니다.';
        break;
      }
      default:
        isValid = true;
        errorMessage = '';
    }

    setValidFields(prev => ({ ...prev, [field]: isValid }));
    if (field === 'workPolicies') {
      if (isValid) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      } else if (submitted) {
        setErrors(prev => ({ ...prev, [field]: errorMessage }));
      }
    } else {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
    
    return isValid;
  };

  const handleFieldBlur = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (submitted) {
      validateField(field, value);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, tempPassword: password }));
    toast.success('임시 비밀번호가 생성되었습니다.');
  };

  const copyPassword = () => {
    if (formData.tempPassword) {
      navigator.clipboard.writeText(formData.tempPassword);
      toast.success('비밀번호가 클립보드에 복사되었습니다.');
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'organizations', 'joinDate'];
    let isValid = true;
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      if (!validateField(field, value)) {
        isValid = false;
        if (submitted) newErrors[field] = '필수 항목입니다.';
      }
    });

    if (!formData.workPolicies || formData.workPolicies.length === 0) {
      isValid = false;
      if (submitted) newErrors['workPolicies'] = '필수 입력 항목입니다.';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    setSubmitted(true);
    if (validateForm()) {
      setShowSaveConfirm(true);
    } else {
      toast.error('필수 항목을 모두 입력해주세요.');
    }
  };

  const hasData = () => {
    const { name, email, joinDate, organizations, isAdmin, workPolicies, ...rest } = formData as any
    const textChanged = [name, email, joinDate].some((v) => typeof v === 'string' && v.trim() !== '')
    const orgChanged = Array.isArray(organizations) && organizations.length > 0
    const policiesChanged = Array.isArray(workPolicies) && workPolicies.length > 0
    const othersChanged = Object.values(rest).some((v) => typeof v === 'string' && v.trim() !== '')
    return textChanged || orgChanged || policiesChanged || othersChanged
  };

  const [initialSnapshot] = useState(JSON.stringify(initialFormData))
  const handleClose = () => {
    const currentSnapshot = JSON.stringify(formData)
    if (currentSnapshot !== initialSnapshot && hasData()) {
      setShowBackConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSaveConfirm = () => {
    onSave(formData);
    setShowSaveConfirm(false);
  };

  const handleSaveCancel = () => {
    setShowSaveConfirm(false);
  };

  const handleBackConfirm = () => {
    onClose();
    setShowBackConfirm(false);
  };

  const handleBackCancel = () => {
    setShowBackConfirm(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[75vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              구성원 추가
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  기본 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={(e) => handleFieldBlur('name', e.target.value)}
                      placeholder="이름을 입력하세요"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {touched.name && errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => handleFieldBlur('email', e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {touched.email && errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="전화번호를 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">주소</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="주소를 입력하세요"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  조직 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>조직 *</Label>
                    <div className="relative organization-dropdown">
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between ${errors.organizations ? 'border-red-500' : ''}`}
                        onClick={() => setOrganizationDropdownOpen(!organizationDropdownOpen)}
                      >
                        <div className="flex items-center gap-2">
                          {formData.organizations?.length > 0 
                            ? `${formData.organizations.length}개 조직 선택됨`
                            : '조직을 선택하세요'
                          }
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      
                      {organizationDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                          {organizations.map((org) => (
                            <div
                              key={org}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleOrganizationToggle(org)}
                            >
                              <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                                {formData.organizations?.includes(org) && (
                                  <Check className="w-3 h-3 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{org}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                                         {formData.organizations?.length > 0 && (
                       <div className="flex flex-wrap gap-2 mt-2">
                         {formData.organizations.map((org) => (
                           <Badge 
                             key={org} 
                             variant="secondary" 
                             className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
                             onClick={() => handleOrganizationToggle(org)}
                           >
                             {org}
                             <X 
                               className="w-3 h-3 hover:text-red-500" 
                             />
                           </Badge>
                         ))}
                       </div>
                     )}
                    
                    {touched.organizations && errors.organizations && <p className="text-sm text-red-500">{errors.organizations}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rank">직급</Label>
                    <SimpleDropdown
                      options={ranks}
                      value={formData.rank}
                      onChange={(value) => handleInputChange('rank', value)}
                      placeholder="선택(선택사항)"
                      triggerClassName={errors.rank ? 'border-red-500' : ''}
                    />
                    {errors.rank && <p className="text-sm text-red-500">{errors.rank}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">직위</Label>
                    <SimpleDropdown
                      options={positions}
                      value={formData.position}
                      onChange={(value) => handleInputChange('position', value)}
                      placeholder="선택(선택사항)"
                      triggerClassName={errors.position ? 'border-red-500' : ''}
                    />
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">직무</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="직무를 입력하세요"
                      className={errors.role ? 'border-red-500' : ''}
                    />
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job">직책</Label>
                    <SimpleDropdown
                      options={jobs}
                      value={formData.job}
                      onChange={(value) => handleInputChange('job', value)}
                      placeholder="선택(선택사항)"
                      triggerClassName={errors.job ? 'border-red-500' : ''}
                    />
                    {errors.job && <p className="text-sm text-red-500">{errors.job}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  계정 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">입사일 *</Label>
                    <div
                      className="relative"
                      onPointerDown={() => {
                        const input = joinDateRef.current
                        if (!input) return
                        input.focus()
                        try {
                          input.showPicker?.()
                        } catch {}
                        // Fallback for browsers requiring a native click
                        input.click()
                      }}
                    >
                      <Input
                        id="joinDate"
                        ref={joinDateRef}
                        type="date"
                        placeholder="연도-월-일"
                        value={formData.joinDate}
                        onChange={(e) => handleInputChange('joinDate', e.target.value)}
                        onBlur={(e) => handleFieldBlur('joinDate', e.target.value)}
                        className={`${errors.joinDate ? 'border-red-500' : ''} cursor-pointer ${styles.dateInput}`}
                      />
                      <button
                        type="button"
                        aria-label="달력 열기"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        // Let the wrapper handle opening via event bubbling
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                    {touched.joinDate && errors.joinDate && <p className="text-sm text-red-500">{errors.joinDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>관리자 권한</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isAdmin}
                        onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">관리자 권한 부여</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>근무 정책 *</Label>
                    <div className="relative work-policy-dropdown">
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between ${errors.workPolicies ? 'border-red-500' : ''}`}
                        onClick={() => setWorkPolicyDropdownOpen(!workPolicyDropdownOpen)}
                      >
                        <div className="flex items-center gap-2">
                          {formData.workPolicies?.length > 0 
                            ? (workPolicies.find(p => p.id === formData.workPolicies[0])?.label ?? '근무 정책을 선택하세요')
                            : '근무 정책을 선택하세요'
                          }
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      
                        {workPolicyDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {workPolicies.map((policy) => (
                              <div
                                key={policy.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleWorkPolicyToggle(policy.id)}
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{policy.label}</div>
                                  <div className="text-sm text-gray-500">{policy.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    
                    
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>임시 비밀번호</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.tempPassword}
                      onChange={(e) => handleInputChange('tempPassword', e.target.value)}
                      placeholder="임시 비밀번호를 생성하세요"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generatePassword}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPassword}
                      disabled={!formData.tempPassword}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    임시 비밀번호는 구성원이 최초 로그인 시 변경해야 합니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-2 pt-6 border-t">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구성원 추가</DialogTitle>
          </DialogHeader>
          <p>입력한 정보로 구성원을 추가하시겠습니까?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleSaveCancel}>
              취소
            </Button>
            <Button onClick={handleSaveConfirm}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBackConfirm} onOpenChange={setShowBackConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>변경사항 저장</DialogTitle>
          </DialogHeader>
          <p>입력한 정보가 저장되지 않습니다. 정말 나가시겠습니까?</p>
           <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleBackCancel}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleBackConfirm}>
              나가기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 