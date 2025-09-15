// Application configuration

export const APP_CONFIG = {
  // App metadata
  name: 'Veridion',
  description: 'Unique Humanity Score Verification Platform',
  version: '1.0.0',
  
  // UI configuration
  ui: {
    theme: 'dark',
    primaryColor: '#494948',
    accentColor: '#B7B6B6',
    errorColor: '#ef4444',
    successColor: '#22c55e',
  },
  
  // Layout configuration
  layout: {
    headerHeight: '88px',
    sidebarWidth: '280px',
    maxContentWidth: '1200px',
  },
  
  // Animation configuration
  animations: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Type exports
export type AppConfig = typeof APP_CONFIG;
