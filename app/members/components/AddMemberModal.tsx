"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  X
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
  organization: '',
  position: '',
  role: '',
  job: '',
  rank: '',
  tempPassword: '',
  isAdmin: false
};

const organizations = [
  '개발팀', '디자인팀', '마케팅팀', '인사팀', '기획팀', '영업팀'
];

const positions = [
  '사원', '대리', '과장', '차장', '부장', '팀장', '이사', '대표'
];

const roles = [
  '개발자', '디자이너', '마케터', '기획자', '영업원', '인사담당자', '관리자'
];

const jobs = [
  '프론트엔드 개발', '백엔드 개발', 'UI/UX 디자인', '디지털 마케팅', 
  '제품 기획', '영업 관리', '인사 관리', '시스템 관리'
];

const ranks = [
  '사원', '대리', '과장', '차장', '부장', '팀장', '이사', '대표'
];

export default function AddMemberModal({ isOpen, onClose, onSave, onBack }: AddMemberModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialFormData });
      setErrors({});
      setValidFields({});
      setShowSaveConfirm(false);
      setShowBackConfirm(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (typeof value === 'string' && (!value || value.trim() === '')) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      setValidFields(prev => ({ ...prev, [field]: false }));
      return;
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'joinDate' && typeof value === 'string' && value && value !== '') {
      setValidFields(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: string, value: string) => {
    let isValid = false;
    let errorMessage = '';

    switch (field) {
      case 'name':
        isValid = value.trim().length >= 2;
        errorMessage = isValid ? '' : '이름을 2자 이상 입력해주세요.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        errorMessage = isValid ? '' : '올바른 이메일 형식을 입력해주세요.';
        break;
      case 'organization':
        isValid = value.trim().length > 0;
        errorMessage = isValid ? '' : '조직을 선택해주세요.';
        break;
      case 'position':
        isValid = value.trim().length > 0;
        errorMessage = isValid ? '' : '직급을 선택해주세요.';
        break;
      case 'role':
        isValid = value.trim().length > 0;
        errorMessage = isValid ? '' : '역할을 선택해주세요.';
        break;
      case 'job':
        isValid = value.trim().length > 0;
        errorMessage = isValid ? '' : '업무를 선택해주세요.';
        break;
      case 'joinDate':
        isValid = value.trim().length > 0;
        errorMessage = isValid ? '' : '입사일을 선택해주세요.';
        break;
      default:
        isValid = true;
        errorMessage = '';
    }

    setValidFields(prev => ({ ...prev, [field]: isValid }));
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    
    return isValid;
  };

  const handleFieldBlur = (field: string, value: string) => {
    validateField(field, value);
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
    const requiredFields = ['name', 'email', 'organization', 'position', 'role', 'job', 'joinDate'];
    let isValid = true;
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      if (!validateField(field, value)) {
        isValid = false;
        newErrors[field] = errors[field] || '필수 항목입니다.';
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      setShowSaveConfirm(true);
    } else {
      toast.error('필수 항목을 모두 입력해주세요.');
    }
  };

  const hasData = () => {
    return Object.values(formData).some(value => 
      typeof value === 'string' ? value.trim() !== '' : value !== false
    );
  };

  const handleClose = () => {
    if (hasData()) {
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              구성원 추가
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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

            {/* 조직 정보 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  조직 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">조직 *</Label>
                    <Select value={formData.organization} onValueChange={(value) => handleInputChange('organization', value)}>
                      <SelectTrigger className={errors.organization ? 'border-red-500' : ''}>
                        <SelectValue placeholder="조직을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org} value={org}>{org}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organization && <p className="text-sm text-red-500">{errors.organization}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">직급 *</Label>
                    <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                      <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
                        <SelectValue placeholder="직급을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">역할 *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="역할을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job">업무 *</Label>
                    <Select value={formData.job} onValueChange={(value) => handleInputChange('job', value)}>
                      <SelectTrigger className={errors.job ? 'border-red-500' : ''}>
                        <SelectValue placeholder="업무를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job} value={job}>{job}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.job && <p className="text-sm text-red-500">{errors.job}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 계정 정보 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  계정 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">입사일 *</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => handleInputChange('joinDate', e.target.value)}
                      onBlur={(e) => handleFieldBlur('joinDate', e.target.value)}
                      className={errors.joinDate ? 'border-red-500' : ''}
                    />
                    {errors.joinDate && <p className="text-sm text-red-500">{errors.joinDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>관리자 권한</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isAdmin}
                        onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
                      />
                      <span className="text-sm text-gray-600">관리자 권한 부여</span>
                    </div>
                  </div>
                </div>

                {/* 임시 비밀번호 */}
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

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
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
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 저장 확인 모달 */}
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

      {/* 뒤로가기 확인 모달 */}
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