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
  KeyRound,
  ShieldCheck,
  UserCheck,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { SignIn, useUser, useClerk } from '@clerk/clerk-react'
import { scholeosClerkAppearance } from '@/lib/clerk'
import { useSchool } from '@/context/SchoolContext'

export interface LoginPageProps {
  onNavigateToOnboarding: () => void
  onNavigateToHome: () => void
  onLoginSuccess?: (role?: string) => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToOnboarding,
  onNavigateToHome,
  onLoginSuccess,
}) => {
  const { school } = useSchool()
  const { isSignedIn, user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const [activeTab, setActiveTab] = useState<'clerk' | 'demo'>('clerk')

  // Demo form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let isValid = true

    if (!email.trim()) {
      setEmailError('Enter your email address')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address (e.g. principal@school.edu.ng)')
      isValid = false
    } else {
      setEmailError('')
    }

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
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess('admin')
          }, 600)
        }
      }, 600)
    }
  }

  const handleQuickPersona = (role: string, demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demopassword123')
    setEmailError('')
    setPasswordError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setLoginSuccess(true)
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(role)
        }, 500)
      }
    }, 400)
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

      {/* Main Login Container */}
      <div className="w-full max-w-[460px] mx-auto my-auto py-6">
        {/* If user is ALREADY signed in via Clerk */}
        {isLoaded && isSignedIn && user ? (
          <Card className="p-8 sm:p-10 border border-black/[0.04] shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="relative mx-auto w-20 h-20">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User Avatar'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-brand shadow-md mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-brand text-white flex items-center justify-center text-2xl font-black font-display shadow-md mx-auto">
                  {(user.fullName || user.primaryEmailAddress?.emailAddress || 'U')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-brand bg-indigo-light px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Clerk Authenticated
              </span>
              <h2 className="text-2xl font-display font-black text-charcoal-dark pt-1">
                {user.fullName || 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-subtle">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="bg-cream-base/60 rounded-xl p-3 text-left border border-cream-border text-xs space-y-1 font-mono text-slate-600">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-sans">Clerk User ID:</span>
                <span className="font-semibold text-charcoal-dark truncate max-w-[200px]">
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-sans">Tenant Scope:</span>
                <span className="text-emerald-700 font-semibold font-sans">{school.name || 'Apex International College'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md font-semibold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  if (onLoginSuccess) onLoginSuccess()
                }}
              >
                Proceed to Dashboard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                onClick={() => signOut()}
              >
                Sign Out of Clerk
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="bg-white/80 p-1.5 rounded-2xl border border-cream-border shadow-xs flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('clerk')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'clerk'
                    ? 'bg-indigo-brand text-white shadow-sm'
                    : 'text-slate-600 hover:text-charcoal-dark hover:bg-cream-base/50'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Clerk Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'demo'
                    ? 'bg-indigo-brand text-white shadow-sm'
                    : 'text-slate-600 hover:text-charcoal-dark hover:bg-cream-base/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
                <span>Quick Role Demo</span>
              </button>
            </div>

            {/* TAB 1: Live Clerk Sign-In Component */}
            {activeTab === 'clerk' && (
              <div className="animate-fadeIn flex justify-center">
                <SignIn
                  routing="hash"
                  appearance={scholeosClerkAppearance}
                  signUpUrl="#onboarding"
                  fallbackRedirectUrl="#admin"
                />
              </div>
            )}

            {/* TAB 2: Quick Role Demo & Mock Form */}
            {activeTab === 'demo' && (
              <Card className="p-8 sm:p-10 border border-black/[0.04] shadow-xl animate-fadeIn">
                {loginSuccess ? (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-display font-black text-charcoal-dark">
                      Authenticated!
                    </h2>
                    <p className="text-sm text-slate-subtle leading-relaxed">
                      Entering role dashboard shell...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit} className="space-y-6" noValidate>
                    {/* Header */}
                    <div className="space-y-1.5 text-center">
                      <h1 className="text-2xl sm:text-3xl font-display font-black text-charcoal-dark tracking-tight">
                        Demo Sign In
                      </h1>
                      <p className="text-xs text-slate-subtle leading-relaxed">
                        Instant testing for platform roles with pre-seeded test data.
                      </p>
                    </div>

                    {/* Quick Persona Pills */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Quick Launch Role:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickPersona('admin', `principal@${school.domain || 'apexcollege.ng'}`)}
                          className="px-2.5 py-2 rounded-xl text-left bg-cream-base/60 hover:bg-cream-base border border-cream-border text-xs font-semibold text-charcoal-dark flex items-center gap-2 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-brand shrink-0" />
                          <span className="truncate">Principal / Admin</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPersona('teacher', `adeyemi@${school.domain || 'apexcollege.ng'}`)}
                          className="px-2.5 py-2 rounded-xl text-left bg-cream-base/60 hover:bg-cream-base border border-cream-border text-xs font-semibold text-charcoal-dark flex items-center gap-2 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">Subject Teacher</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPersona('class-teacher', `babatunde@${school.domain || 'apexcollege.ng'}`)}
                          className="px-2.5 py-2 rounded-xl text-left bg-cream-base/60 hover:bg-cream-base border border-cream-border text-xs font-semibold text-charcoal-dark flex items-center gap-2 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">Class Teacher</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPersona('parent', 'mrs.obi@gmail.com')}
                          className="px-2.5 py-2 rounded-xl text-left bg-cream-base/60 hover:bg-cream-base border border-cream-border text-xs font-semibold text-charcoal-dark flex items-center gap-2 transition-colors"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">Parent Portal</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center my-3">
                      <div className="border-t border-cream-border w-full" />
                      <span className="bg-white px-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold absolute">
                        or custom email
                      </span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder={`user@${school.domain || 'apexcollege.ng'}`}
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
                          placeholder="••••••••"
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
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center shadow-md font-semibold"
                      isLoading={loading}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Sign In Demo Account
                    </Button>
                  </form>
                )}
              </Card>
            )}

            {/* Bottom Register Prompt */}
            <div className="text-center text-xs text-slate-subtle">
              <span>Don't have a school on ScholeOS yet? </span>
              <button
                type="button"
                onClick={onNavigateToOnboarding}
                className="font-bold text-indigo-brand hover:underline focus:outline-none"
              >
                Register here
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Minimal */}
      <div className="text-center py-4 text-xs text-gray-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>© 2026 ScholeOS Inc. Powered by Clerk Authentication & Hono Cloudflare Workers.</span>
      </div>
    </div>
  )
}
