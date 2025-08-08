"use client";

import { useState, useEffect } from 'react';
import styles from './AddMemberModal.module.css';
import CustomDatePicker from './CustomDatePicker';
import ConfirmModal from './ConfirmModal';

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

const AddMemberModal = ({ isOpen, onClose, onSave, onBack }) => {

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // 모달이 열릴 때마다 폼 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      // 폼 데이터 초기화
      setFormData({ ...initialFormData });
      setErrors({});
      setValidFields({});
      setShowSaveConfirm(false);
      setShowBackConfirm(false);
    } else {
      // 모달이 닫힐 때도 추가 초기화 (다음 열기를 위해)
      setFormData({ ...initialFormData });
      setErrors({});
      setValidFields({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 필드가 비어있으면 오류와 유효성 상태를 초기화 (placeholder만 표시)
    if (!value || value.trim() === '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
      setValidFields(prev => ({ ...prev, [field]: false }));
      return;
    }
    
    // 입력 시 기존 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // joinDate 필드의 경우 값이 있으면 즉시 유효 상태로 설정
    if (field === 'joinDate' && value && value !== '') {
      setValidFields(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field, value) => {
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
        isValid = value !== '' && value != null;
        errorMessage = isValid ? '' : '입사일을 선택해주세요.';
        break;
      case 'tempPassword':
        isValid = value.length >= 8;
        errorMessage = isValid ? '' : '임시 비밀번호는 8자 이상이어야 합니다.';
        break;
      default:
        isValid = true;
    }

    return { isValid, errorMessage };
  };

  const handleFieldBlur = (field, value) => {
    // 필드가 비어있으면 오류를 표시하지 않음 (placeholder만 표시)
    if (!value || value.trim() === '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
      setValidFields(prev => ({ ...prev, [field]: false }));
      return;
    }
    
    const { isValid, errorMessage } = validateField(field, value);
    
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      setValidFields(prev => ({ ...prev, [field]: false }));
    } else if (isValid) {
      setValidFields(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, tempPassword: password }));
    setValidFields(prev => ({ ...prev, tempPassword: true }));
    setErrors(prev => ({ ...prev, tempPassword: '' }));
  };

  const copyPassword = () => {
    if (formData.tempPassword) {
      navigator.clipboard.writeText(formData.tempPassword);
      alert('비밀번호가 클립보드에 복사되었습니다.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.joinDate || formData.joinDate === '') newErrors.joinDate = '입사일을 선택해주세요.';
    if (!formData.organization) newErrors.organization = '조직을 선택해주세요.';
    if (!formData.position) newErrors.position = '직급을 선택해주세요.';
    if (!formData.role) newErrors.role = '역할을 선택해주세요.';
    if (!formData.job) newErrors.job = '업무를 선택해주세요.';
    if (!formData.tempPassword) newErrors.tempPassword = '임시 비밀번호를 생성해주세요.';

    // 개별 필드 유효성 검사
    Object.keys(formData).forEach(field => {
      if (formData[field] && field !== 'isAdmin') {
        const { errorMessage } = validateField(field, formData[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setShowSaveConfirm(true);
    }
  };

  const hasData = () => {
    return Object.keys(formData).some(key => {
      if (key === 'isAdmin') return formData[key] !== false;
      if (key === 'joinDate') return formData[key] !== '';
      return formData[key].trim() !== '';
    });
  };

  const handleClose = () => {
    if (hasData()) {
      setShowBackConfirm(true);
    } else {
      onBack();
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
    onBack();
    setShowBackConfirm(false);
  };

  const handleBackCancel = () => {
    setShowBackConfirm(false);
  };

  const getInputClassName = (field) => {
    const baseClass = styles.input;
    if (errors[field]) {
      return `${baseClass} ${styles.inputError} error`;
    }
    if (validFields[field]) {
      return `${baseClass} ${styles.inputValid} valid`;
    }
    return baseClass;
  };

  const getSelectClassName = (field) => {
    const baseClass = styles.select;
    if (errors[field]) {
      return `${baseClass} ${styles.selectError}`;
    }
    if (validFields[field]) {
      return `${baseClass} ${styles.selectValid}`;
    }
    return baseClass;
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>구성원 추가</h2>
              <p className={styles.modalSubtitle}>새로운 구성원 정보를 입력하세요</p>
            </div>
            <button className={styles.closeButton} onClick={handleClose}>
              ×
            </button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>이름</label>
                <input
                  type="text"
                  className={getInputClassName('name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name', formData.name)}
                  placeholder="이름을 입력하세요"
                />
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>이메일</label>
                <input
                  type="email"
                  className={getInputClassName('email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email', formData.email)}
                  placeholder="이메일을 입력하세요"
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>전화번호</label>
                <input
                  type="tel"
                  className={getInputClassName('phone')}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone', formData.phone)}
                  placeholder="전화번호를 입력하세요"
                />
                {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>주소</label>
                <input
                  type="text"
                  className={getInputClassName('address')}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleFieldBlur('address', formData.address)}
                  placeholder="주소를 입력하세요"
                />
                {errors.address && <div className={styles.errorText}>{errors.address}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>입사일</label>
                <CustomDatePicker
                  value={formData.joinDate}
                  onChange={(value) => handleInputChange('joinDate', value)}
                  onBlur={(value) => handleFieldBlur('joinDate', value || formData.joinDate)}
                  className={getInputClassName('joinDate')}
                  placeholder="날짜를 선택하세요"
                />
                {errors.joinDate && <div className={styles.errorText}>{errors.joinDate}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>조직</label>
                <select
                  className={getSelectClassName('organization')}
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  onBlur={() => handleFieldBlur('organization', formData.organization)}
                >
                  <option value="">조직을 선택하세요</option>
                  <option value="개발팀">개발팀</option>
                  <option value="인사팀">인사팀</option>
                  <option value="경영팀">경영팀</option>
                  <option value="마케팅팀">마케팅팀</option>
                  <option value="영업팀">영업팀</option>
                </select>
                {errors.organization && <div className={styles.errorText}>{errors.organization}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>직급</label>
                <select
                  className={getSelectClassName('position')}
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  onBlur={() => handleFieldBlur('position', formData.position)}
                >
                  <option value="">직급을 선택하세요</option>
                  <option value="사장">사장</option>
                  <option value="부사장">부사장</option>
                  <option value="이사">이사</option>
                  <option value="부장">부장</option>
                  <option value="차장">차장</option>
                  <option value="과장">과장</option>
                  <option value="대리">대리</option>
                  <option value="주임">주임</option>
                  <option value="사원">사원</option>
                </select>
                {errors.position && <div className={styles.errorText}>{errors.position}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>역할</label>
                <select
                  className={getSelectClassName('role')}
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  onBlur={() => handleFieldBlur('role', formData.role)}
                >
                  <option value="">역할을 선택하세요</option>
                  <option value="본부장">본부장</option>
                  <option value="팀장">팀장</option>
                  <option value="팀원">팀원</option>
                  <option value="인턴">인턴</option>
                </select>
                {errors.role && <div className={styles.errorText}>{errors.role}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={`${styles.label} ${styles.required}`}>업무</label>
                <select
                  className={getSelectClassName('job')}
                  value={formData.job}
                  onChange={(e) => handleInputChange('job', e.target.value)}
                  onBlur={() => handleFieldBlur('job', formData.job)}
                >
                  <option value="">업무를 선택하세요</option>
                  <option value="사업 기획">사업 기획</option>
                  <option value="프론트엔드 개발">프론트엔드 개발</option>
                  <option value="백엔드 개발">백엔드 개발</option>
                  <option value="인사 관리">인사 관리</option>
                  <option value="마케팅">마케팅</option>
                  <option value="영업">영업</option>
                  <option value="디자인">디자인</option>
                </select>
                {errors.job && <div className={styles.errorText}>{errors.job}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>등급</label>
                <select
                  className={getSelectClassName('rank')}
                  value={formData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                  onBlur={() => handleFieldBlur('rank', formData.rank)}
                >
                  <option value="">등급을 선택하세요</option>
                  <option value="1급">1급</option>
                  <option value="2급">2급</option>
                  <option value="3급">3급</option>
                  <option value="4급">4급</option>
                  <option value="5급">5급</option>
                </select>
                {errors.rank && <div className={styles.errorText}>{errors.rank}</div>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={`${styles.label} ${styles.required}`}>임시 비밀번호</label>
                <div className={styles.passwordGroup}>
                  <input
                    type="text"
                    className={getInputClassName('tempPassword')}
                    value={formData.tempPassword}
                    onChange={(e) => handleInputChange('tempPassword', e.target.value)}
                    onBlur={() => handleFieldBlur('tempPassword', formData.tempPassword)}
                    placeholder="생성하기 버튼을 클릭하세요"
                    readOnly
                  />
                  <button 
                    type="button" 
                    className={styles.passwordButton}
                    onClick={generatePassword}
                  >
                    생성하기
                  </button>
                  <button 
                    type="button" 
                    className={styles.passwordButtonSecondary}
                    onClick={copyPassword}
                    disabled={!formData.tempPassword}
                  >
                    복사
                  </button>
                </div>
                {errors.tempPassword && <div className={styles.errorText}>{errors.tempPassword}</div>}
              </div>

              {/* 관리자 권한 토글 */}
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <div className={styles.toggleTextContainer}>
                    <div className={styles.toggleText}>관리자 권한</div>
                    <div className={styles.toggleDescription}>
                      관리자 권한을 부여하면 시스템의 모든 기능에 접근할 수 있습니다.
                    </div>
                  </div>
                  <div className={styles.toggleSwitchContainer}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={formData.isAdmin}
                      onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button className={styles.backButton} onClick={handleClose}>
              취소
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 저장 확인 모달 */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="구성원 저장"
        message="입력한 구성원 정보를 저장하시겠습니까?"
        confirmText="저장"
        cancelText="취소"
        onConfirm={handleSaveConfirm}
        onCancel={handleSaveCancel}
      />

      {/* 뒤로가기 확인 모달 */}
      <ConfirmModal
        isOpen={showBackConfirm}
        title="작업 취소"
        message="입력한 내용이 저장되지 않습니다. 정말 취소하시겠습니까?"
        confirmText="취소"
        cancelText="계속 작업"
        onConfirm={handleBackConfirm}
        onCancel={handleBackCancel}
      />
    </>
  );
};

export default AddMemberModal;