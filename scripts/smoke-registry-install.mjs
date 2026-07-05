import { createReadStream, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { extname, join } from "node:path"
import { spawn } from "node:child_process"

const localRegistryRoot = join(process.cwd(), "public", "r")
const smokeProfiles = {
  base: ["aurora-base"],
  pages: ["aurora-terminal", "aurora-chat", "aurora-marketplace", "aurora-files"],
  themes: ["aurora-theme-dark", "aurora-theme-light", "aurora-zed-theme", "aurora-warp-theme"],
  agent: ["aurora-agent-skill", "aurora-plugin-installer"],
}

const selectedProfiles = (process.env.AURORA_REGISTRY_SMOKE_PROFILES ?? "base,pages,themes,agent")
  .split(",")
  .map((profile) => profile.trim())
  .filter(Boolean)

const items = (process.env.AURORA_REGISTRY_SMOKE_ITEMS ?? selectedProfiles.flatMap((profile) => smokeProfiles[profile] ?? []).join(","))
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean)
const keepTemp = process.env.AURORA_REGISTRY_SMOKE_KEEP_TEMP === "1"

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
  }, 120_000)

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

  await run("pnpm", [
    "exec",
    "shadcn",
    "add",
    "--yes",
    "--cwd",
    tmp,
    ...items.map((item) => `${registryBaseUrl}/${item}.json`),
  ])

  const expectedByProfile = {
    base: [
      join(tmp, "components", "ui", "aurora", "button.tsx"),
      join(tmp, "components", "aurora", "terminal.tsx"),
    ],
    pages: [
      join(tmp, "app", "aurora", "terminal", "page.tsx"),
      join(tmp, "app", "aurora", "chat", "page.tsx"),
    ],
    themes: [
      join(tmp, ".config", "aurora", "themes", "zed", "aurora.json"),
      join(tmp, ".config", "aurora", "themes", "warp", "aurora.yaml"),
    ],
    agent: [
      join(tmp, ".config", "aurora", "agent", "aurora-design-system", "SKILL.md"),
      join(tmp, ".config", "aurora", "agent", "install-aurora-plugin.sh"),
    ],
  }
  const expectedFiles = selectedProfiles.flatMap((profile) => expectedByProfile[profile] ?? [])

  const missing = expectedFiles.filter((path) => !existsSync(path))
  if (missing.length > 0) {
    throw new Error(`Registry smoke install missed expected files:\n${missing.join("\n")}`)
  }

  console.log(`Aurora registry smoke install passed in ${tmp}`)
} finally {
  server?.close()
  if (!keepTemp) {
    rmSync(tmp, { recursive: true, force: true })
  }
}
