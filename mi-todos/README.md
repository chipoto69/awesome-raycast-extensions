# MiToDos

> **Markdown-based task manager for Raycast.** No database. No API. Just `.md` files.

Capture tasks instantly from anywhere in Raycast, route them into projects, and search across them with ripgrep. Your tasks live in `~/MiToDos/` — plain markdown, version-controllable, AI-readable.

## Commands

| Command | Description |
|---|---|
| **Add Task** | Quick-capture a task. Pick a project from the dropdown or drop it in the inbox. Supports ripgrep-powered search across all tasks. |
| **Create Project** | Scaffold a new `project-name.md` with inbox, priority lanes, and notes sections. |
| **Search MiToDos** | Search across all MiToDos files with ripgrep (fast, respects `.gitignore`). Falls back to grep if ripgrep is not installed. QMD semantic search augments results when available. |

## File Layout

```
~/MiToDos/
├── inbox.md         ← default target for quick capture
├── content-os.md    ← project: mi project content-os
├── hermes.md        ← project: mi project hermes
└── synthia.md       ← project: mi project synthia
```

Files are named by purpose. No prefixes — the directory already scopes the namespace.

## Setup

1. **Install from Raycast Store** (no configuration needed for basic use).
2. **Set preferences** (optional):
   - `MiToDos Directory`: where your `.md` files live (default: `~/MiToDos/`)
   - `Wiki Vault Path`: your Obsidian vault for cross-search (default: `~/wiki/`)
3. **Install ripgrep** (optional, but recommended for fast search):
   ```bash
   brew install ripgrep
   ```
4. **Install QMD** (optional, for semantic wiki search alongside MiToDos).

## Task Routing

When you run **Add Task**, a dropdown lets you choose where the task lands:

| Selection | Writes to |
|---|---|
| 📋 Inbox | `~/MiToDos/inbox.md` |
| 📁 content-os | `~/MiToDos/content-os.md` |
| 📁 hermes | `~/MiToDos/hermes.md` |

Selecting a project that doesn't have a file yet auto-creates it with the template (inbox section, priority lanes, notes).

## Why Markdown?

- **Portable**: Open with any text editor. View in Obsidian. Grep from the terminal.
- **Versionable**: Drop `~/MiToDos/` into any git repo. Track task history.
- **Agent-friendly**: LLMs can read and write the format natively — no API needed.
- **Fast**: Searching ~/MiToDos/ with ripgrep takes milliseconds even with hundreds of files.

## Development

```bash
git clone https://github.com/chipoto69/awesome-raycast-extensions
cd awesome-raycast-extensions/mi-todos
npm install
npm run dev
```

## License

MIT
