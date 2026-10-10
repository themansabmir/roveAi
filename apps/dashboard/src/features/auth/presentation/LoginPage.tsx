import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required."),
  agencyName: z.string().trim().min(1, "Agency name is required."),
  password: z.string().min(10, "Use at least 10 characters."),
})

type LoginValues = z.infer<typeof loginSchema>
type SignupValues = z.infer<typeof signupSchema>

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })
  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", agencyName: "", email: "", password: "" },
  })

  const switchMode = (next: "login" | "signup") => {
    setFormError(null)
    setMode(next)
  }

  const onLogin = loginForm.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await signIn(values)
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  })

  const onSignup = signupForm.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await signUp(values)
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  })

  const message = formError
  const submitting = loginForm.formState.isSubmitting || signupForm.formState.isSubmitting

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>LocalBrief</CardTitle>
          <CardDescription>local business opportunity briefs for agencies</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? (
            <form className="space-y-4" onSubmit={onLogin} noValidate>
              <Field label="Email" error={loginForm.formState.errors.email?.message}>
                <Input type="email" autoComplete="email" {...loginForm.register("email")} />
              </Field>
              <Field label="Password" error={loginForm.formState.errors.password?.message}>
                <PasswordInput
                  show={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                  autoComplete="current-password"
                  {...loginForm.register("password")}
                />
              </Field>
              {message ? <p className="text-sm text-destructive">{message}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
              <Button className="w-full" type="button" variant="ghost" onClick={() => switchMode("signup")}>
                Create an account
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onSignup} noValidate>
              <Field label="Your name" error={signupForm.formState.errors.name?.message}>
                <Input autoComplete="name" {...signupForm.register("name")} />
              </Field>
              <Field label="Agency name" error={signupForm.formState.errors.agencyName?.message}>
                <Input autoComplete="organization" {...signupForm.register("agencyName")} />
              </Field>
              <Field label="Email" error={signupForm.formState.errors.email?.message}>
                <Input type="email" autoComplete="email" {...signupForm.register("email")} />
              </Field>
              <Field label="Password" error={signupForm.formState.errors.password?.message}>
                <PasswordInput
                  show={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                  autoComplete="new-password"
                  {...signupForm.register("password")}
                />
              </Field>
              {message ? <p className="text-sm text-destructive">{message}</p> : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </Button>
              <Button className="w-full" type="button" variant="ghost" onClick={() => switchMode("login")}>
                Already have an account
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & { show: boolean; onToggle: () => void }
>(({ show, onToggle, ...props }, ref) => (
  <div className="relative">
    <Input ref={ref} type={show ? "text" : "password"} className="pr-10" {...props} />
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff /> : <Eye />}
    </Button>
  </div>
))
PasswordInput.displayName = "PasswordInput"
