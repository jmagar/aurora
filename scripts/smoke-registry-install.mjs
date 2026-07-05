import { createReadStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { extname, join } from "node:path"
import { spawn } from "node:child_process"

const localRegistryRoot = join(process.cwd(), "public", "r")
const smokeProfiles = {
  base: {
    items: ["aurora-base"],
    expectedFiles: ["components/ui/aurora/button.tsx", "components/aurora/terminal.tsx"],
  },
  pages: {
    items: [
      "aurora-terminal",
      "aurora-gateway",
      "aurora-chat",
      "aurora-login",
      "aurora-marketplace",
      "aurora-log-viewer",
      "aurora-palette",
      "aurora-sidebar",
      "aurora-files",
    ],
    expectedFiles: [
      "app/aurora/terminal/page.tsx",
      "app/aurora/gateway/page.tsx",
      "app/aurora/chat/page.tsx",
      "app/aurora/login/page.tsx",
      "app/aurora/marketplace/page.tsx",
      "app/aurora/log-viewer/page.tsx",
      "app/aurora/palette/page.tsx",
      "app/aurora/sidebar/page.tsx",
      "app/aurora/files/page.tsx",
    ],
  },
  themes: {
    items: [
      "aurora-theme-dark",
      "aurora-theme-light",
      "aurora-zed-theme",
      "aurora-warp-theme",
      "aurora-chrome-theme",
      "aurora-shell-theme-pack",
    ],
    expectedFiles: [
      ".config/aurora/themes/zed/aurora.json",
      ".config/aurora/themes/warp/aurora.yaml",
      ".config/aurora/themes/warp/aurora.jpg",
      ".config/aurora/themes/chrome/README.md",
      ".config/aurora/themes/shell/README.md",
    ],
  },
  agent: {
    items: ["aurora-agent-skill", "aurora-plugin-installer"],
    expectedFiles: [
      ".config/aurora/agent/aurora-design-system/SKILL.md",
      ".config/aurora/agent/aurora-design-system/references/tokens.md",
      ".config/aurora/agent/aurora-design-system/references/components.md",
      ".config/aurora/agent/aurora-design-system/references/recipes.md",
      ".config/aurora/agent/aurora-design-system/references/android.md",
      ".config/aurora/agent/aurora-design-system/references/editor-cli-tokens.md",
      ".config/aurora/agent/install-aurora-plugin.sh",
    ],
  },
}

const selectedProfiles = (process.env.AURORA_REGISTRY_SMOKE_PROFILES ?? "base,pages,themes,agent")
  .split(",")
  .map((profile) => profile.trim())
  .filter(Boolean)

const unknownProfiles = selectedProfiles.filter((profile) => !smokeProfiles[profile])
if (unknownProfiles.length > 0) {
  throw new Error(`Unknown Aurora registry smoke profile(s): ${unknownProfiles.join(", ")}`)
}

const explicitItems = process.env.AURORA_REGISTRY_SMOKE_ITEMS
const items = (explicitItems ?? selectedProfiles.flatMap((profile) => smokeProfiles[profile].items).join(","))
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean)
const expectedFiles = explicitItems ? [] : selectedProfiles.flatMap((profile) => smokeProfiles[profile].expectedFiles)
const keepTemp = process.env.AURORA_REGISTRY_SMOKE_KEEP_TEMP === "1"
const shouldTypecheck = process.env.AURORA_REGISTRY_SMOKE_TYPECHECK !== "0"
const repoPackage = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"))
const repoDeps = repoPackage.dependencies ?? {}
const repoDevDeps = repoPackage.devDependencies ?? {}

const tmp = mkdtempSync(join(tmpdir(), "aurora-registry-smoke-"))
let server

function contentType(path) {
  switch (extname(path)) {
    case ".json":
      return "application/json"
    case ".css":
      return "text/css"
    case ".ts":
    case ".tsx":
      return "text/plain"
    default:
      return "application/octet-stream"
  }
}

async function resolveRegistryBaseUrl() {
  if (process.env.AURORA_REGISTRY_URL) {
    return process.env.AURORA_REGISTRY_URL
  }

  server = createServer((request, response) => {
    const rawPath = new URL(request.url ?? "/", "http://127.0.0.1").pathname
    const filename = rawPath.split("/").pop() || "registry.json"
    const filePath = join(localRegistryRoot, filename)

    if (!existsSync(filePath)) {
      response.writeHead(404)
      response.end("not found")
      return
    }

    response.writeHead(200, { "content-type": contentType(filePath) })
    createReadStream(filePath).pipe(response)
  })

  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })

  const address = server.address()
  if (!address || typeof address === "string") {
    throw new Error("Unable to start local registry server")
  }

  return `http://127.0.0.1:${address.port}`
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

async function run(command, args) {
  const child = spawn(command, args, {
    cwd: tmp,
    stdio: "inherit",
    shell: false,
    env: process.env,
  })

  const timer = setTimeout(() => {
    child.kill("SIGTERM")
  }, 240_000)

  try {
    const status = await new Promise((resolve, reject) => {
      child.once("error", reject)
      child.once("exit", (code, signal) => {
        if (signal) {
          reject(new Error(`${command} ${args.join(" ")} timed out or exited by signal ${signal}`))
          return
        }
        resolve(code)
      })
    })

    if (status !== 0) {
      throw new Error(`${command} ${args.join(" ")} failed with exit code ${status ?? 1}`)
    }
  } finally {
    clearTimeout(timer)
  }
}

try {
  const registryBaseUrl = await resolveRegistryBaseUrl()

  mkdirSync(join(tmp, "app"), { recursive: true })
  mkdirSync(join(tmp, "lib"), { recursive: true })

  writeJson(join(tmp, "package.json"), {
    name: "aurora-registry-smoke",
    private: true,
    type: "module",
    packageManager: "pnpm@10.33.2",
    dependencies: {
      "@tailwindcss/postcss": "^4.3.0",
      clsx: repoDeps.clsx,
      next: repoDeps.next,
      react: repoDeps.react,
      "react-dom": repoDeps["react-dom"],
      "tailwind-merge": repoDeps["tailwind-merge"],
      tailwindcss: "^4.3.0",
      typescript: repoDevDeps.typescript,
    },
    devDependencies: {
      "@types/node": repoDevDeps["@types/node"],
      "@types/react": repoDevDeps["@types/react"],
      "@types/react-dom": repoDevDeps["@types/react-dom"],
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
    join(tmp, "next-env.d.ts"),
    '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// This file is generated by the Aurora registry smoke test.\n'
  )
  writeFileSync(
    join(tmp, "lib", "utils.ts"),
    'import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n'
  )

  await run("pnpm", [
    "exec",
    "shadcn",
    "add",
    "--yes",
    "--cwd",
    tmp,
    ...items.map((item) => `${registryBaseUrl}/${item}.json`),
  ])

  const missing = expectedFiles.map((path) => join(tmp, path)).filter((path) => !existsSync(path))
  if (missing.length > 0) {
    throw new Error(`Registry smoke install missed expected files:\n${missing.join("\n")}`)
  }

  if (items.includes("aurora-theme-dark") || items.includes("aurora-theme-light")) {
    const globals = readFileSync(join(tmp, "app", "globals.css"), "utf8")
    const missingThemeSnippets = [
      "--background: var(--aurora-page-bg);",
      "--foreground: var(--aurora-text-primary);",
      "--primary: var(--aurora-accent-primary);",
    ].filter((snippet) => !globals.includes(snippet))

    if (missingThemeSnippets.length > 0) {
      throw new Error(`Registry smoke install missed theme CSS variables:\n${missingThemeSnippets.join("\n")}`)
    }
  }

  const pluginInstaller = join(tmp, ".config", "aurora", "agent", "install-aurora-plugin.sh")
  if (items.includes("aurora-plugin-installer") && existsSync(pluginInstaller)) {
    await run("bash", ["-n", pluginInstaller])
  }

  if (shouldTypecheck) {
    await run("pnpm", ["exec", "tsc", "--noEmit", "--pretty", "false"])
  }

  console.log(`Aurora registry smoke install passed in ${tmp}`)
} finally {
  server?.close()
  if (!keepTemp) {
    rmSync(tmp, { recursive: true, force: true })
  }
}
