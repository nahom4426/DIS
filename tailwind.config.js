/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,vue,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: "rgba(148, 97, 253, <alpha-value>)",          // #9461FD
        secondary: "rgba(32, 99, 169, <alpha-value>)",       // Cool blue
        toast: "rgba(255, 193, 7, <alpha-value>)",  

        "text-clr": "rgba(var(--text-clr) / <alpha-value>)",
        accent: "rgba(var(--accent) / <alpha-value>)",
        "base-clr": "rgba(var(--base-clr) / <alpha-value>)",
        "base-clr2": "rgba(var(--base-clr2) / <alpha-value>)",
        "base-clr3": "rgba(var(--base-clr3) / <alpha-value>)",
        "base-clr-4": "rgba(var(--base-clr-4) / <alpha-value>)",
        dark: "rgba(var(--dark) / <alpha-value>)",
        error: "rgba(239, 68, 68, 0.8)",      /* Softer error color */
      },
      fontSize: {
        lg: ["1.25rem", "1.75rem"],
        md: ["1.125rem", "1.575rem"],
        base: ["1rem", "1.4rem"],
        sm: ["0.875rem", "1.225rem"],
        xs: ["0.75rem", "1rem"],
        xxs: ["0.625rem", "0.75rem"],
      },
      spacing: {
        "drawer-width": "var(--drawer-width)",
        "navbar-height": "var(--navbar-height)",
      },
    },
  },
  plugins: [],
};

