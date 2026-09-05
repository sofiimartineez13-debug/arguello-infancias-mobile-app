const tokens = require('./design-tokens.json');

const c = tokens.color;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        arguello: {
          DEFAULT: c.arguello.blue,
          blue: c.arguello.blue,
          'blue-pressed': c.arguello.bluePressed,
          purple: c.arguello.purple,
          teal: c.arguello.teal,
        },
        success: c.semantic.success,
        warning: c.semantic.warning,
        streak: c.semantic.streak,
        info: c.semantic.info,
        critical: {
          DEFAULT: c.semantic.error,
          pressed: c.semantic.errorPressed,
        },
        ink: {
          DEFAULT: c.neutral.textPrimary,
          secondary: c.neutral.textSecondary,
          disabled: c.neutral.textDisabled,
        },
        line: c.neutral.border,
        surface: c.neutral.surface,
        canvas: c.neutral.background,
        'badge-success-bg': c.badge.successBg,
        'badge-success-text': c.badge.successText,
        'badge-pending-bg': c.badge.pendingBg,
        'badge-pending-text': c.badge.pendingText,
        'badge-progress-bg': c.badge.progressBg,
        'badge-progress-text': c.badge.progressText,
        'badge-locked-bg': c.badge.lockedBg,
        'badge-locked-text': c.badge.lockedText,
      },
      fontFamily: {
        sans: ['Poppins-Regular', 'sans-serif'],
        medium: ['Poppins-Medium', 'sans-serif'],
        semibold: ['Poppins-SemiBold', 'sans-serif'],
        bold: ['Poppins-Bold', 'sans-serif'],
      },
      fontSize: {
        caption: ['11px', { lineHeight: '15px' }],
        'body-sm': ['13px', { lineHeight: '20px' }],
        'body-md': ['14px', { lineHeight: '22px' }],
        'body-lg': ['16px', { lineHeight: '26px' }],
        h4: ['16px', { lineHeight: '22px' }],
        h3: ['20px', { lineHeight: '26px' }],
        h2: ['24px', { lineHeight: '31px' }],
        h1: ['32px', { lineHeight: '38px' }],
      },
    },
  },
  plugins: [],
};
