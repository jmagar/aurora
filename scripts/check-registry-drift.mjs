import { spawnSync } from "node:child_process"

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: false,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run("pnpm", ["run", "registry:build"])
run("git", ["diff", "--exit-code", "--", "registry.json", "public/r"])
