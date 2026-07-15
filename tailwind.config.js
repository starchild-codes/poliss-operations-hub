/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4fa",
          100: "#dbe6f5",
          200: "#c1d4ee",
          300: "#9bb8e0",
          400: "#7092cc",
          500: "#4f72b8",
          600: "#3a5799",
          700: "#2f457b",
          800: "#283a66",
          900: "#1c2843",
          950: "#131c30",
        },
        institutional: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
