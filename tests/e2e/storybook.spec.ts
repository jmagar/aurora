import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const stories = [
  { id: "aurora-interaction-contracts--combobox-keyboard", assert: async (page: import("@playwright/test").Page) => expect(page.getByRole("button", { name: /Beta/i })).toBeFocused() },
  { id: "aurora-interaction-contracts--radio-group-keyboard", assert: async (page: import("@playwright/test").Page) => expect(page.getByRole("radio", { name: "Beta" })).toBeChecked() },
  {
    id: "aurora-interaction-contracts--popover-focus-and-escape",
    assert: async (page: import("@playwright/test").Page) => {
      const trigger = page.getByRole("button", { name: "Open" })
      // Storybook starts play functions after the iframe is ready. On a cold,
      // contended runner that can outlive Playwright's default assertion
      // timeout, so wait for a marker set only after every play assertion.
      await expect(trigger).toHaveAttribute("data-interaction-complete", "true", { timeout: 30_000 })
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
      await expect(trigger).toBeFocused()
    },
  },
] as const

for (const story of stories) {
  test(`${story.id} completes its interaction and strict axe contract`, async ({ page }) => {
    const runtimeErrors: string[] = []
    page.on("pageerror", (error) => runtimeErrors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text())
    })
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: "networkidle" })
    await expect(page.locator("#storybook-root")).toBeVisible()
    await story.assert(page)
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()
    expect(results.violations).toEqual([])
    expect(runtimeErrors).toEqual([])
  })
}
