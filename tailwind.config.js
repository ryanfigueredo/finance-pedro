/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#A5B4FC",
        background: "#F9FAFB",
        cards: "#FFFFFF",
        text: "#0F172A",
        "text-light": "#4B5563",
        alert: "#F59E0B",
        error: "#EF4444",
        success: "#10B981",
      },
    },
  },
  plugins: [],
};
