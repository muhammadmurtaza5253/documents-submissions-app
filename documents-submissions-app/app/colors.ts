/**
 * Color palette for Documents Submissions App
 * All colors are defined here for consistent theming across the application
 */

export const colors = {
  // Primary Colors - Main brand color for primary actions
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },

  // Secondary Colors - For secondary actions and accents
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },

  // Success Colors - For success states, confirmations, completed actions
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
    lightBackground: '#e8f5e9',
  },

  // Error Colors - For errors, destructive actions, warnings
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
    lightBackground: '#ffebee',
  },

  // Warning Colors - For warnings and caution states
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
    lightBackground: '#fff3e0',
  },

  // Info Colors - For informational messages and neutral actions
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
    lightBackground: '#e1f5fe',
  },

  // Neutral/Gray Colors - For backgrounds, borders, text
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    light: '#fafafa',
    dark: '#f5f5f5',
    hover: '#f5f5f5',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd',
    hint: '#9e9e9e',
    inverse: '#ffffff',
  },

  // Border Colors
  border: {
    light: '#e0e0e0',
    main: '#bdbdbd',
    dark: '#9e9e9e',
  },

  // Divider Color
  divider: '#e0e0e0',

  // Status Colors - For document status indicators
  status: {
    pending: {
      main: '#ff9800',
      light: '#ffb74d',
      background: '#fff3e0',
    },
    approved: {
      main: '#2e7d32',
      light: '#4caf50',
      background: '#e8f5e9',
    },
    rejected: {
      main: '#d32f2f',
      light: '#ef5350',
      background: '#ffebee',
    },
    underReview: {
      main: '#0288d1',
      light: '#03a9f4',
      background: '#e1f5fe',
    },
    uploaded: {
      main: '#2e7d32',
      light: '#4caf50',
      background: '#e8f5e9',
    },
  },

  // Action Colors - For specific UI actions
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },

  // Academic/Education Theme Colors (optional - for academic counselling features)
  academic: {
    primary: '#1565c0',
    secondary: '#0277bd',
    accent: '#0288d1',
    light: '#e3f2fd',
  },
} as const;

export type Colors = typeof colors;

