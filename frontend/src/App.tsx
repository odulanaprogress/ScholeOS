import { useState } from 'react'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingWizardPage } from '@/pages/OnboardingWizardPage'
import { StyleGuidePage } from '@/pages/StyleGuidePage'
import { Layers, LogIn, Sparkles, Home } from 'lucide-react'

type AppView = 'landing' | 'login' | 'onboarding' | 'styleguide'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing')

  return (
    <div className="relative min-h-screen">
      {/* Floating Wave Navigation Switcher for Interactive Review */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-charcoal-dark/95 text-white p-1.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md text-xs font-semibold">
        <button
          type="button"
          onClick={() => setCurrentView('landing')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
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
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
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
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            currentView === 'onboarding'
              ? 'bg-indigo-brand text-white shadow-sm'
              : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Wave 3 Part B: School Setup Wizard"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-brand" />
          <span className="hidden sm:inline">Setup Wizard</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('styleguide')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
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

      {/* RENDER ACTIVE VIEW */}
      {currentView === 'landing' && (
        <LandingPage
          onOpenStyleGuide={() => setCurrentView('styleguide')}
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToOnboarding={() => setCurrentView('onboarding')}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onNavigateToOnboarding={() => setCurrentView('onboarding')}
          onNavigateToHome={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'onboarding' && (
        <OnboardingWizardPage
          onNavigateToHome={() => setCurrentView('landing')}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

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
