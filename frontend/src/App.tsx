import { useState } from 'react'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingWizardPage } from '@/pages/OnboardingWizardPage'
import { StyleGuidePage } from '@/pages/StyleGuidePage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OverviewPage } from '@/pages/admin/OverviewPage'
import { StaffManagementPage } from '@/pages/admin/StaffManagementPage'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Layers,
  LogIn,
  Sparkles,
  Home,
  LayoutDashboard,
  Users,
  UserPlus,
  Construction,
} from 'lucide-react'

type AppView =
  | 'landing'
  | 'login'
  | 'onboarding'
  | 'admin-overview'
  | 'admin-staff'
  | 'admin-other'
  | 'styleguide'

const MODULE_TITLES: Record<string, { title: string; subtitle: string; wave: string }> = {
  students: {
    title: 'Student Directory & Enrolment',
    subtitle: 'Comprehensive student biodata, guardians, admission numbers, and records.',
    wave: 'Wave 7: Parent & Student Views',
  },
  classes: {
    title: 'Classes & Curriculum Subjects',
    subtitle: 'Manage class arms, stream capacities, and subject allocations.',
    wave: 'Wave 6: Class Teacher Broadsheets',
  },
  results: {
    title: 'Results, Continuous Assessments & Broadsheets',
    subtitle: 'WAEC/NECO format score sheets, cumulative term calculations, and principal approval.',
    wave: 'Wave 5: Subject Teacher Score Entry & Wave 6: Broadsheets',
  },
  fees: {
    title: 'School Fees & Payment Transactions',
    subtitle: 'Tuition collection, bank transfer reconciliation, receipts, and debtor tracking.',
    wave: 'Wave 8: Fees & Payments UI',
  },
  attendance: {
    title: 'Daily Attendance Register',
    subtitle: 'Morning registration, absence tracking, and automated parent SMS notifications.',
    wave: 'Wave 6: Class Teacher Dashboard',
  },
  announcements: {
    title: 'School Announcements & Broadcasts',
    subtitle: 'Send instant SMS and push notifications to teachers, parents, and students.',
    wave: 'Wave 9: AI Assistant & Communication',
  },
  ai: {
    title: 'ScholeOS AI Assistant',
    subtitle: 'Intelligent term-end comments, score irregularity detection, and automated report card narratives.',
    wave: 'Wave 9: AI Assistant Panels',
  },
  settings: {
    title: 'School Settings & Configuration',
    subtitle: 'Grading scale formulas, academic calendar dates, school crest, and billing plans.',
    wave: 'Wave 4: Admin Dashboard Shell',
  },
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [activeNavId, setActiveNavId] = useState<string>('overview')
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)

  // Navigate within admin dashboard
  const handleAdminNavigate = (navId: string) => {
    setActiveNavId(navId)
    if (navId === 'overview') {
      setCurrentView('admin-overview')
    } else if (navId === 'staff') {
      setCurrentView('admin-staff')
    } else {
      setCurrentView('admin-other')
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Wave Navigation Switcher for Interactive Review */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-charcoal-dark/95 text-white p-1.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md text-xs font-semibold max-w-[95vw] overflow-x-auto">
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'landing'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 2: Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('login')}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'login'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 3 Part A: Login Page"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Login</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('onboarding')}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'onboarding'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 3 Part B: School Setup Wizard"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
          <span className="hidden sm:inline">Wizard</span>
        </button>

        {/* Wave 4 Admin Dashboard Links */}
        <button
          type="button"
          onClick={() => {
            setActiveNavId('overview')
            setCurrentView('admin-overview')
          }}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'admin-overview'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 4: Admin Overview"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNavId('staff')
            setCurrentView('admin-staff')
          }}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'admin-staff'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 4: Staff Management"
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Staff</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('styleguide')}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'styleguide'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 1: Design Tokens & Components"
        >
          <Layers className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">Tokens</span>
        </button>
      </div>

      {/* VIEW: MARKETING LANDING PAGE */}
      {currentView === 'landing' && (
        <LandingPage
          onOpenStyleGuide={() => setCurrentView('styleguide')}
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToOnboarding={() => setCurrentView('onboarding')}
        />
      )}

      {/* VIEW: LOGIN PAGE */}
      {currentView === 'login' && (
        <LoginPage
          onNavigateToOnboarding={() => setCurrentView('onboarding')}
          onNavigateToHome={() => setCurrentView('landing')}
          onLoginSuccess={() => {
            setActiveNavId('overview')
            setCurrentView('admin-overview')
          }}
        />
      )}

      {/* VIEW: ONBOARDING WIZARD */}
      {currentView === 'onboarding' && (
        <OnboardingWizardPage
          onNavigateToHome={() => setCurrentView('landing')}
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToDashboard={() => {
            setActiveNavId('overview')
            setCurrentView('admin-overview')
          }}
        />
      )}

      {/* VIEW: ADMIN OVERVIEW PAGE */}
      {currentView === 'admin-overview' && (
        <DashboardLayout
          activeNavId="overview"
          onNavigate={handleAdminNavigate}
          pageTitle="School Overview"
          pageSubtitle="Welcome back, Alhaji Dr. S. Bello • Crown Academy Lagos • 2nd Term 2025/2026"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveNavId('staff')
                setCurrentView('admin-staff')
                setIsAddStaffModalOpen(true)
              }}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add Staff
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <OverviewPage
            onNavigateToStaff={() => {
              setActiveNavId('staff')
              setCurrentView('admin-staff')
            }}
            onNavigateToFees={() => handleAdminNavigate('fees')}
            onNavigateToResults={() => handleAdminNavigate('results')}
          />
        </DashboardLayout>
      )}

      {/* VIEW: ADMIN STAFF MANAGEMENT PAGE */}
      {currentView === 'admin-staff' && (
        <DashboardLayout
          activeNavId="staff"
          onNavigate={handleAdminNavigate}
          pageTitle="Staff Management"
          pageSubtitle="Manage teaching faculty, form masters, and subject assignments across all secondary levels."
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddStaffModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add Staff
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <StaffManagementPage
            isAddStaffOpen={isAddStaffModalOpen}
            onAddStaffOpenChange={setIsAddStaffModalOpen}
          />
        </DashboardLayout>
      )}

      {/* VIEW: ADMIN OTHER MODULES PLACEHOLDER */}
      {currentView === 'admin-other' && (
        <DashboardLayout
          activeNavId={activeNavId}
          onNavigate={handleAdminNavigate}
          pageTitle={MODULE_TITLES[activeNavId]?.title || 'Module'}
          pageSubtitle={MODULE_TITLES[activeNavId]?.subtitle || 'ScholeOS Admin Dashboard'}
          onLogout={() => setCurrentView('login')}
        >
          <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 space-y-4">
            <div className="w-14 h-14 bg-indigo-light text-indigo-brand rounded-2xl flex items-center justify-center mx-auto border border-indigo-200">
              <Construction className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <Badge variant="gold" size="sm" className="mb-2">
                Scheduled for {MODULE_TITLES[activeNavId]?.wave || 'Upcoming Wave'}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
                {MODULE_TITLES[activeNavId]?.title || 'Upcoming Module'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
                {MODULE_TITLES[activeNavId]?.subtitle ||
                  'This module is fully mapped and will be built in the next wave of our iterative roadmap.'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveNavId('overview')
                  setCurrentView('admin-overview')
                }}
              >
                ← Return to Overview
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveNavId('staff')
                  setCurrentView('admin-staff')
                }}
              >
                Go to Staff Management →
              </Button>
            </div>
          </Card>
        </DashboardLayout>
      )}

      {/* VIEW: DESIGN SYSTEM STYLE GUIDE */}
      {currentView === 'styleguide' && (
        <div>
          <div className="bg-charcoal-dark text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-charcoal-border">
            <span className="font-semibold text-gold-brand flex items-center gap-1.5">
              <span>●</span> ScholeOS Design System Review Mode (Wave 1)
            </span>
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="bg-indigo-brand hover:bg-indigo-hover text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
            >
              ← Back to Landing Page
            </button>
          </div>
          <StyleGuidePage />
        </div>
      )}
    </div>
  )
}

export default App
