/**
 * ScholeOS Clerk Authentication & API Client Layer (Frontend)
 *
 * Designed for Vite + React with separate Hono / Cloudflare Workers backend.
 */

// Clerk Publishable Key from environment (or default user key)
export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_bmVhcmJ5LW1vbGUtODYzNy5jbGVyay5hY2NvdW50cy5kZXYk';

// Backend Hono / Cloudflare Workers Gateway URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * ScholeOS Theme Appearance for Clerk Components
 * Perfectly aligned with Warm Cream (#FBF0E1), Indigo (#4338CA), and Charcoal (#1E1B1A) tokens.
 */
export const scholeosClerkAppearance = {
  variables: {
    colorPrimary: '#4338CA',
    colorText: '#1E1B1A',
    colorTextSecondary: '#6B7280',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#1E1B1A',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    card: 'shadow-xl border border-black/[0.06] rounded-2xl bg-white p-6 sm:p-8',
    headerTitle: 'font-display font-black text-2xl text-charcoal-dark tracking-tight',
    headerSubtitle: 'text-sm text-slate-subtle mt-1',
    formButtonPrimary:
      'bg-indigo-brand hover:bg-indigo-dark text-white font-semibold transition-all py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-brand/20',
    formFieldInput:
      'border-cream-border focus:border-indigo-brand focus:ring-2 focus:ring-indigo-brand/10 rounded-xl transition-all',
    footerActionLink: 'text-indigo-brand font-semibold hover:underline',
    socialButtonsBlockButton:
      'border border-cream-border hover:bg-cream-base/50 transition-colors rounded-xl',
    dividerLine: 'bg-cream-border',
    dividerText: 'text-xs text-slate-subtle uppercase tracking-wider',
  },
};

/**
 * Global helper to extract the active Clerk JWT session token.
 * Usable outside React component trees or inside non-hook helpers.
 */
export async function getClerkSessionToken(): Promise<string | null> {
  if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
    try {
      return await (window as any).Clerk.session.getToken();
    } catch (err) {
      console.warn('[Clerk] Failed to retrieve session token:', err);
    }
  }
  return null;
}

/**
 * Authenticated API Fetch Wrapper
 * Automatically attaches the Clerk Bearer JWT token to requests going to the Hono backend.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Clerk session token if available
  const token = await getClerkSessionToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    const error = new Error(
      errorData.message || `API request failed with HTTP ${response.status}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}
