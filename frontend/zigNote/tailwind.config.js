/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Colors used in the project
      colors: {
        primary: "#2563EB", // Primary blue
        secondary: "#F97316", // Accent orange
        cream: "#FAF7F2",
        surface: "#FFFFFF",
        ink: "#0F172A",
      },
    },
  },
  plugins: [],
}

