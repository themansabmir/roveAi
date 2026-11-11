import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import sharedPreset from "@rove/ui/tailwind-preset"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const uiPackageRoot = path.dirname(require.resolve("@rove/ui/package.json"))

const token = (name: string) => `rgb(var(--rv-${name}-c) / <alpha-value>)`
const rgb = (name: string, alpha = 1) => `rgb(var(--rv-${name}-c) / ${alpha})`

const heading = {
  fontFamily: "var(--font-home-display), system-ui, sans-serif",
  fontVariationSettings: '"opsz" 48, "wdth" 92',
  fontWeight: "600",
  letterSpacing: "-0.025em",
  lineHeight: "1.05",
}

const link = {
  fontWeight: "600",
  color: rgb("brand"),
  textDecorationLine: "underline",
  textDecorationColor: rgb("brand", 0.3),
  textDecorationThickness: "2px",
  textUnderlineOffset: "4px",
  transition: "text-decoration-color 200ms ease",
  "&:hover": { textDecorationColor: rgb("brand") },
}

const button = {
  position: "relative",
  display: "inline-flex",
  minHeight: "2.75rem",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  borderRadius: "0.375rem",
  paddingInline: "1.25rem",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: "600",
  transitionProperty: "transform, background-color, border-color, box-shadow, color",
  transitionDuration: "200ms",
  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  "&:active": { transform: "translateY(1px)" },
}

const designSystem = plugin(({ addComponents }) => {
  addComponents({
    ".rv-container": {
      width: "100%",
      maxWidth: "84rem",
      marginInline: "auto",
      paddingInline: "1.25rem",
      "@media (min-width: 640px)": { paddingInline: "2rem" },
      "@media (min-width: 1024px)": { paddingInline: "3rem" },
    },
    ".rv-display": {
      ...heading,
      fontVariationSettings: '"opsz" 96, "wdth" 88',
      letterSpacing: "-0.035em",
      lineHeight: "0.98",
    },
    ".rv-heading": heading,
    ".rv-kicker": {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
      color: rgb("quiet"),
    },
    ".rv-btn": button,
    ".rv-btn-primary": {
      ...button,
      backgroundColor: rgb("brand"),
      color: "#fff",
      boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.2), 0 8px 24px -12px ${rgb("brand", 0.8)}`,
      "&:hover": { backgroundColor: rgb("brand-deep") },
    },
    ".rv-btn-secondary": {
      ...button,
      border: `1px solid ${rgb("line")}`,
      backgroundColor: rgb("surface"),
      color: rgb("ink"),
      "&:hover": { borderColor: rgb("ink", 0.4) },
    },
    ".rv-btn-on-dark": {
      ...button,
      backgroundColor: rgb("brand-bright"),
      color: rgb("ink"),
      "&:hover": { backgroundColor: "#fff" },
    },
    ".rv-btn-ghost-dark": {
      ...button,
      border: `1px solid ${rgb("ink-line")}`,
      color: "#fff",
      "&:hover": { borderColor: rgb("ink-muted") },
    },
    ".rv-link": link,
    ".rv-prose": {
      maxWidth: "68ch",
      fontSize: "1.0625rem",
      lineHeight: "1.75",
      color: rgb("ink"),
      "& h2": { ...heading, fontSize: "1.875rem", marginTop: "3rem", marginBottom: "1rem" },
      "& h3": { ...heading, fontSize: "1.5rem", marginTop: "2.5rem", marginBottom: "0.75rem" },
      "& p": { marginBottom: "1.25rem" },
      "& a": link,
      "& ul": { listStyleType: "disc", paddingLeft: "1.5rem", marginBottom: "1.25rem" },
      "& ol": { listStyleType: "decimal", paddingLeft: "1.5rem", marginBottom: "1.25rem" },
      "& li + li": { marginTop: "0.5rem" },
      "& blockquote": {
        margin: "2rem 0",
        borderLeft: `2px solid ${rgb("brand")}`,
        paddingLeft: "1.25rem",
        color: rgb("quiet"),
      },
    },
  })
})

const config: Config = {
  presets: [sharedPreset as Config],
  content: ["./src/**/*.{ts,tsx}", path.join(uiPackageRoot, "src/**/*.{ts,tsx}")],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: token("ink"),
          2: token("ink-2"),
          line: token("ink-line"),
          muted: token("ink-muted"),
        },
        paper: token("paper"),
        surface: token("surface"),
        line: token("line"),
        quiet: token("quiet"),
        brand: {
          DEFAULT: token("brand"),
          deep: token("brand-deep"),
          bright: token("brand-bright"),
          tint: token("brand-tint"),
        },
        gate: {
          DEFAULT: token("gate"),
          text: token("gate-text"),
          tint: token("gate-tint"),
        },
      },
      fontFamily: {
        sans: ["var(--font-home-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-home-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-home-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "84rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [designSystem],
}

export default config
