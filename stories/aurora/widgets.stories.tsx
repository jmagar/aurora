import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, within } from "storybook/test"

import { Combobox } from "@/registry/aurora/ui/combobox"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/registry/aurora/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group"

const meta = { title: "Aurora/Interaction Contracts", parameters: { layout: "centered" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const ComboboxKeyboard: Story = {
  render: () => <div className="w-80"><Combobox options={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button")
    await userEvent.click(trigger)
    const input = canvas.getByRole("combobox")
    await expect(input).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(trigger).toHaveTextContent("Beta")
    await expect(trigger).toHaveFocus()
  },
}

export const RadioGroupKeyboard: Story = {
  render: () => <RadioGroup defaultValue="alpha" aria-label="Agent"><RadioGroupItem value="alpha">Alpha</RadioGroupItem><RadioGroupItem value="beta">Beta</RadioGroupItem></RadioGroup>,
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole("radio")
    radios[0].focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(radios[1]).toHaveFocus()
    await expect(radios[1]).toHaveAttribute("aria-checked", "true")
    await expect(radios[0]).toHaveAttribute("tabindex", "-1")
  },
}

export const PopoverFocusAndEscape: Story = {
  render: () => <Popover><PopoverAnchor><PopoverTrigger>Open</PopoverTrigger><PopoverContent><button type="button">First Action</button></PopoverContent></PopoverAnchor></Popover>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Open" })
    await userEvent.click(trigger)
    await expect(canvas.getByRole("button", { name: "First Action" })).toHaveFocus()
    await userEvent.keyboard("{Escape}")
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
  },
}
