/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#013364",
          50: "#e6ecf3",
          100: "#c0d0e2",
          200: "#96b1cf",
          300: "#6b91bb",
          400: "#4b79ac",
          500: "#2b619d",
          600: "#265790",
          700: "#1e497e",
          800: "#173b6c",
          900: "#013364",
          950: "#01203f"
        },
        approved: "#1a9c5a",
        pending: "#e6a017",
        rejected: "#d43d3d",
        draft: "#8a8f98",
        accent: {
          DEFAULT: "#4d8f72",
          dark: "#3f7760",
        },
      },
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(1, 51, 100, 0.08)",
        nav: "0 -2px 12px rgba(1, 51, 100, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      }
    },
  },
  plugins: [],
}
