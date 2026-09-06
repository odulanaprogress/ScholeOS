/**
 * ScholeOS Design System Tokens
 * Source of truth for brand colors, typography, elevations, and layout metrics.
 */

export const colors = {
  cream: {
    base: '#FBF0E1',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    hover: '#F5E6D3',
    border: '#EED9C4',
  },
  indigo: {
    brand: '#4338CA',
    hover: '#3730A3',
    light: '#EEF2FF',
    border: '#C7D2FE',
  },
  gold: {
    brand: '#D4A017',
    hover: '#B8860B',
    light: '#FEF9C3',
    border: '#FDE047',
  },
  charcoal: {
    dark: '#1E1B1A',
    muted: '#2D2928',
    border: '#3F3B3A',
  },
  status: {
    success: {
      bg: '#ECFDF5',
      text: '#047857',
      border: '#A7F3D0',
      dot: '#10B981',
    },
    warning: {
      bg: '#FFFBEB',
      text: '#B45309',
      border: '#FDE68A',
      dot: '#F59E0B',
    },
    danger: {
      bg: '#FEF2F2',
      text: '#B91C1C',
      border: '#FECACA',
      dot: '#EF4444',
    },
    neutral: {
      bg: '#F1F5F9',
      text: '#475569',
      border: '#E2E8F0',
      dot: '#64748B',
    },
    primary: {
      bg: '#EEF2FF',
      text: '#4338CA',
      border: '#C7D2FE',
      dot: '#4338CA',
    },
    gold: {
      bg: '#FEF9C3',
      text: '#854D0E',
      border: '#FDE047',
      dot: '#D4A017',
    },
  },
} as const

export const typography = {
  headingFont: 'Poppins, system-ui, sans-serif',
  bodyFont: 'Inter, system-ui, sans-serif',
} as const

export const radii = {
  button: 'rounded-full',
  card: 'rounded-2xl',
  iconBadge: 'rounded-xl',
  input: 'rounded-xl',
  badge: 'rounded-full',
} as const
