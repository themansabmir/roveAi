import sharedPreset from "@rove/ui/tailwind-preset"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const uiPackageRoot = path.dirname(require.resolve("@rove/ui/package.json"))

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedPreset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    path.join(uiPackageRoot, "src/**/*.{ts,tsx}"),
  ],
}
