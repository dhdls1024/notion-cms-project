"use client"

// Switch / Checkbox / RadioGroup / Select 입력 컨트롤 데모
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function InputControlsDemo() {
  // 각 컨트롤의 상태 관리
  const [switchOn, setSwitchOn] = useState(false)
  const [checked, setChecked] = useState(false)
  const [radio, setRadio] = useState("option-1")
  const [selected, setSelected] = useState("")

  return (
    <div className="space-y-8">
      {/* Switch 토글 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Switch</h3>
        <div className="flex items-center gap-3">
          <Switch
            id="switch-demo"
            checked={switchOn}
            onCheckedChange={setSwitchOn}
          />
          <Label htmlFor="switch-demo">
            알림 {switchOn ? "켜짐" : "꺼짐"}
          </Label>
        </div>
      </div>

      {/* Checkbox */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Checkbox</h3>
        <div className="flex items-center gap-3">
          <Checkbox
            id="checkbox-demo"
            checked={checked}
            onCheckedChange={(val) => setChecked(val === true)}
          />
          <Label htmlFor="checkbox-demo">이용약관에 동의합니다</Label>
        </div>
        {checked && (
          <p className="text-sm text-muted-foreground">✓ 동의하셨습니다</p>
        )}
      </div>

      {/* RadioGroup */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">RadioGroup</h3>
        <RadioGroup value={radio} onValueChange={setRadio} className="space-y-2">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="option-1" id="r1" />
            <Label htmlFor="r1">무료 플랜</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="option-2" id="r2" />
            <Label htmlFor="r2">프로 플랜</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="option-3" id="r3" />
            <Label htmlFor="r3">엔터프라이즈 플랜</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">선택: {radio}</p>
      </div>

      {/* Select */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Select</h3>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="언어 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ko">한국어</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
        {selected && (
          <p className="text-sm text-muted-foreground">선택된 언어: {selected}</p>
        )}
      </div>
    </div>
  )
}
