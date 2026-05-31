#!/usr/bin/env python3
"""Generate the Aurora icon theme for Zed: glyph-tile SVGs + icon_themes/aurora.json.

Each file type renders as a rounded tile (category-tinted fill + stroke) with a
short monogram in the category color. Re-run after editing the tables below:

    python3 editors/zed/generate-icons.py
"""
import json, os, pathlib

ROOT = pathlib.Path(__file__).parent
ICONS = ROOT / "icons"
THEMES = ROOT / "icon_themes"

# Aurora neon palette (matches themes/aurora.json dark variant)
CAT = {
    "web":     "#38d2ff",  # cyan      — js/ts/html/css/frameworks
    "systems": "#ffcf6b",  # gold      — rust/go/c/c++/zig
    "script":  "#5ef0d8",  # mint      — py/rb/sh/lua/perl
    "jvm":     "#c4a5ff",  # violet    — java/kotlin/scala/clojure
    "data":    "#6fdcff",  # lt-cyan   — json/yaml/toml/sql/csv
    "docs":    "#ff9ec9",  # rose      — md/txt/pdf/license
    "config":  "#c4a5ff",  # violet    — dotfiles/env/lock/docker
    "media":   "#ff7eb0",  # deep rose — images/audio/video
    "default": "#9ab3c2",  # muted     — fallback
}

# icon_key -> (monogram, category)
ICON = {
    "typescript": ("TS", "web"), "javascript": ("JS", "web"),
    "react": ("JSX", "web"), "vue": ("VUE", "web"), "svelte": ("SV", "web"),
    "astro": ("AS", "web"), "html": ("<>", "web"), "css": ("{}", "web"),
    "sass": ("{}", "web"), "graphql": ("GQL", "web"),
    "rust": ("RS", "systems"), "go": ("GO", "systems"), "c": ("C", "systems"),
    "cpp": ("C+", "systems"), "header": ("H", "systems"), "zig": ("ZIG", "systems"),
    "csharp": ("C#", "systems"), "swift": ("SW", "systems"),
    "python": ("PY", "script"), "ruby": ("RB", "script"), "shell": ("SH", "script"),
    "lua": ("LUA", "script"), "perl": ("PL", "script"), "php": ("PHP", "script"),
    "java": ("JV", "jvm"), "kotlin": ("KT", "jvm"), "scala": ("SC", "jvm"),
    "clojure": ("CLJ", "jvm"),
    "json": ("{}", "data"), "yaml": ("YML", "data"), "toml": ("TOM", "data"),
    "xml": ("XML", "data"), "csv": ("CSV", "data"), "sql": ("DB", "data"),
    "data": ("DAT", "data"),
    "markdown": ("MD", "docs"), "text": ("TXT", "docs"), "pdf": ("PDF", "docs"),
    "doc": ("DOC", "docs"), "license": ("LIC", "docs"), "book": ("BK", "docs"),
    "env": ("ENV", "config"), "lock": ("LK", "config"), "docker": ("DK", "config"),
    "git": ("GIT", "config"), "config": ("CFG", "config"), "settings": ("CFG", "config"),
    "terminal": (">_", "config"), "make": ("MK", "config"), "nix": ("NIX", "config"),
    "image": ("IMG", "media"), "audio": ("AUD", "media"), "video": ("VID", "media"),
    "font": ("Aa", "media"), "svg": ("SVG", "media"),
    "default": ("•", "default"),
}

# extension -> icon_key
SUFFIX = {
    "ts": "typescript", "mts": "typescript", "cts": "typescript", "tsx": "react",
    "js": "javascript", "mjs": "javascript", "cjs": "javascript", "jsx": "react",
    "vue": "vue", "svelte": "svelte", "astro": "astro",
    "html": "html", "htm": "html", "css": "css", "scss": "sass", "sass": "sass",
    "less": "sass", "graphql": "graphql", "gql": "graphql",
    "rs": "rust", "go": "go", "c": "c", "h": "header", "hpp": "header",
    "cpp": "cpp", "cc": "cpp", "cxx": "cpp", "zig": "zig", "cs": "csharp", "swift": "swift",
    "py": "python", "pyi": "python", "rb": "ruby", "sh": "shell", "bash": "shell",
    "zsh": "shell", "fish": "shell", "lua": "lua", "pl": "perl", "pm": "perl", "php": "php",
    "java": "java", "kt": "kotlin", "kts": "kotlin", "scala": "scala", "sc": "scala",
    "clj": "clojure", "cljs": "clojure", "cljc": "clojure",
    "json": "json", "jsonc": "json", "json5": "json",
    "yaml": "yaml", "yml": "yaml", "toml": "toml", "xml": "xml", "csv": "csv", "tsv": "csv",
    "sql": "sql", "parquet": "data", "arrow": "data",
    "md": "markdown", "mdx": "markdown", "markdown": "markdown", "rst": "text",
    "txt": "text", "text": "text", "adoc": "text", "pdf": "pdf",
    "doc": "doc", "docx": "doc", "epub": "book",
    "env": "env", "lock": "lock", "nix": "nix", "mk": "make", "cmake": "make",
    "png": "image", "jpg": "image", "jpeg": "image", "gif": "image", "webp": "image",
    "bmp": "image", "ico": "image", "svg": "svg",
    "mp3": "audio", "wav": "audio", "flac": "audio", "ogg": "audio",
    "mp4": "video", "mkv": "video", "mov": "video", "webm": "video", "avi": "video",
    "ttf": "font", "otf": "font", "woff": "font", "woff2": "font",
}

# exact filename (stem) -> icon_key
STEM = {
    "Dockerfile": "docker", "docker-compose": "docker", "compose": "docker",
    "Makefile": "make", "justfile": "config", "CMakeLists": "make",
    "package": "config", "tsconfig": "config", "components": "config",
    ".gitignore": "git", ".gitattributes": "git", ".gitconfig": "git",
    ".env": "env", ".editorconfig": "config", ".prettierrc": "config",
    "LICENSE": "license", "LICENSE.md": "license", "README": "markdown",
    "Cargo": "config", "go": "config", "flake": "nix", "shell": "nix",
}


def tile_svg(mono: str, color: str) -> str:
    """Rounded tile, low-alpha fill + colored stroke, bold monogram."""
    n = len(mono)
    fs = {1: 8.0, 2: 6.5, 3: 5.0}.get(n, 4.5)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
        f'<rect x="1.5" y="1" width="13" height="14" rx="3.2" fill="{color}26" stroke="{color}" stroke-width="1"/>'
        f'<text x="8" y="11.2" font-family="JetBrains Mono, ui-monospace, monospace" '
        f'font-size="{fs}" font-weight="700" fill="{color}" text-anchor="middle" '
        f'letter-spacing="-0.3">{mono}</text></svg>'
    )


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


FOLDER = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
          '<path fill="#38d2ff" d="M1.5 4.2c0-.7.6-1.2 1.2-1.2h3.3c.4 0 .8.2 1 .5l.7.9h5.6c.7 0 1.2.6 1.2 1.2v6.4c0 .7-.5 1.2-1.2 1.2H2.7c-.6 0-1.2-.5-1.2-1.2z"/></svg>')
FOLDER_OPEN = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
               '<path fill="#6fdcff" d="M1.5 4.2c0-.7.6-1.2 1.2-1.2h3.3c.4 0 .8.2 1 .5l.7.9h5.6c.7 0 1.2.6 1.2 1.2v1H4.4c-.6 0-1.1.4-1.3 1L1.5 12z"/>'
               '<path fill="#38d2ff" d="M3.3 7.8c.2-.5.6-.8 1.1-.8h10.5l-1.6 5.4c-.2.6-.7 1-1.3 1H1.6z"/></svg>')
CHEVRON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
           '<path fill="none" stroke="#9ab3c2" stroke-width="1.5" stroke-linecap="round" '
           'stroke-linejoin="round" d="M6 4l4 4-4 4"/></svg>')
CHEVRON_DOWN = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'
                '<path fill="none" stroke="#9ab3c2" stroke-width="1.5" stroke-linecap="round" '
                'stroke-linejoin="round" d="M4 6l4 4 4-4"/></svg>')


def main():
    ICONS.mkdir(parents=True, exist_ok=True)
    THEMES.mkdir(parents=True, exist_ok=True)

    # tile icons
    for key, (mono, cat) in ICON.items():
        (ICONS / f"{key}.svg").write_text(tile_svg(esc(mono), CAT[cat]))
    # folder + chevron
    (ICONS / "folder.svg").write_text(FOLDER)
    (ICONS / "folder_open.svg").write_text(FOLDER_OPEN)
    (ICONS / "chevron.svg").write_text(CHEVRON)
    (ICONS / "chevron_down.svg").write_text(CHEVRON_DOWN)

    file_icons = {k: {"path": f"icons/{k}.svg"} for k in ICON}
    theme_body = {
        "directory_icons": {"collapsed": "icons/folder.svg", "expanded": "icons/folder_open.svg"},
        "chevron_icons": {"collapsed": "icons/chevron.svg", "expanded": "icons/chevron_down.svg"},
        "file_stems": STEM,
        "file_suffixes": SUFFIX,
        "file_icons": file_icons,
    }
    doc = {
        "$schema": "https://zed.dev/schema/icon_themes/v0.2.0.json",
        "name": "Aurora Icons",
        "author": "jmagar",
        "themes": [
            {"name": "Aurora Icons", "appearance": "dark", **theme_body},
            {"name": "Aurora Icons Light", "appearance": "light", **theme_body},
        ],
    }
    (THEMES / "aurora.json").write_text(json.dumps(doc, indent=2) + "\n")
    print(f"icons: {len(list(ICONS.glob('*.svg')))} svgs")
    print(f"suffixes mapped: {len(SUFFIX)} | stems: {len(STEM)} | icon keys: {len(ICON)}")


if __name__ == "__main__":
    main()
