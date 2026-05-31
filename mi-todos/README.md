# MiToDos

Markdown-based task manager. No database, no API — just `.md` files in `~/MiToDos/`.

## Commands

| Command | What it does |
|---|---|
| **Add Task** | Quick-capture a task. Pick a project from the dropdown — or drop it in inbox. |
| **Create Project** | Scaffold a new `project-name.md` with inbox, priority lanes, and notes sections. |
| **Search MiToDos** | Grep across your MiToDos directory. Falls back to wiki search via QMD if available. |

## File Layout

```
~/MiToDos/
├── inbox.md       ← default target for quick capture
├── content-os.md  ← project file (mi project content-os)
├── hermes.md      ← project file (mi project hermes)
└── ...
```

Files are named by purpose. No prefixes — the directory already scopes them.

## Setup

1. **Preferences:** Set `MiToDos Directory` (default: `~/MiToDos/`) and `Wiki Vault Path` (default: `~/wiki/`).
2. **Optional:** Install [QMD](https://github.com/garrytan/qmd) to get semantic cross-search into your wiki vault alongside MiToDos results.
3. **Search:** Grep works by default across all your MiToDos files. QMD augments results with relevant wiki content when installed.

## Routing

When you `mi add`:
- Choose **📋 Inbox** → lands in `inbox.md`
- Choose **📁 <project>** → lands in `<project>.md` (auto-created if new)

This keeps tasks organized by context from the moment of capture.
