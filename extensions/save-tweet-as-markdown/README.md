# Save Tweet as Markdown

Convert any X/Twitter post you're viewing in your browser into clean, well-formatted Markdown and save it locally.

## Features

-  One-click extraction from the current browser tab
-  Clean Markdown formatting
-  Save to default folder (`~/Downloads/Tweets`) or choose a custom location
-  Automatically opens the destination folder after saving
-  Copy Markdown to clipboard as an alternative

## How to Use

1. Open any X/Twitter post in your browser (Chrome, Arc, Safari, etc.)
2. Make sure the **Raycast Browser Extension** is installed
3. Open Raycast and search for **"Save Tweet as Markdown"**
4. Preview the extracted content
5. Choose:
   - **Save to Downloads/Tweets** (default)
   - **Choose Different Folder**
   - **Copy Markdown**

## Requirements

- Raycast (latest version)
- Raycast Browser Extension installed
- Node.js 22.14+

## Installation

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/chipoto69/awesome-raycast-extensions.git
   ```

2. Navigate to the extension:
   ```bash
   cd awesome-raycast-extensions/extensions/save-tweet-as-markdown
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

5. Import into Raycast:
   - Open Raycast → Search for **"Import Extension"**
   - Select the `save-tweet-as-markdown` folder

## Development

```bash
npm run dev
```

This starts the extension in watch mode.

## Folder Structure

```
save-tweet-as-markdown/
├── src/
│   └── save-tweet.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Status

**WIP** — The extension is functional but may receive improvements in formatting, image handling, and author metadata extraction.

## License

MIT
