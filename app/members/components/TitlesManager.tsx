"use client"

import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from 'lucide-react'

type TitleKind = 'rank' | 'position' | 'duty' | 'job'

interface TitlesState {
  rank: string[]
  position: string[]
  duty: string[]
  job: string[]
}

const initialData: Omit<TitlesState, 'setAll' | 'add' | 'update' | 'remove'> = {
  rank: ['사원', '대리', '과장', '차장', '부장', '팀장', '이사', '대표'],
  position: ['CEO', 'COO', 'CTO', 'CPO', 'CMO', 'VP', 'Director', 'Head', 'Manager'],
  duty: ['본부장', '팀장', '팀원', '인턴'],
  job: ['프론트엔드', '백엔드', '모바일', 'UI/UX', '데브옵스', '데이터']
}

function useTitlesLocal(type: TitleKind) {
  const [state, setState] = useState<TitlesState>(initialData)
  const add = (kind: TitleKind, name: string) => {
    setState(prev => ({ ...prev, [kind]: [...prev[kind as keyof TitlesState] as string[], name] }))
  }
  const update = (kind: TitleKind, index: number, name: string) => {
    setState(prev => {
      const next = [...(prev[kind as keyof TitlesState] as string[])]
      next[index] = name
      return { ...prev, [kind]: next }
    })
  }
  const remove = (kind: TitleKind, index: number) => {
    setState(prev => {
      const next = (prev[kind as keyof TitlesState] as string[]).filter((_, i) => i !== index)
      return { ...prev, [kind]: next }
    })
  }
  return { state, add, update, remove }
}

interface TitlesManagerProps {
  isOpen: boolean
  onClose: () => void
  type: TitleKind
}

export default function TitlesManager({ isOpen, onClose, type }: TitlesManagerProps) {
  const { state, add, update, remove } = useTitlesLocal(type)
  const { rank, position, duty, job } = state
  const [showAddModal, setShowAddModal] = useState(false)
  const [addingText, setAddingText] = useState('')
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null)

  const titleMap: Record<TitleKind, { title: string; list: string[] }> = useMemo(() => ({
    rank: { title: '직급 설정', list: rank },
    position: { title: '직위 설정', list: position },
    duty: { title: '직무 설정', list: duty },
    job: { title: '직책 설정', list: job }
  }), [rank, position, duty, job])

  const current = titleMap[type]

  const handleAdd = () => {
    const name = addingText.trim()
    if (!name) return
    add(type, name)
    setAddingText('')
    setShowAddModal(false)
  }

  const handleSave = () => {
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{current.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              {current.list.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => update(type, idx, e.target.value)}
                    className="border-blue-300 focus-visible:ring-blue-400"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => setConfirmIndex(idx)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full justify-center text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> 새 항목 추가
            </Button>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClose}>뒤로가기</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">저장하기</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {current.title.replace('설정', '추가')}
            </DialogTitle>
            <DialogDescription>새 항목을 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">이름</label>
              <Input value={addingText} onChange={(e) => setAddingText(e.target.value)} placeholder="항목을 입력하세요" />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>뒤로가기</Button>
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">저장하기</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmIndex !== null} onOpenChange={() => setConfirmIndex(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>삭제하시겠습니까?</DialogTitle>
            <DialogDescription>이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmIndex(null)}>취소</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmIndex !== null) remove(type, confirmIndex)
                setConfirmIndex(null)
              }}
              
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


