"use client"

// Dialog / AlertDialog 대화상자 데모 컴포넌트
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogDemo() {
  const [name, setName] = useState("")
  const [saved, setSaved] = useState("")

  function handleSave() {
    setSaved(name)
    setName("")
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* 기본 Dialog — 입력 폼 포함 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">프로필 편집</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>프로필 편집</DialogTitle>
            <DialogDescription>
              이름을 입력하고 저장 버튼을 누르세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog — 확인/취소 선택 대화상자 */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">계정 삭제</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 저장 결과 표시 */}
      {saved && (
        <p className="self-center text-sm text-muted-foreground">
          저장된 이름: <strong>{saved}</strong>
        </p>
      )}
    </div>
  )
}
