import React, { useState } from 'react'
import {
  Button,
  Card,
  Input,
  IconBadge,
} from '@/components/ui'
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

export interface LoginPageProps {
  onNavigateToOnboarding: () => void
  onNavigateToHome: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToOnboarding,
  onNavigateToHome,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let isValid = true

    // Email validation
    if (!email.trim()) {
      setEmailError('Enter your email address')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address (e.g. principal@school.edu.ng)')
      isValid = false
    } else {
      setEmailError('')
    }

    // Password validation
    if (!password) {
      setPasswordError('Enter your password')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setPasswordError('')
    }

    if (isValid) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setLoginSuccess(true)
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-cream-base flex flex-col justify-between font-sans selection:bg-indigo-brand selection:text-white p-4 sm:p-6">
      {/* Top Header / Brand Logo */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onNavigateToHome}
          className="flex items-center gap-3 select-none group text-left focus:outline-none"
        >
          <IconBadge size="sm" icon={<GraduationCap className="w-4 h-4 text-white" />} />
          <span className="font-display font-black text-xl tracking-tight text-indigo-brand group-hover:opacity-85 transition-opacity">
            ScholeOS
          </span>
        </button>

        <button
          type="button"
          onClick={onNavigateToHome}
          className="text-xs font-semibold text-slate-subtle hover:text-indigo-brand flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-8">
        <Card className="p-8 sm:p-10 border border-black/[0.04]">
          {loginSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-black text-charcoal-dark">
                Authenticated!
              </h2>
              <p className="text-sm text-slate-subtle leading-relaxed">
                Welcome back to your school dashboard. In Wave 4, this redirects to your role-specific dashboard shell.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={onNavigateToHome}
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Header */}
              <div className="space-y-1.5 text-center">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-charcoal-dark tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-subtle leading-relaxed">
                  Log in to manage your school on ScholeOS.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="principal@school.edu.ng"
                  icon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError('')
                  }}
                  error={emailError}
                  autoComplete="email"
                />

                <div className="space-y-1.5">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password..."
                    icon={<Lock className="w-4 h-4" />}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError('')
                    }}
                    error={passwordError}
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-indigo-brand focus:outline-none p-1 text-slate-400"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                  />

                  <div className="flex justify-end pt-0.5">
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Password reset link will be sent to your verified school email.')
                      }}
                      className="text-xs font-semibold text-indigo-brand hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              {/* Primary Full Width Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>

              {/* Bottom Register Prompt */}
              <div className="pt-2 text-center text-xs text-slate-subtle">
                <span>Don't have a school on ScholeOS yet? </span>
                <button
                  type="button"
                  onClick={onNavigateToOnboarding}
                  className="font-bold text-indigo-brand hover:underline focus:outline-none"
                >
                  Register here
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Bottom Footer Minimal */}
      <div className="text-center py-4 text-xs text-gray-400">
        <p>© 2026 ScholeOS Inc. Bank-grade 256-bit encryption & multi-tenant isolation.</p>
      </div>
    </div>
  )
}
