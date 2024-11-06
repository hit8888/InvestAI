import twForms from "@tailwindcss/forms";
import twTypography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import twAnimate from "tailwindcss-animate";
import colors from "tailwindcss/colors";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: {
          ...colors.gray,
          25: "#FCFCFD",
          50: "#F9FAFB",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          50: "#F4F3FF",
          100: "#EBE9FE",
          200: "#D9D6FE",
          300: "#BDB4FE",
          500: "#A6A2ED",
          1000: "#4E46DC",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        link: "#2E90FA",
        alerts: {
          50: "#FEF3F2",
          500: "#F04438",
        },
        success: {
          50: "#ECFDF3",
          600: "#039855",
          800: "#05603A",
        },
      },
      animation: {
        ripple: "ripple 1s infinite ease-in-out",
        wave: "wave 1.5s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-rotate": "gradient-rotate 3s linear infinite",
      },
      keyframes: {
        ripple: {
          "0%": {
            transform: "scale(.8)",
            opacity: 0.5,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            transform: "scale(2.2)",
            opacity: 0,
          },
        },
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "15%": { transform: "rotate(14.0deg)" },
          "30%": { transform: "rotate(-8.0deg)" },
          "40%": { transform: "rotate(14.0deg)" },
          "50%": { transform: "rotate(-4.0deg)" },
          "60%": { transform: "rotate(10.0deg)" },
          "70%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-rotate": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },
      borderRadius: {
        'custom-56': '56px',
      },
    },
  },
  plugins: [twTypography, twForms, twAnimate],
};

export default config;
