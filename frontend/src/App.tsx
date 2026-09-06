import { useState } from 'react'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingWizardPage } from '@/pages/OnboardingWizardPage'
import { StyleGuidePage } from '@/pages/StyleGuidePage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OverviewPage } from '@/pages/admin/OverviewPage'
import { StaffManagementPage } from '@/pages/admin/StaffManagementPage'
import { AdminFeesPage } from '@/pages/admin'
import {
  TeacherOverviewPage,
  type TeacherAssignment,
} from '@/pages/teacher/TeacherOverviewPage'
import { ScoreEntryPage } from '@/pages/teacher/ScoreEntryPage'
import { TeacherAssignmentsPage } from '@/pages/teacher/TeacherAssignmentsPage'
import {
  ClassTeacherOverviewPage,
  AttendancePage,
  SubmissionTrackerPage,
  BroadsheetPage,
} from '@/pages/class-teacher'
import {
  ParentOverviewPage,
  ParentAttendancePage,
  ParentResultsPage,
  ParentFeesPage,
  PARENT_CHILDREN,
  PARENT_ANNOUNCEMENTS,
} from '@/pages/parent'
import {
  StudentOverviewPage,
  StudentAssignmentsPage,
  StudentTimetablePage,
} from '@/pages/student'
import { AiComingSoonPage } from '@/pages/AiComingSoonPage'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { SidebarNavItem } from '@/components/ui/Sidebar'
import {
  Layers,
  LogIn,
  Sparkles,
  Home,
  LayoutDashboard,
  UserPlus,
  BookOpen,
  FileSpreadsheet,
  Megaphone,
  Plus,
  Construction,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Award,
  Users,
  CreditCard,
  CalendarDays,
  Bot,
  UserCheck,
} from 'lucide-react'

type AppView =
  | 'landing'
  | 'login'
  | 'onboarding'
  | 'admin-overview'
  | 'admin-staff'
  | 'admin-fees'
  | 'admin-other'
  | 'teacher-overview'
  | 'teacher-scores'
  | 'teacher-assignments'
  | 'teacher-announcements'
  | 'class-teacher-overview'
  | 'class-teacher-scores'
  | 'class-teacher-attendance'
  | 'class-teacher-tracker'
  | 'class-teacher-broadsheet'
  | 'class-teacher-announcements'
  | 'parent-overview'
  | 'parent-attendance'
  | 'parent-results'
  | 'parent-fees'
  | 'parent-announcements'
  | 'parent-ai'
  | 'student-overview'
  | 'student-results'
  | 'student-attendance'
  | 'student-assignments'
  | 'student-timetable'
  | 'student-ai'
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

// Teacher Navigation Items (no trial pill, no admin items)
const TEACHER_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'scores', label: 'Score Entry', icon: FileSpreadsheet },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
]

const TEACHER_MOBILE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'scores', label: 'Scores', icon: FileSpreadsheet },
  { id: 'assignments', label: 'Tasks', icon: BookOpen },
]

// Class Teacher Navigation Items (Wave 6)
const CLASS_TEACHER_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'scores', label: 'Score Entry', icon: FileSpreadsheet },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'tracker', label: 'Submission Tracker', icon: ClipboardList },
  { id: 'broadsheet', label: 'Report Cards & Broadsheet', icon: Award },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
]

const CLASS_TEACHER_MOBILE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'broadsheet', label: 'Broadsheet', icon: Award },
  { id: 'tracker', label: 'Tracker', icon: ClipboardList },
]

// Parent Navigation Items (Wave 7)
const PARENT_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
]

const PARENT_MOBILE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'fees', label: 'Fees', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
]

// Student Navigation Items (Wave 7)
const STUDENT_NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'results', label: 'My Results', icon: Award },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
  { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
]

const STUDENT_MOBILE_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'assignments', label: 'Tasks', icon: BookOpen },
  { id: 'timetable', label: 'Schedule', icon: CalendarDays },
  { id: 'results', label: 'Results', icon: Award },
]

const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'jss2a-math',
    className: 'JSS 2A',
    subject: 'Mathematics',
    studentsCount: 38,
    status: 'draft',
    lastUpdated: 'Today at 9:30 AM',
  },
  {
    id: 'jss2b-math',
    className: 'JSS 2B',
    subject: 'Mathematics',
    studentsCount: 40,
    status: 'submitted',
    lastUpdated: 'Yesterday at 4:15 PM',
  },
  {
    id: 'sss1-physics',
    className: 'SSS 1 Science',
    subject: 'Physics',
    studentsCount: 36,
    status: 'locked',
    lastUpdated: 'Sep 2, 2026',
  },
]

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [activeAdminNavId, setActiveAdminNavId] = useState<string>('overview')
  const [activeTeacherNavId, setActiveTeacherNavId] = useState<string>('overview')
  const [activeClassTeacherNavId, setActiveClassTeacherNavId] = useState<string>('overview')
  const [selectedParentChildId, setSelectedParentChildId] = useState<string>('child-1')
  const [activeParentNavId, setActiveParentNavId] = useState<string>('overview')
  const [activeStudentNavId, setActiveStudentNavId] = useState<string>('overview')

  // Shared state
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false)
  const [selectedScoreClassId, setSelectedScoreClassId] = useState('jss2a-math')

  // Navigate within admin dashboard
  const handleAdminNavigate = (navId: string) => {
    setActiveAdminNavId(navId)
    if (navId === 'overview') {
      setCurrentView('admin-overview')
    } else if (navId === 'staff') {
      setCurrentView('admin-staff')
    } else if (navId === 'fees') {
      setCurrentView('admin-fees')
    } else {
      setCurrentView('admin-other')
    }
  }

  // Navigate within subject teacher dashboard
  const handleTeacherNavigate = (navId: string) => {
    setActiveTeacherNavId(navId)
    if (navId === 'overview') {
      setCurrentView('teacher-overview')
    } else if (navId === 'scores') {
      setCurrentView('teacher-scores')
    } else if (navId === 'assignments') {
      setCurrentView('teacher-assignments')
    } else if (navId === 'announcements') {
      setCurrentView('teacher-announcements')
    }
  }

  // Navigate within class teacher dashboard (Wave 6)
  const handleClassTeacherNavigate = (navId: string) => {
    setActiveClassTeacherNavId(navId)
    if (navId === 'overview') {
      setCurrentView('class-teacher-overview')
    } else if (navId === 'scores') {
      setCurrentView('class-teacher-scores')
    } else if (navId === 'attendance') {
      setCurrentView('class-teacher-attendance')
    } else if (navId === 'tracker') {
      setCurrentView('class-teacher-tracker')
    } else if (navId === 'broadsheet') {
      setCurrentView('class-teacher-broadsheet')
    } else if (navId === 'announcements') {
      setCurrentView('class-teacher-announcements')
    }
  }

  // Navigate within parent dashboard (Wave 7)
  const handleParentNavigate = (navId: string) => {
    setActiveParentNavId(navId)
    if (navId === 'overview') {
      setCurrentView('parent-overview')
    } else if (navId === 'attendance') {
      setCurrentView('parent-attendance')
    } else if (navId === 'results') {
      setCurrentView('parent-results')
    } else if (navId === 'fees') {
      setCurrentView('parent-fees')
    } else if (navId === 'announcements') {
      setCurrentView('parent-announcements')
    } else if (navId === 'ai-assistant') {
      setCurrentView('parent-ai')
    }
  }

  // Navigate within student dashboard (Wave 7)
  const handleStudentNavigate = (navId: string) => {
    setActiveStudentNavId(navId)
    if (navId === 'overview') {
      setCurrentView('student-overview')
    } else if (navId === 'results') {
      setCurrentView('student-results')
    } else if (navId === 'attendance') {
      setCurrentView('student-attendance')
    } else if (navId === 'assignments') {
      setCurrentView('student-assignments')
    } else if (navId === 'timetable') {
      setCurrentView('student-timetable')
    } else if (navId === 'ai-tutor') {
      setCurrentView('student-ai')
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Wave Navigation Switcher for Interactive Review */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-charcoal-dark/95 text-white p-1.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md text-xs font-semibold max-w-[95vw] overflow-x-auto">
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
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
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
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
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'onboarding'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 3 Part B: School Setup Wizard"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
          <span className="hidden sm:inline">Wizard</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Wave 4 Admin Dashboard Links */}
        <button
          type="button"
          onClick={() => {
            setActiveAdminNavId('overview')
            setCurrentView('admin-overview')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView.startsWith('admin')
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 4: Admin Dashboard"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Admin</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveAdminNavId('fees')
            setCurrentView('admin-fees')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'admin-fees'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 8: Admin Fees & Payments"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Fees</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Wave 5 Subject Teacher Links */}
        <button
          type="button"
          onClick={() => {
            setActiveTeacherNavId('overview')
            setCurrentView('teacher-overview')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'teacher-overview'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 5: Teacher Overview"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Teacher</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTeacherNavId('scores')
            setCurrentView('teacher-scores')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'teacher-scores'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 5: Score Entry Page"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Scores</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTeacherNavId('assignments')
            setCurrentView('teacher-assignments')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'teacher-assignments'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 5: Assignments Page"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
          <span className="hidden sm:inline">Tasks</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Wave 6 Class Teacher Links */}
        <button
          type="button"
          onClick={() => {
            setActiveClassTeacherNavId('overview')
            setCurrentView('class-teacher-overview')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'class-teacher-overview'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 6: Class Teacher Overview"
        >
          <Users className="w-3.5 h-3.5 text-rose-300" />
          <span className="hidden sm:inline">Class</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveClassTeacherNavId('attendance')
            setCurrentView('class-teacher-attendance')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'class-teacher-attendance'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 6: Daily Attendance Page"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Attend</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveClassTeacherNavId('tracker')
            setCurrentView('class-teacher-tracker')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'class-teacher-tracker'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 6: Subject Submission Tracker"
        >
          <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveClassTeacherNavId('broadsheet')
            setCurrentView('class-teacher-broadsheet')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'class-teacher-broadsheet'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 6: Master Broadsheet & Report Cards"
        >
          <Award className="w-3.5 h-3.5 text-gold-brand" />
          <span className="hidden sm:inline">Broadsheet</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Wave 7 Parent Dashboard Links */}
        <button
          type="button"
          onClick={() => {
            setActiveParentNavId('overview')
            setCurrentView('parent-overview')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView.startsWith('parent')
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 7: Parent Dashboard"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Parent</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveParentNavId('fees')
            setCurrentView('parent-fees')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'parent-fees'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 7: Parent Fees & Invoices"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Fees</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Wave 7 Student Dashboard Links */}
        <button
          type="button"
          onClick={() => {
            setActiveStudentNavId('overview')
            setCurrentView('student-overview')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView.startsWith('student')
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 7: Student Dashboard"
        >
          <GraduationCap className="w-3.5 h-3.5 text-sky-300" />
          <span className="hidden sm:inline">Student</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveStudentNavId('assignments')
            setCurrentView('student-assignments')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'student-assignments'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 7: Student Homework Tasks"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
          <span className="hidden sm:inline">Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveStudentNavId('timetable')
            setCurrentView('student-timetable')
          }}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            currentView === 'student-timetable'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 7: Student Weekly Timetable"
        >
          <CalendarDays className="w-3.5 h-3.5 text-gold-brand" />
          <span className="hidden sm:inline">Schedule</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        <button
          type="button"
          onClick={() => setCurrentView('styleguide')}
          className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
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
            setActiveAdminNavId('overview')
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
            setActiveAdminNavId('overview')
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
                setActiveAdminNavId('staff')
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
              setActiveAdminNavId('staff')
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

      {/* VIEW: ADMIN FEES MANAGEMENT PAGE (WAVE 8) */}
      {currentView === 'admin-fees' && (
        <DashboardLayout
          activeNavId="fees"
          onNavigate={handleAdminNavigate}
          pageTitle="Fees & Payments Management"
          pageSubtitle="Configure fee structures, track arrears & collections, and reconcile bank transfer payment proofs."
          onLogout={() => setCurrentView('login')}
        >
          <AdminFeesPage />
        </DashboardLayout>
      )}

      {/* VIEW: ADMIN OTHER MODULES PLACEHOLDER */}
      {currentView === 'admin-other' && (
        <DashboardLayout
          activeNavId={activeAdminNavId}
          onNavigate={handleAdminNavigate}
          pageTitle={MODULE_TITLES[activeAdminNavId]?.title || 'Module'}
          pageSubtitle={MODULE_TITLES[activeAdminNavId]?.subtitle || 'ScholeOS Admin Dashboard'}
          onLogout={() => setCurrentView('login')}
        >
          <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 space-y-4">
            <div className="w-14 h-14 bg-indigo-light text-indigo-brand rounded-2xl flex items-center justify-center mx-auto border border-indigo-200">
              <Construction className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <Badge variant="gold" size="sm" className="mb-2">
                Scheduled for {MODULE_TITLES[activeAdminNavId]?.wave || 'Upcoming Wave'}
              </Badge>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-charcoal-dark">
                {MODULE_TITLES[activeAdminNavId]?.title || 'Upcoming Module'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
                {MODULE_TITLES[activeAdminNavId]?.subtitle ||
                  'This module is fully mapped and will be built in the next wave of our iterative roadmap.'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveAdminNavId('overview')
                  setCurrentView('admin-overview')
                }}
              >
                ← Return to Overview
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveAdminNavId('staff')
                  setCurrentView('admin-staff')
                }}
              >
                Go to Staff Management →
              </Button>
            </div>
          </Card>
        </DashboardLayout>
      )}

      {/* WAVE 5 — VIEW: SUBJECT TEACHER OVERVIEW */}
      {currentView === 'teacher-overview' && (
        <DashboardLayout
          activeNavId={activeTeacherNavId}
          onNavigate={handleTeacherNavigate}
          navItems={TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Subject Teacher"
          userName="Mrs. Bola Adeyemi"
          userRole="Mathematics & Physics Faculty"
          mobileNavTabs={TEACHER_MOBILE_TABS}
          pageTitle="Teacher Dashboard"
          pageSubtitle="Welcome back, Mrs. Adeyemi • Term 2 Score Submissions & Assignments"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedScoreClassId('jss2a-math')
                setActiveTeacherNavId('scores')
                setCurrentView('teacher-scores')
              }}
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Open Score Entry
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <TeacherOverviewPage
            assignments={INITIAL_TEACHER_ASSIGNMENTS}
            onNavigateToScoreEntry={(classId) => {
              setSelectedScoreClassId(classId)
              setActiveTeacherNavId('scores')
              setCurrentView('teacher-scores')
            }}
          />
        </DashboardLayout>
      )}

      {/* WAVE 5 — VIEW: SUBJECT TEACHER SCORE ENTRY */}
      {currentView === 'teacher-scores' && (
        <DashboardLayout
          activeNavId={activeTeacherNavId}
          onNavigate={handleTeacherNavigate}
          navItems={TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Subject Teacher"
          userName="Mrs. Bola Adeyemi"
          userRole="Mathematics & Physics Faculty"
          mobileNavTabs={TEACHER_MOBILE_TABS}
          pageTitle="Continuous Assessment & Exam Scores"
          pageSubtitle="Enter test marks, laboratory scores, and term exam results for your assigned classes."
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2 • 2025/2026
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ScoreEntryPage initialAssignmentId={selectedScoreClassId} />
        </DashboardLayout>
      )}

      {/* WAVE 5 — VIEW: SUBJECT TEACHER ASSIGNMENTS */}
      {currentView === 'teacher-assignments' && (
        <DashboardLayout
          activeNavId={activeTeacherNavId}
          onNavigate={handleTeacherNavigate}
          navItems={TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Subject Teacher"
          userName="Mrs. Bola Adeyemi"
          userRole="Mathematics & Physics Faculty"
          mobileNavTabs={TEACHER_MOBILE_TABS}
          pageTitle="Coursework & Assignments"
          pageSubtitle="Create assignments, attach worksheets, and track student submissions."
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddAssignmentModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Assignment
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <TeacherAssignmentsPage
            isAddModalOpen={isAddAssignmentModalOpen}
            onAddModalOpenChange={setIsAddAssignmentModalOpen}
          />
        </DashboardLayout>
      )}

      {/* WAVE 5 — VIEW: SUBJECT TEACHER ANNOUNCEMENTS */}
      {currentView === 'teacher-announcements' && (
        <DashboardLayout
          activeNavId={activeTeacherNavId}
          onNavigate={handleTeacherNavigate}
          navItems={TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Subject Teacher"
          userName="Mrs. Bola Adeyemi"
          userRole="Mathematics & Physics Faculty"
          mobileNavTabs={TEACHER_MOBILE_TABS}
          pageTitle="Staff Notices & Announcements"
          pageSubtitle="Institutional updates from the Principal's Office and Academic Board."
          onLogout={() => setCurrentView('login')}
        >
          <Card className="p-6 space-y-4 max-w-3xl">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-200/60">
                <span className="font-bold text-sm text-indigo-950">
                  Term 2 Score Upload Deadline Reminder
                </span>
                <span className="text-[11px] text-indigo-700 font-semibold">2 hours ago</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
                Dear Subject Teachers, please ensure all continuous assessments and exam scores for JSS 1–3 and SSS 1–3 are finalized and submitted for review by Friday, September 11, 2026, ahead of the Form Masters' broadsheet compilation meeting.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cream-base/50 border border-cream-border">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-border">
                <span className="font-bold text-sm text-charcoal-dark">
                  Academic Board Meeting — Friday 2:00 PM
                </span>
                <span className="text-[11px] text-charcoal-muted font-semibold">Yesterday</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Agenda includes mid-term performance analysis, WAEC prep session scheduling, and parents' consultative forum dates. Attendance is mandatory for all teaching staff.
              </p>
            </div>
          </Card>
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER OVERVIEW */}
      {currentView === 'class-teacher-overview' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Class Teacher Dashboard"
          pageSubtitle="Class JSS 2A (38 Students) • Term 2 2025/2026 Academic Session"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleClassTeacherNavigate('broadsheet')}
            >
              <Award className="w-4 h-4 mr-1.5" />
              View Broadsheet
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ClassTeacherOverviewPage
            className="JSS 2A"
            totalStudents={38}
            attendanceStatus="marked"
            presentCount={36}
            onNavigateToAttendance={() => handleClassTeacherNavigate('attendance')}
            onNavigateToTracker={() => handleClassTeacherNavigate('tracker')}
            onNavigateToBroadsheet={() => handleClassTeacherNavigate('broadsheet')}
            onNavigateToScores={() => handleClassTeacherNavigate('scores')}
          />
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER SCORE ENTRY (reusing Wave 5 ScoreEntryPage) */}
      {currentView === 'class-teacher-scores' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Mathematics — Continuous Assessment & Exam"
          pageSubtitle="Your assigned subject for JSS 2A • 1st CA (20), 2nd CA (20), Exam (60)"
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2 • 2025/2026
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ScoreEntryPage initialAssignmentId="jss2a-math" />
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER ATTENDANCE */}
      {currentView === 'class-teacher-attendance' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Daily Attendance Register"
          pageSubtitle="Morning attendance roll call for JSS 2A • Term 2 2025/2026"
          headerAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleClassTeacherNavigate('overview')}
            >
              ← Back to Overview
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <AttendancePage />
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER SUBMISSION TRACKER */}
      {currentView === 'class-teacher-tracker' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Subject Score Submission Tracker"
          pageSubtitle="Real-time monitor of subject submissions across all 8 curriculum subjects for JSS 2A"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleClassTeacherNavigate('broadsheet')}
            >
              <Award className="w-4 h-4 mr-1.5" />
              Check Broadsheet
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <SubmissionTrackerPage
            className="JSS 2A"
            onNavigateToBroadsheet={() => handleClassTeacherNavigate('broadsheet')}
          />
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER BROADSHEET & REPORT CARDS */}
      {currentView === 'class-teacher-broadsheet' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Master Broadsheet & Report Cards"
          pageSubtitle="Official term-end broadsheet for JSS 2A • 8 Subjects • Weighted Averages & Student Positions"
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2 • 2025/2026
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <BroadsheetPage
            className="JSS 2A"
            onNavigateToTracker={() => handleClassTeacherNavigate('tracker')}
          />
        </DashboardLayout>
      )}

      {/* WAVE 6 — VIEW: CLASS TEACHER ANNOUNCEMENTS */}
      {currentView === 'class-teacher-announcements' && (
        <DashboardLayout
          activeNavId={activeClassTeacherNavId}
          onNavigate={handleClassTeacherNavigate}
          navItems={CLASS_TEACHER_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Class Teacher • JSS 2A"
          userName="Mrs. Bola Adeyemi"
          userRole="Form Master & Mathematics"
          mobileNavTabs={CLASS_TEACHER_MOBILE_TABS}
          pageTitle="Class Notices & Broadcasts"
          pageSubtitle="Communications and announcements for Form Masters & Class Teachers."
          onLogout={() => setCurrentView('login')}
        >
          <Card className="p-6 space-y-4 max-w-3xl">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-200/60">
                <span className="font-bold text-sm text-indigo-950">
                  Broadsheet Submission Deadline for Form Masters
                </span>
                <span className="text-[11px] text-indigo-700 font-semibold">1 hour ago</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
                All Form Masters are requested to ensure their class broadsheets are fully locked and approved by Friday. Once locked, report card PDFs will be generated automatically for the end-of-term PTA Open Day.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-cream-base/50 border border-cream-border">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-border">
                <span className="font-bold text-sm text-charcoal-dark">
                  Class Attendance Audit Notice
                </span>
                <span className="text-[11px] text-charcoal-muted font-semibold">3 days ago</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Please verify that any students with more than 5 cumulative absences have corresponding medical or authorized leave notes on file before term closure.
              </p>
            </div>
          </Card>
        </DashboardLayout>
      )}

      {/* ======================================================== */}
      {/* WAVE 7 — PARENT DASHBOARD VIEWS                          */}
      {/* ======================================================== */}

      {/* PARENT OVERVIEW */}
      {currentView === 'parent-overview' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="Parent Dashboard"
          pageSubtitle="Crown Academy Lagos • Student academic records, fee invoicing, and attendance portal"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleParentNavigate('results')}
            >
              <Award className="w-4 h-4 mr-1.5" />
              View Results
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentOverviewPage
            childrenList={PARENT_CHILDREN}
            selectedChildId={selectedParentChildId}
            onSelectChild={setSelectedParentChildId}
            announcements={PARENT_ANNOUNCEMENTS}
            onNavigateToAttendance={() => handleParentNavigate('attendance')}
            onNavigateToResults={() => handleParentNavigate('results')}
            onNavigateToFees={() => handleParentNavigate('fees')}
          />
        </DashboardLayout>
      )}

      {/* PARENT ATTENDANCE */}
      {currentView === 'parent-attendance' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="Student Attendance History"
          pageSubtitle="Daily roll call registers, arrival timestamps, and excused absences"
          headerAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleParentNavigate('overview')}
            >
              ← Back to Overview
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentAttendancePage
            childrenList={PARENT_CHILDREN}
            selectedChildId={selectedParentChildId}
            onSelectChild={setSelectedParentChildId}
            showChildSwitcher={true}
          />
        </DashboardLayout>
      )}

      {/* PARENT RESULTS */}
      {currentView === 'parent-results' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="Terminal Results & Report Cards"
          pageSubtitle="Official broadsheets, continuous assessment breakdown, and principal certification"
          headerAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleParentNavigate('fees')}
            >
              <CreditCard className="w-4 h-4 mr-1.5" />
              Check School Fees
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentResultsPage
            childrenList={PARENT_CHILDREN}
            selectedChildId={selectedParentChildId}
            onSelectChild={setSelectedParentChildId}
            showChildSwitcher={true}
          />
        </DashboardLayout>
      )}

      {/* PARENT FEES & PAYMENTS */}
      {currentView === 'parent-fees' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="School Fees & Invoices"
          pageSubtitle="Term fees billing, online card payments, and bank transfer receipt upload verification"
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2 • 2025/2026
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentFeesPage
            childrenList={PARENT_CHILDREN}
            selectedChildId={selectedParentChildId}
            onSelectChild={setSelectedParentChildId}
          />
        </DashboardLayout>
      )}

      {/* PARENT ANNOUNCEMENTS */}
      {currentView === 'parent-announcements' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="School Notices & Announcements"
          pageSubtitle="PTA circulars, calendar notifications, and official directives"
          onLogout={() => setCurrentView('login')}
        >
          <div className="space-y-4 max-w-3xl">
            {PARENT_ANNOUNCEMENTS.map((ann) => (
              <Card key={ann.id} className="p-5 space-y-2 border-cream-border">
                <div className="flex items-center justify-between gap-2 border-b border-cream-border pb-2">
                  <span className="font-bold text-sm text-charcoal-dark">{ann.title}</span>
                  <span className="text-[11px] text-charcoal-muted font-mono">{ann.date}</span>
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed">{ann.content}</p>
                <div className="pt-1 text-[11px] text-indigo-700 font-semibold">
                  Source: {ann.author}
                </div>
              </Card>
            ))}
          </div>
        </DashboardLayout>
      )}

      {/* PARENT AI ASSISTANT PLACEHOLDER */}
      {currentView === 'parent-ai' && (
        <DashboardLayout
          activeNavId={activeParentNavId}
          onNavigate={handleParentNavigate}
          navItems={PARENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Parent Portal"
          userName="Alhaji Dr. S. Bello"
          userRole="Parent • 2 Enrolled Children"
          mobileNavTabs={PARENT_MOBILE_TABS}
          pageTitle="ScholeOS Parent AI Assistant"
          pageSubtitle="Interactive school query copilot scheduled for Wave 9"
          onLogout={() => setCurrentView('login')}
        >
          <AiComingSoonPage
            title="Parent AI Copilot"
            subtitle="Ask questions about term dates, fee receipts, and performance summaries in natural language."
            role="parent"
            onBack={() => handleParentNavigate('overview')}
          />
        </DashboardLayout>
      )}

      {/* ======================================================== */}
      {/* WAVE 7 — STUDENT DASHBOARD VIEWS                         */}
      {/* ======================================================== */}

      {/* STUDENT OVERVIEW */}
      {currentView === 'student-overview' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="Student Dashboard"
          pageSubtitle="Welcome back, Fatima • Term 2 2025/2026 Academic Session"
          headerAction={
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStudentNavigate('assignments')}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              View Assignments
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <StudentOverviewPage
            studentName="Fatima Bello"
            classNameTitle="JSS 2A"
            admissionNumber="JSS2/003"
            onNavigateToResults={() => handleStudentNavigate('results')}
            onNavigateToAssignments={() => handleStudentNavigate('assignments')}
            onNavigateToTimetable={() => handleStudentNavigate('timetable')}
            onNavigateToAttendance={() => handleStudentNavigate('attendance')}
          />
        </DashboardLayout>
      )}

      {/* STUDENT MY RESULTS (reusing ParentResultsPage scoped to student) */}
      {currentView === 'student-results' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="My Academic Results"
          pageSubtitle="Terminal report cards and WAEC standard grade records"
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2 • 2025/2026
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentResultsPage
            selectedChildId="child-1"
            showChildSwitcher={false}
            studentName="Fatima Bello"
            classNameTitle="JSS 2A"
            admissionNumber="JSS2/003"
          />
        </DashboardLayout>
      )}

      {/* STUDENT ATTENDANCE (reusing ParentAttendancePage scoped to student) */}
      {currentView === 'student-attendance' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="My Class Attendance"
          pageSubtitle="Daily morning attendance roll record for JSS 2A"
          headerAction={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleStudentNavigate('overview')}
            >
              ← Back to Overview
            </Button>
          }
          onLogout={() => setCurrentView('login')}
        >
          <ParentAttendancePage
            selectedChildId="child-1"
            showChildSwitcher={false}
            studentName="Fatima Bello"
            classNameTitle="JSS 2A"
          />
        </DashboardLayout>
      )}

      {/* STUDENT ASSIGNMENTS */}
      {currentView === 'student-assignments' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="Coursework & Assignments"
          pageSubtitle="Download teacher resources, submit homework solutions, and view graded scores"
          headerAction={
            <Badge variant="primary" size="sm">
              Term 2
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <StudentAssignmentsPage classNameTitle="JSS 2A" />
        </DashboardLayout>
      )}

      {/* STUDENT TIMETABLE */}
      {currentView === 'student-timetable' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="Weekly Class Timetable"
          pageSubtitle="Monday through Friday periods, teacher allocations, and lab rooms for JSS 2A"
          headerAction={
            <Badge variant="primary" size="sm">
              JSS 2A Schedule
            </Badge>
          }
          onLogout={() => setCurrentView('login')}
        >
          <StudentTimetablePage classNameTitle="JSS 2A" />
        </DashboardLayout>
      )}

      {/* STUDENT AI TUTOR PLACEHOLDER */}
      {currentView === 'student-ai' && (
        <DashboardLayout
          activeNavId={activeStudentNavId}
          onNavigate={handleStudentNavigate}
          navItems={STUDENT_NAV_ITEMS}
          showTrialPill={false}
          roleBadge="Student • JSS 2A"
          userName="Fatima Bello"
          userRole="Student • Class JSS 2A (Adm: JSS2/003)"
          mobileNavTabs={STUDENT_MOBILE_TABS}
          pageTitle="ScholeOS AI Tutor"
          pageSubtitle="Personalized interactive study assistant scheduled for Wave 9"
          onLogout={() => setCurrentView('login')}
        >
          <AiComingSoonPage
            title="ScholeOS AI Tutor"
            subtitle="Your 24/7 personal learning copilot for solving homework, explaining difficult subjects, and practicing for exams."
            role="student"
            onBack={() => handleStudentNavigate('overview')}
          />
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
