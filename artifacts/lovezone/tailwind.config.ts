import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 20px 50px rgba(0, 0, 0, .28)",
        glow: "0 0 40px rgba(255, 0, 0, .14)",
      },
    },
  },
  plugins: [],
} satisfies Config;
