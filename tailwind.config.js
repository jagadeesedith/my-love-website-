/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Romantic color palette
        rose: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#ffccd6',
          300: '#ffb8d0',
          400: '#ff85a2',
          500: '#ff6b9d',
          600: '#ff477e',
          700: '#e91e63',
          800: '#c2185b',
          900: '#880e4f',
        },
        pink: {
          50: '#fff5f8',
          100: '#ffe8f0',
          200: '#ffd6e7',
          300: '#ffc4dd',
          400: '#ff9eb5',
          500: '#ff85a2',
          600: '#ff6b8a',
          700: '#f50057',
          800: '#c51162',
          900: '#880e4f',
        },
        crimson: {
          light: '#ff6b6b',
          DEFAULT: '#dc143c',
          dark: '#8b0000',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        handwritten: ['Dancing Script', 'cursive'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'romantic': '0 10px 40px -10px rgba(255, 107, 157, 0.3)',
        'romantic-lg': '0 20px 60px -15px rgba(255, 107, 157, 0.4)',
        'glow': '0 0 30px rgba(255, 107, 157, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-30px) rotate(5deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "heart-beat": "heart-beat 1.5s ease-in-out infinite",
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #ffeef8 0%, #ffd6e7 25%, #ffc4dd 50%, #ffb8d0 75%, #ff9eb5 100%)',
        'soft-pink-gradient': 'linear-gradient(180deg, #fff5f8 0%, #ffe8f0 50%, #ffd9e8 100%)',
        'heart-gradient': 'linear-gradient(135deg, #ff6b9d 0%, #ff85a2 50%, #ffb8d0 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
