import twForms from "@tailwindcss/forms";
import twTypography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import twAnimate from "tailwindcss-animate";
import colors from "tailwindcss/colors";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      screens: {
        hd: "1280px", // HD - 1280x720
        "mac-air": "1280px", // MacBook Air - 1280x832
        "hd-ready": "1366px", // HD Ready - 1366x768
        desktop: "1440px", // Desktop - 1440x1024
        "mac-pro-14": "1512px", // MacBook Pro 14 - 1512x982
        "hd-plus": "1536px", // HD Plus - 1536x864
        "mac-pro-16": "1728px", // MacBook Pro 16 - 1728x1117
        "full-hd": "1920px", // Full HD Desktop - 1920x1080
        qhd: "2560px", // QHD Desktop - 2560x1440
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
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
        // TODOS: IF NEEDED, WILL REMOVE IT IN NEXT PR - All Keys after textColor
        // TODOS: NEED TO Add HandleColorConfig For Admin Dashboard Pages
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          textColor: "rgb(var(--primary-text))",
          adminBg: "var(--admin-primary-bg)",
          bgHeader: "var(--admin-primary-bg-header)",
          bgGray: "var(--admin-primary-bggray)",
          border: "var(--admin-primary-border)",
          textBlack: "var(--admin-primary-text-black)",
          textCompany: "var(--admin-primary-text-company)",
          textGray: "var(--admin-primary-text-gray)",
          textMain: "var(--admin-primary-text-main)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        customPrimaryText: "#2D3454",
        customSecondaryText: "#5E6583",
        link: "#2E90FA",
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
        numberOfLeadsOuter: "numberOfLeadsOuter 5s infinite", // Outer background animation
        numberOfLeadsInner: "numberOfLeadsInner 5s infinite", // Inner background animation
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
        numberOfLeadsOuter: {
          "0%": { backgroundColor: "#FFFFFF" }, // TODOS: Add THEMING COLORS - Starting from white
          "100%": { backgroundColor: "#DCDAF8" }, // TODOS: Add THEMING COLORS - Ending with the given color
        },
        numberOfLeadsInner: {
          "0%": { backgroundColor: "#4E46DC", opacity: 1 }, // TODOS: Add THEMING COLORS - Starting color and full opacity
          "100%": { backgroundColor: "#4E46DC", opacity: 0.3 }, // TODOS: Add THEMING COLORS - Ending with 30% opacity
        },
      },
      borderRadius: {
        "custom-56": "56px",
      },
    },
  },
  plugins: [twTypography, twForms, twAnimate],
};

export default config;
