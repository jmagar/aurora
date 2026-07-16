import assert from "node:assert/strict"
import test from "node:test"

import { isNavigationKey, nextEnabledIndex } from "../registry/aurora/lib/widget-interactions.ts"

test("composite navigation wraps and skips disabled options", () => {
  const disabled = [false, true, false, false]
  assert.equal(nextEnabledIndex(0, "ArrowDown", disabled), 2)
  assert.equal(nextEnabledIndex(3, "ArrowDown", disabled), 0)
  assert.equal(nextEnabledIndex(0, "ArrowUp", disabled), 3)
  assert.equal(nextEnabledIndex(2, "Home", disabled), 0)
  assert.equal(nextEnabledIndex(0, "End", disabled), 3)
})

test("horizontal navigation honors RTL and all-disabled groups", () => {
  assert.equal(nextEnabledIndex(0, "ArrowRight", [false, false], "rtl"), 1)
  assert.equal(nextEnabledIndex(0, "ArrowLeft", [false, false], "rtl"), 1)
  assert.equal(nextEnabledIndex(0, "ArrowDown", [true, true]), -1)
})

test("only supported widget navigation keys are accepted", () => {
  assert.equal(isNavigationKey("ArrowDown"), true)
  assert.equal(isNavigationKey("Escape"), false)
  assert.equal(isNavigationKey("Enter"), false)
})
