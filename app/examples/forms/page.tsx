"use client"

// 폼 예제 페이지 — react-hook-form + zod 검증 데모
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// 최소 비밀번호 길이 상수 (매직넘버 금지)
const MIN_PASSWORD_LENGTH = 8

// 로그인 폼 스키마 — email 형식 + 최소 비밀번호 길이 검증
const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`),
})

// 회원가입 폼 스키마 — 비밀번호 일치 확인 포함
const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`),
    confirmPassword: z.string(),
    bio: z.string().max(200, "소개는 200자 이하로 작성하세요").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

// 로그인 폼 컴포넌트
function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(data: LoginFormValues) {
    toast.success("로그인 성공!", { description: `${data.email}으로 로그인했습니다.` })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          로그인
        </Button>
      </form>
    </Form>
  )
}

// 회원가입 폼 컴포넌트
function SignupForm({ onSubmitResult }: { onSubmitResult: (data: SignupFormValues) => void }) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", bio: "" },
  })

  function onSubmit(data: SignupFormValues) {
    onSubmitResult(data)
    toast.success("회원가입 완료!", { description: "아래에서 제출 결과를 확인하세요." })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="홍길동" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>소개 (선택)</FormLabel>
              <FormControl>
                <Textarea placeholder="간단한 자기소개를 입력하세요..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          회원가입
        </Button>
      </form>
    </Form>
  )
}

export default function FormsPage() {
  const [result, setResult] = useState<SignupFormValues | null>(null)

  return (
    <main>
      <PageHeader
        title="폼 예제"
        description="react-hook-form과 zod를 사용한 폼 검증과 상태관리 패턴입니다."
        tags={["검증", "상태관리"]}
      />

      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-lg">
            <Tabs defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">로그인</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">회원가입</TabsTrigger>
                <TabsTrigger value="result" className="flex-1">제출 결과</TabsTrigger>
              </TabsList>

              {/* 로그인 탭 */}
              <TabsContent value="login" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">로그인</h2>
                    <p className="text-sm text-muted-foreground">
                      이메일 형식 오류나 짧은 비밀번호를 입력해 검증을 확인하세요.
                    </p>
                  </div>
                  <LoginForm />
                </div>
              </TabsContent>

              {/* 회원가입 탭 */}
              <TabsContent value="signup" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">회원가입</h2>
                    <p className="text-sm text-muted-foreground">
                      제출 후 결과 탭에서 입력값 JSON을 확인할 수 있습니다.
                    </p>
                  </div>
                  <SignupForm onSubmitResult={setResult} />
                </div>
              </TabsContent>

              {/* 제출 결과 JSON 미리보기 탭 */}
              <TabsContent value="result" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">제출 결과</h2>
                    <p className="text-sm text-muted-foreground">
                      회원가입 폼 제출 시 전달되는 데이터입니다.
                    </p>
                  </div>
                  {result ? (
                    <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm">
                      {JSON.stringify({ ...result, password: "••••••••", confirmPassword: "••••••••" }, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      회원가입 탭에서 폼을 제출하면 결과가 여기에 표시됩니다.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    </main>
  )
}
