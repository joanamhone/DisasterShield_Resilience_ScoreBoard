/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#1976D2',
          light: '#42A5F5',
          dark: '#0D47A1',
        },
        accent: {
          DEFAULT: '#F57C00',
          light: '#FFB74D',
          dark: '#E65100',
        },
        success: '#43A047',
        warning: '#FFA000',
        error: '#D32F2F',
        background: '#FAFBFC',
        card: '#FFFFFF',
        surface: '#F8F9FA',
        text: {
          primary: '#1A2027',
          secondary: '#4A5568',
          tertiary: '#718096',
          disabled: '#A0AEC0',
        },
        border: '#E2E8F0',
        divider: '#CBD5E0',
        // Updated risk colors to match the green, yellow, red scheme
        risk: {
          low: '#43A047',    // Green for okay/low risk
          medium: '#FFA000',  // Yellow for medium risk
          high: '#D32F2F',    // Red for high risk
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }
    },
  },
  plugins: [],
}
