# Development Guide

This document explains how to develop, build, and maintain extensions in this repository.

## Repository Philosophy

This is a **monorepo** for Raycast extensions. Each extension lives in its own folder under `extensions/`. This structure makes it easy to:

- Share common utilities across extensions (future)
- Maintain consistent tooling and configuration
- Keep the repository organized as it grows

## Folder Structure

```
extensions/
├── save-tweet-as-markdown/          # One extension per folder
│   ├── src/
│   │   └── save-tweet.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                    # Extension-specific documentation
├── another-extension/
└── ...
```

## Creating a New Extension

### Recommended Method (Using Raycast CLI)

```bash
# 1. Create the extension folder
mkdir extensions/my-awesome-extension
cd extensions/my-awesome-extension

# 2. Use Raycast's official template
npx @raycast/api@latest create
```

### Manual Setup

If you prefer manual setup, create these files:

- `package.json`
- `tsconfig.json`
- `src/<command>.tsx`
- `README.md`

## Building Extensions

Every time you make changes, you **must** build the extension:

```bash
cd extensions/<extension-name>
npm run build
```

Or using the Raycast CLI directly:

```bash
./node_modules/.bin/ray build
```

## Development Workflow

### Recommended: Watch Mode

```bash
cd extensions/<extension-name>
npm run dev
```

This keeps the extension in watch mode and rebuilds automatically on file changes.

### Alternative: Manual Build

```bash
npm run build
```

Then reload the extension in Raycast.

## Testing Extensions

1. Open Raycast
2. Search for **"Import Extension"**
3. Select the extension folder (e.g. `extensions/save-tweet-as-markdown`)
4. The extension will appear in your Raycast search

## Best Practices

### Code Quality
- Use TypeScript strictly
- Handle loading states with `isLoading`
- Show proper error toasts using `showToast`
- Prefer `@raycast/utils` hooks (`usePromise`, `useCachedPromise`, `useForm`, etc.)

### UI/UX
- Follow Raycast's design system
- Use the Action Panel (`⌘K`) for secondary actions
- Provide clear feedback to users

### Git Workflow
- Use descriptive commit messages
- Prefix WIP extensions with `WIP:`
- Keep commits focused (one feature/fix per commit)

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Build the extension |
| `npm run dev` | Start development mode |
| `npm run lint` | Run linter |
| `./node_modules/.bin/ray build` | Build using Raycast CLI |

## Troubleshooting

### "Could not find command's executable JS file"
→ You forgot to build the extension. Run `npm run build`.

### Extension not appearing after import
→ Make sure you selected the correct folder (the one containing `package.json`).

### TypeScript errors
→ Run `npm install` to ensure all dependencies are installed.

## Publishing to Raycast Store

When an extension is ready for public release:

1. Make sure it follows all Raycast guidelines
2. Run `npm run publish` (or use the Raycast CLI)
3. Submit via the Raycast Store dashboard

## Questions?

Open an issue in this repository or contact the maintainer.
