import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        integralCF: ["var(--font-integralCF)"],
        satoshi: ["var(--font-satoshi)"],
      },
      screens: {
        xs: "375px",
      },
      width: {
        frame: "77.5rem",
      },
      maxWidth: {
        frame: "77.5rem",
        "24": "6.625rem",
        "40": "9.688rem",
        "42": "11.188rem",
        "48": "12.375rem",
        "52": "13.625rem",
        "60": "30rem",
        "61": "30.625rem",
        "70": "48.125rem",
      },
      minWidth: {
        "60": "30rem",
        "61": "30.625rem",
        "70": "48.125rem",
      },
      height: {
        "50": "31.25rem",
        "64": "40rem",
        "89": "56rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0rem",
        full: "9999px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        black: "#393939",
        light: "#FFFFFF",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        elephant: {
          "50": "#f1f8fa",
          "100": "#dcedf1",
          "200": "#bcdbe5",
          "300": "#8ec1d2",
          "400": "#599fb7",
          "500": "#3d839d",
          "600": "#366b84",
          "700": "#31586d",
          "800": "#2f4b5b",
          "900": "#243642",
          "950": "#182834",
        },
        "fun-green": {
          "50": "#ecfff2",
          "100": "#d2ffe4",
          "200": "#a8ffca",
          "300": "#65ffa3",
          "400": "#1bff73",
          "500": "#00f950",
          "600": "#00d03e",
          "700": "#00a234",
          "800": "#007e2e",
          "900": "#00712d",
          "950": "#003b14",
        },
        "te-papa-green": {
          "50": "#f1fcf8",
          "100": "#d0f7ec",
          "200": "#a1eeda",
          "300": "#6adec3",
          "400": "#3cc5ab",
          "500": "#23a992",
          "600": "#198876",
          "700": "#186d60",
          "800": "#18574f",
          "900": "#16423c",
          "950": "#082b28",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    heroui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            foreground: "#393939",
            primary: {
              DEFAULT: "#1a374d",
              900: "#1a374d",
              800: "#1f4d6d",
              700: "#215a83",
              600: "#2870a1",
              500: "#388cbf",
              400: "#5da7d3",
              300: "#95c5e4",
              200: "#c7dff0",
              100: "#f3f7fc",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#1d2a34",
              900: "#1d2a34",
              800: "#2c404e",
              700: "#304b5c",
              600: "#37576d",
              500: "#406882",
              400: "#5586a2",
              300: "#77a1b9",
              200: "#a6c2d3",
              100: "#d0dee7",
              50: "#eaeff4",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#094E28",
              900: "#094E28",
              800: "#0F5E2B",
              700: "#187531",
              600: "#238C35",
              500: "#30A33A",
              400: "#5EC75E",
              300: "#8CE383",
              200: "#BDF5B0",
              100: "#E0FAD7",
              foreground: "#187531",
            },
            secondary: {
              DEFAULT: "#ACEED6",
              900: "#0B493E",
              800: "#0C594A",
              700: "#0D7C66",
              600: "#0F8C70",
              500: "#1BAE8A",
              400: "#3FC8A2",
              300: "#76DFBE",
              200: "#ACEED6",
              100: "#D4F7E8",
              foreground: "#0D7C66",
            },
          },
        },
      },
    }),
  ],
  safelist: ["backdrop-blur-[2px]"],
};

export default config;
