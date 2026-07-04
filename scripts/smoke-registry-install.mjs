import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const registryBaseUrl = process.env.AURORA_REGISTRY_URL ?? "https://aurora.tootie.tv/r"
const items = (process.env.AURORA_REGISTRY_SMOKE_ITEMS ?? "aurora-tokens,aurora-button,aurora-prompt-input")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean)
const keepTemp = process.env.AURORA_REGISTRY_SMOKE_KEEP_TEMP === "1"

const tmp = mkdtempSync(join(tmpdir(), "aurora-registry-smoke-"))

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: tmp,
    stdio: "inherit",
    shell: false,
    env: process.env,
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? 1}`)
  }
}

try {
  mkdirSync(join(tmp, "app"), { recursive: true })
  mkdirSync(join(tmp, "lib"), { recursive: true })

  writeJson(join(tmp, "package.json"), {
    name: "aurora-registry-smoke",
    private: true,
    type: "module",
    packageManager: "pnpm@10.33.2",
    dependencies: {
      "@tailwindcss/postcss": "^4.3.0",
      clsx: "^2.1.1",
      "tailwind-merge": "^3.3.1",
      tailwindcss: "^4.3.0",
      typescript: "^5.9.2",
    },
  })

  writeJson(join(tmp, "tsconfig.json"), {
    compilerOptions: {
      target: "ES2022",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      paths: {
        "@/*": ["./*"],
      },
    },
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  })

  writeJson(join(tmp, "components.json"), {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "",
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    registries: {
      "@aurora": `${registryBaseUrl}/{name}.json`,
    },
    iconLibrary: "lucide",
  })

  writeFileSync(join(tmp, "app", "globals.css"), '@import "tailwindcss";\n')
  writeFileSync(
    join(tmp, "lib", "utils.ts"),
    'import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n'
  )

  run("pnpm", [
    "dlx",
    "shadcn@latest",
    "add",
    "--yes",
    "--cwd",
    tmp,
    ...items.map((item) => `${registryBaseUrl}/${item}.json`),
  ])

  const expectedFiles = [
    join(tmp, "components", "ui", "aurora", "button.tsx"),
    join(tmp, "components", "aurora", "prompt-input.tsx"),
  ]

  const missing = expectedFiles.filter((path) => !existsSync(path))
  if (missing.length > 0) {
    throw new Error(`Registry smoke install missed expected files:\n${missing.join("\n")}`)
  }

  console.log(`Aurora registry smoke install passed in ${tmp}`)
} finally {
  if (!keepTemp) {
    rmSync(tmp, { recursive: true, force: true })
  }
}
