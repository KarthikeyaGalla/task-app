/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        domain: {
          dsa: '#3b82f6', // blue-500
          development: '#22c55e', // green-500
          basic: '#f59e0b', // amber-500
          other: '#6b7280', // gray-500
        },
        mode: {
          hard: '#ef4444', // red-500
          medium: '#f97316', // orange-500
          easy: '#84cc16', // lime-500
        }
      }
    },
  },
  plugins: [],
}
