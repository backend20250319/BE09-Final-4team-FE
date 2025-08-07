"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { toast } from 'sonner'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  onBack?: () => void
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
}

const AddMemberModal = ({ isOpen, onClose, onSave, onBack }: AddMemberModalProps) => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validFields, setValidFields] = useState<Record<string, boolean>>({})
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [showBackConfirm, setShowBackConfirm] = useState(false)

  // 모달이 열릴 때마다 폼 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialFormData })
      setErrors({})
      setValidFields({})
      setShowSaveConfirm(false)
      setShowBackConfirm(false)
    } else {
      setFormData({ ...initialFormData })
      setErrors({})
      setValidFields({})
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 필드가 비어있으면 오류와 유효성 상태를 초기화 (placeholder만 표시)
    if (!value || value.toString().trim() === '') {
      setErrors(prev => ({ ...prev, [field]: '' }))
      setValidFields(prev => ({ ...prev, [field]: false }))
      return
    }
    
    // 입력 시 기존 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // joinDate 필드의 경우 값이 있으면 즉시 유효 상태로 설정
    if (field === 'joinDate' && value && value !== '') {
      setValidFields(prev => ({ ...prev, [field]: true }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateField = (field: string, value: any) => {
    let isValid = false
    let errorMessage = ''

    switch (field) {
      case 'name':
        isValid = value.toString().trim().length >= 2
        errorMessage = isValid ? '' : '이름을 2자 이상 입력해주세요.'
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        isValid = emailRegex.test(value)
        errorMessage = isValid ? '' : '올바른 이메일 형식을 입력해주세요.'
        break
      case 'organization':
        isValid = value.toString().trim().length > 0
        errorMessage = isValid ? '' : '조직을 선택해주세요.'
        break
      case 'position':
        isValid = value.toString().trim().length > 0
        errorMessage = isValid ? '' : '직급을 선택해주세요.'
        break
      case 'role':
        isValid = value.toString().trim().length > 0
        errorMessage = isValid ? '' : '역할을 선택해주세요.'
        break
      case 'job':
        isValid = value.toString().trim().length > 0
        errorMessage = isValid ? '' : '업무를 선택해주세요.'
        break
      case 'joinDate':
        isValid = value !== '' && value != null
        errorMessage = isValid ? '' : '입사일을 선택해주세요.'
        break
      case 'tempPassword':
        isValid = value.length >= 8
        errorMessage = isValid ? '' : '임시 비밀번호는 8자 이상이어야 합니다.'
        break
      default:
        isValid = true
    }

    return { isValid, errorMessage }
  }

  const handleFieldBlur = (field: string, value: any) => {
    // 필드가 비어있으면 오류를 표시하지 않음 (placeholder만 표시)
    if (!value || value.toString().trim() === '') {
      setErrors(prev => ({ ...prev, [field]: '' }))
      setValidFields(prev => ({ ...prev, [field]: false }))
      return
    }
    
    const { isValid, errorMessage } = validateField(field, value)
    
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }))
      setValidFields(prev => ({ ...prev, [field]: false }))
    } else if (isValid) {
      setValidFields(prev => ({ ...prev, [field]: true }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, tempPassword: password }))
    setValidFields(prev => ({ ...prev, tempPassword: true }))
    setErrors(prev => ({ ...prev, tempPassword: '' }))
  }

  const copyPassword = () => {
    if (formData.tempPassword) {
      navigator.clipboard.writeText(formData.tempPassword)
      toast.success('비밀번호가 클립보드에 복사되었습니다.')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.'
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.'
    if (!formData.joinDate || formData.joinDate === '') newErrors.joinDate = '입사일을 선택해주세요.'
    if (!formData.organization) newErrors.organization = '조직을 선택해주세요.'
    if (!formData.position) newErrors.position = '직급을 선택해주세요.'
    if (!formData.role) newErrors.role = '역할을 선택해주세요.'
    if (!formData.job) newErrors.job = '업무를 선택해주세요.'
    if (!formData.tempPassword) newErrors.tempPassword = '임시 비밀번호를 생성해주세요.'

    // 개별 필드 유효성 검사
    Object.keys(formData).forEach(field => {
      if (formData[field as keyof typeof formData] && field !== 'isAdmin') {
        const { errorMessage } = validateField(field, formData[field as keyof typeof formData])
        if (errorMessage) {
          newErrors[field] = errorMessage
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      setShowSaveConfirm(true)
    }
  }

  const hasData = () => {
    return Object.keys(formData).some(key => {
      if (key === 'isAdmin') return formData[key as keyof typeof formData] !== false
      if (key === 'joinDate') return formData[key as keyof typeof formData] !== ''
      return formData[key as keyof typeof formData].toString().trim() !== ''
    })
  }

  const handleClose = () => {
    if (hasData()) {
      setShowBackConfirm(true)
    } else {
      onClose()
    }
  }

  const handleSaveConfirm = () => {
    onSave(formData)
    setShowSaveConfirm(false)
  }

  const handleSaveCancel = () => {
    setShowSaveConfirm(false)
  }

  const handleBackConfirm = () => {
    onClose()
    setShowBackConfirm(false)
  }

  const handleBackCancel = () => {
    setShowBackConfirm(false)
  }

  const getInputClassName = (field: string) => {
    let baseClass = "h-11 px-3 text-sm text-gray-900 bg-white border-2 border-blue-200 rounded-lg transition-colors duration-150 flex items-center box-border hover:border-blue-300 focus:outline-none focus:border-blue-500"
    if (errors[field]) {
      return `${baseClass} border-red-500`
    }
    if (validFields[field]) {
      return `${baseClass} border-green-500 focus:border-blue-500`
    }
    return baseClass
  }

  const getSelectClassName = (field: string) => {
    let baseClass = "h-11 px-3 pr-9 text-sm text-gray-900 bg-white border-2 border-blue-200 rounded-lg transition-colors duration-150 flex items-center box-border hover:border-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer"
    if (errors[field]) {
      return `${baseClass} border-red-500`
    }
    if (validFields[field]) {
      return `${baseClass} border-green-500 focus:border-blue-500`
    }
    return baseClass
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
        <div className="bg-white rounded-2xl w-[90%] max-w-[700px] max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 pb-4 border-b border-gray-200 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 m-0">구성원 추가</h2>
              <p className="text-sm text-gray-500 mt-1 mb-0">새로운 구성원 정보를 입력하세요</p>
            </div>
            <button 
              className="bg-none border-none text-gray-500 cursor-pointer p-2 rounded-lg transition-all duration-200 text-2xl leading-none min-w-10 min-h-10 flex items-center justify-center flex-shrink-0 hover:bg-gray-100 hover:text-gray-700 hover:scale-105 active:scale-95 active:bg-gray-200"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          <div className="p-6 pr-4 max-h-[calc(90vh-180px)] overflow-y-auto mr-1.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  이름<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  className={getInputClassName('name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name', formData.name)}
                  placeholder="이름을 입력하세요"
                />
                {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  이메일<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  className={getInputClassName('email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email', formData.email)}
                  placeholder="이메일을 입력하세요"
                />
                {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700">전화번호</Label>
                <Input
                  type="tel"
                  className={getInputClassName('phone')}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone', formData.phone)}
                  placeholder="전화번호를 입력하세요"
                />
                {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700">주소</Label>
                <Input
                  type="text"
                  className={getInputClassName('address')}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleFieldBlur('address', formData.address)}
                  placeholder="주소를 입력하세요"
                />
                {errors.address && <div className="text-xs text-red-500 mt-1">{errors.address}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  입사일<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  className={getInputClassName('joinDate')}
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  onBlur={() => handleFieldBlur('joinDate', formData.joinDate)}
                />
                {errors.joinDate && <div className="text-xs text-red-500 mt-1">{errors.joinDate}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  조직<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.organization} onValueChange={(value) => handleInputChange('organization', value)}>
                  <SelectTrigger className={getSelectClassName('organization')}>
                    <SelectValue placeholder="조직을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="개발팀">개발팀</SelectItem>
                    <SelectItem value="인사팀">인사팀</SelectItem>
                    <SelectItem value="경영팀">경영팀</SelectItem>
                    <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                    <SelectItem value="영업팀">영업팀</SelectItem>
                  </SelectContent>
                </Select>
                {errors.organization && <div className="text-xs text-red-500 mt-1">{errors.organization}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  직급<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger className={getSelectClassName('position')}>
                    <SelectValue placeholder="직급을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사장">사장</SelectItem>
                    <SelectItem value="부사장">부사장</SelectItem>
                    <SelectItem value="이사">이사</SelectItem>
                    <SelectItem value="부장">부장</SelectItem>
                    <SelectItem value="차장">차장</SelectItem>
                    <SelectItem value="과장">과장</SelectItem>
                    <SelectItem value="대리">대리</SelectItem>
                    <SelectItem value="주임">주임</SelectItem>
                    <SelectItem value="사원">사원</SelectItem>
                  </SelectContent>
                </Select>
                {errors.position && <div className="text-xs text-red-500 mt-1">{errors.position}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  역할<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className={getSelectClassName('role')}>
                    <SelectValue placeholder="역할을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="본부장">본부장</SelectItem>
                    <SelectItem value="팀장">팀장</SelectItem>
                    <SelectItem value="팀원">팀원</SelectItem>
                    <SelectItem value="인턴">인턴</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <div className="text-xs text-red-500 mt-1">{errors.role}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  업무<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.job} onValueChange={(value) => handleInputChange('job', value)}>
                  <SelectTrigger className={getSelectClassName('job')}>
                    <SelectValue placeholder="업무를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사업 기획">사업 기획</SelectItem>
                    <SelectItem value="프론트엔드 개발">프론트엔드 개발</SelectItem>
                    <SelectItem value="백엔드 개발">백엔드 개발</SelectItem>
                    <SelectItem value="인사 관리">인사 관리</SelectItem>
                    <SelectItem value="마케팅">마케팅</SelectItem>
                    <SelectItem value="영업">영업</SelectItem>
                    <SelectItem value="디자인">디자인</SelectItem>
                  </SelectContent>
                </Select>
                {errors.job && <div className="text-xs text-red-500 mt-1">{errors.job}</div>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700">등급</Label>
                <Select value={formData.rank} onValueChange={(value) => handleInputChange('rank', value)}>
                  <SelectTrigger className={getSelectClassName('rank')}>
                    <SelectValue placeholder="등급을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1급">1급</SelectItem>
                    <SelectItem value="2급">2급</SelectItem>
                    <SelectItem value="3급">3급</SelectItem>
                    <SelectItem value="4급">4급</SelectItem>
                    <SelectItem value="5급">5급</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rank && <div className="text-xs text-red-500 mt-1">{errors.rank}</div>}
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  임시 비밀번호<span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 items-end">
                  <Input
                    type="text"
                    className={`${getInputClassName('tempPassword')} flex-1`}
                    value={formData.tempPassword}
                    onChange={(e) => handleInputChange('tempPassword', e.target.value)}
                    onBlur={() => handleFieldBlur('tempPassword', formData.tempPassword)}
                    placeholder="생성하기 버튼을 클릭하세요"
                    readOnly
                  />
                  <Button 
                    type="button" 
                    className="h-11 px-4 font-medium rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center box-border bg-blue-600 text-white border-none hover:bg-blue-700"
                    onClick={generatePassword}
                  >
                    생성하기
                  </Button>
                  <Button 
                    type="button" 
                    className="h-11 px-4 font-medium rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center box-border bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={copyPassword}
                    disabled={!formData.tempPassword}
                  >
                    복사
                  </Button>
                </div>
                {errors.tempPassword && <div className="text-xs text-red-500 mt-1">{errors.tempPassword}</div>}
              </div>

              {/* 관리자 권한 토글 */}
              <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 my-3">
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-gray-700 mb-1">관리자 권한</div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      관리자 권한을 부여하면 시스템의 모든 기능에 접근할 수 있습니다.
                    </div>
                  </div>
                  <div className="ml-3">
                    <Switch
                      checked={formData.isAdmin}
                      onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 pt-4 pb-6 border-t border-gray-200 flex gap-3 justify-end">
            <Button 
              className="h-12 px-6 font-medium rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center box-border bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button 
              className="h-12 px-6 font-medium rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center box-border bg-blue-600 text-white border-none hover:bg-blue-700"
              onClick={handleSave}
            >
              저장
            </Button>
          </div>
        </div>
      </div>

      {/* 저장 확인 모달 */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">구성원 저장</h3>
            <p className="text-gray-600 mb-6">입력한 구성원 정보를 저장하시겠습니까?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleSaveCancel}>취소</Button>
              <Button onClick={handleSaveConfirm}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* 뒤로가기 확인 모달 */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">작업 취소</h3>
            <p className="text-gray-600 mb-6">입력한 내용이 저장되지 않습니다. 정말 취소하시겠습니까?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleBackCancel}>계속 작업</Button>
              <Button variant="destructive" onClick={handleBackConfirm}>취소</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddMemberModal
