#!/usr/bin/env node
import { copyFileSync } from "node:fs"

copyFileSync(
  new URL("../registry/aurora/styles/aurora.css", import.meta.url),
  new URL("../public/aurora.css", import.meta.url),
)
console.log("Synchronized public/aurora.css from the canonical registry token source.")
