/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#0ea5e9",
        dark: {
          DEFAULT: "#1a1a1a",
          light: "#2a2a2a",
          darker: "#0f0f0f"
        },
        light: {
          DEFAULT: "#ffffff",
          dark: "#f3f4f6",
          darker: "#e5e7eb"
        }
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(45deg, #2563eb, #0ea5e9)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}; 