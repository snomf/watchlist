module.exports = {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.js",
  ],
  safelist: [
    'bg-blue-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-teal-500',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'border-primary': 'var(--color-border-primary)',
        'success': 'var(--color-success)',
        'danger': 'var(--color-danger)',
        blue: {
          500: '#3b82f6',
        },
        red: {
          500: '#ef4444',
        },
        yellow: {
          500: '#f59e0b',
        },
        purple: {
          500: '#8b5cf6',
        },
        green: {
          500: '#22c55e',
        },
        orange: {
          500: '#f97316',
        },
        teal: {
          500: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
};
