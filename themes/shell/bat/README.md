# Aurora for bat

`Aurora.tmTheme` — a Sublime/TextMate theme for [bat](https://github.com/sharkdp/bat):
navy bg, cyan keywords, teal strings, amber numbers, violet language constants,
rose attributes, muted italic comments, error-red invalid tokens.

## Two ways to use it

**1. Custom theme (preferred, where bat supports it):**

```sh
mkdir -p "$(bat --config-dir)/themes"
cp themes/shell/bat/Aurora.tmTheme "$(bat --config-dir)/themes/"
bat cache --build
# ~/.config/bat/config:
#   --theme="Aurora"
# or: export BAT_THEME="Aurora"
```

**2. `--theme=ansi` (fallback):** some bat builds ship **without the `cache`
subcommand** (e.g. the mise `0.26.1` musl build — `bat cache --build` fails).
There, custom themes can't be registered, so set:

```
--theme=ansi
```

bat then paints with the **terminal's 16 ANSI colors** — which are Aurora if your
terminal uses the Aurora palette (see [`themes/editors/warp`](../../editors/warp)). This
is the active setup on the primary host.

This theme also colors `bat -l man` (your `MANPAGER`) and fzf `bat` previews.

## Source of truth

`themes/shell/bat/Aurora.tmTheme` is canonical.
