"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  joinDate: string
  organization: string
  position: string
  role: string
  job: string
  rank?: string
  isAdmin: boolean
  teams: string[]
  profileImage?: string
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
  onUpdate?: (updatedEmployee: Employee) => void
  onDelete?: (employeeId: string) => void
}

export default function EditModal({ isOpen, onClose, employee, onUpdate, onDelete }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    organization: '',
    position: '',
    job: ''
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || '',
        address: employee.address || '',
        organization: employee.organization,
        position: employee.position,
        job: employee.job
      })
    }
  }, [employee])

  const handleSave = () => {
    if (!employee) return

    const updatedEmployee = {
      ...employee,
      ...formData
    }

    onUpdate?.(updatedEmployee)
    toast.success('직원 정보가 성공적으로 업데이트되었습니다.')
    onClose()
  }

  const handleDelete = () => {
    if (!employee) return

    if (confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      onDelete?.(employee.id)
      toast.success('직원이 성공적으로 삭제되었습니다.')
      onClose()
    }
  }

  if (!employee) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>직원 정보 편집</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="organization">조직</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="position">직책</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="job">업무</Label>
            <Input
              id="job"
              value={formData.job}
              onChange={(e) => setFormData({...formData, job: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
