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
        warning: {
          25: "#FFFCF9",
          50: "#FFF9F2",
          100: "#FFF4E5",
          200: "#FFE9CC",
          300: "#FFDEB2",
          400: "#FFD399",
          500: "#FFC880",
          600: "#FFBD66",
          700: "#FFB24D",
          800: "#FFA733",
          900: "#FF9C1A",
          1000: "#FF9100",
        },
        destructive: {
          25: "#FFFAFA",
          50: "#FEF6F5",
          100: "#FEECEB",
          200: "#FCDAD7",
          300: "#FBC7C3",
          400: "#F9B4AF",
          500: "#F8A29B",
          600: "#F68F87",
          700: "#F57C74",
          800: "#F36960",
          900: "#F2574C",
          1000: "#F04438",
        },
        positive: {
          25: "#F9FDFB",
          50: "#F3FBF8",
          100: "#E7F8F0",
          200: "#D0F1E1",
          300: "#B8E9D2",
          400: "#A0E2C3",
          500: "#89DBB4",
          600: "#71D4A6",
          700: "#59CD97",
          800: "#41C588",
          900: "#2ABE79",
          1000: "#12B76A",
        },
        orange_sec: {
          ...colors.orange,
          25: "#FFFBF9",
          50: "#FFF7F3",
          100: "#FFF0E7",
          200: "#FEE0D0",
          300: "#FED1B8",
          400: "#FDC1A1",
          500: "#FDB289",
          600: "#FDA372",
          700: "#FC935B",
          800: "#FC8443",
          900: "#FB742C",
          1000: "#EC4A0A",
        },
        lavender: {
          25: "#FDFDFF",
          50: "#FBFAFF",
          100: "#F6F6FF",
          200: "#EEEDFF",
          300: "#E5E4FF",
          400: "#DDDBFF",
          500: "#D4D1FF",
          600: "#CBC8FF",
          700: "#C3BFFF",
          800: "#BAB6FF",
          900: "#B2ADFF",
          1000: "#A9A4FF",
        },
        rose_sec: {
          ...colors.rose,
          25: "#FEFDFF",
          50: "#FDFBFF",
          100: "#FBF7FF",
          200: "#F8EFFE",
          300: "#F5E6FE",
          400: "#F1DEFE",
          500: "#EDD6FD",
          600: "#EACEFD",
          700: "#E7C6FD",
          800: "#E3BDFD",
          900: "#E0B5FC",
          1000: "#DCADFC",
        },
        pink_sec: {
          ...colors.pink,
          25: "#FEFAFC",
          50: "#FDF4F9",
          100: "#FCE9F4",
          200: "#F8D3E9",
          300: "#F5BEDE",
          400: "#F1A8D3",
          500: "#EE92C8",
          600: "#EB7CBD",
          700: "#E766B2",
          800: "#E451A6",
          900: "#E03B9B",
          1000: "#DD2590",
        },
        blue_sec: {
          ...colors.blue,
          25: "#FAFCFF",
          50: "#F5F9FF",
          100: "##EAF4FE",
          200: "#D5E9FE",
          300: "#C0DEFD",
          400: "#ABD3FD",
          500: "#96C7FD",
          600: "#82BCFC",
          700: "#6DB1FC",
          800: "#58A6FB",
          900: "#439BFB",
          1000: "#2E90FA",
        },
        bluelight: {
          25: "#FBFEFF",
          50: "#F8FCFF",
          100: "#F1F9FF",
          200: "#E2F4FE",
          300: "#D4EFFE",
          400: "#C5E9FE",
          500: "#B7E3FD",
          600: "#A9DEFD",
          700: "#9AD9FD",
          800: "#8CD3FD",
          900: "#7DCEFC",
          1000: "#6FC8FC",
        },
        bluegray: {
          25: "#FBFBFD",
          50: "#F6F7FB",
          100: "#EDEFF6",
          200: "#DCDEED",
          300: "#CACEE4",
          400: "#B8BDDB",
          500: "#A6ADD3",
          600: "#959DCA",
          700: "#838CC1",
          800: "#717CB8",
          900: "#606BAF",
          1000: "#4E5BA6",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
          textColor: "rgb(var(--primary-text))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        customPrimaryText: "#2D3454",
        customSecondaryText: "#5E6583",
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
        "custom-56": "56px",
        "custom-50": "50px",
      },
      opacity: {
        "2.5": "0.025", // Add 2.5% opacity
      },
    },
  },
  plugins: [twTypography, twForms, twAnimate],
};

export default config;
