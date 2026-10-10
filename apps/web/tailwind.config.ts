import type { Config } from "tailwindcss"
import sharedPreset from "@rove/ui/tailwind-preset"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const uiPackageRoot = path.dirname(require.resolve("@rove/ui/package.json"))

const config: Config = {
  presets: [sharedPreset as Config],
  content: [
    "./src/**/*.{ts,tsx}",
    path.join(uiPackageRoot, "src/**/*.{ts,tsx}"),
  ],
}

export default config
