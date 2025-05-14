/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        commissioner: ["Commissioner"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        tint: "var(--color-tint)",
        accent: "var(--color-accent)",
        icon: "var(--color-icon)",
        "tab-icon-default": "var(--color-tab-icon-default)",
        "tab-icon-selected": "var(--color-tab-icon-selected)",
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
