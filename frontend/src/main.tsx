import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { CLERK_PUBLISHABLE_KEY, scholeosClerkAppearance } from './lib/clerk'
import { SchoolProvider } from './context/SchoolContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        appearance={scholeosClerkAppearance}
      >
        <SchoolProvider>
          <App />
        </SchoolProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
)
