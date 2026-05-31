# Aurora for nano

`nanorc` — the full nano config with Aurora **interface** colors (title bar,
status, errors, selection, line numbers, shortcut keys, scrollbar).

## Important: named colors only

The nano build on the primary host is compiled `--enable-utf8` only and
**rejects `#hex` and 256-index color codes** — it accepts only nano's *named*
palette. So these are nano's nearest named matches to Aurora:

| Aurora | nano name |
|--------|-----------|
| cyan | `cyan` |
| teal | `teal` |
| rose | `pink` / `rosy` |
| amber | `ocher` |
| muted / dim | `grey` / `slate` |
| deep-blue | `lagoon` |
| navy bg | `black` |

The named colors resolve through the **terminal's palette**, so on an Aurora
terminal they land on the real Aurora hues. A nano built with full color support
could use the exact hex instead.

Syntax highlighting itself comes from the included `/usr/share/nano/*.nanorc`
(palette-named), so it also tracks the terminal palette.

## Install

```sh
cp shell/nano/nanorc ~/.nanorc
```

## Source of truth

`shell/nano/nanorc` is canonical; `~/.nanorc` is a deployed copy.
