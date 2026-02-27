"use client"

// Tooltip / Popover / DropdownMenu 오버레이 컴포넌트 데모
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Info, Settings, User, LogOut } from "lucide-react"

export function OverlayDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Tooltip — 마우스 오버 시 설명 표시 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>아이콘에 마우스를 올리면 이 툴팁이 표시됩니다</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Popover — 클릭 시 팝오버 패널 표시 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">팝오버 열기</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">팝오버 제목</h4>
            <p className="text-sm text-muted-foreground">
              클릭으로 열고 닫을 수 있는 팝오버입니다. 바깥을 클릭하면
              닫힙니다.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      {/* DropdownMenu — 메뉴 항목 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            내 계정
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <User className="h-4 w-4" />
            프로필
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4" />
            설정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
