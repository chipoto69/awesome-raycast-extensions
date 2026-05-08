# Awesome Raycast Extensions

A collection of high-quality, well-maintained Raycast extensions built for productivity and automation.

## Repository Structure

```
awesome-raycast-extensions/
├── extensions/                 # All extensions live here
│   ├── save-tweet-as-markdown/
│   ├── another-extension/
│   └── ...
├── .gitignore
├── README.md
└── DEVELOPMENT.md
```

## Available Extensions

| Extension | Description | Status |
|-----------|-------------|--------|
| [Save Tweet as Markdown](./extensions/save-tweet-as-markdown) | Convert any X/Twitter post to clean Markdown and save it locally | ✅ Active (WIP) |

## Getting Started

### Prerequisites

- Raycast (latest version)
- Node.js 22.14+
- npm 7+

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/chipoto69/awesome-raycast-extensions.git
   cd awesome-raycast-extensions
   ```

2. Navigate to any extension folder and install dependencies:
   ```bash
   cd extensions/save-tweet-as-markdown
   npm install
   ```

3. Start developing:
   ```bash
   npm run dev
   ```

## How to Add a New Extension

1. Create a new folder inside `extensions/`:
   ```bash
   mkdir extensions/my-new-extension
   ```

2. Initialize the extension using Raycast CLI:
   ```bash
   cd extensions/my-new-extension
   npx @raycast/api@latest create
   ```

3. Follow the standard Raycast extension structure.

4. Update this README with the new extension details.

## How to Build an Extension

```bash
cd extensions/<extension-name>
npm run build
```

## How to Test an Extension

```bash
cd extensions/<extension-name>
npm run dev
```

Then use **Import Extension** in Raycast and select the folder.

## Contribution Guidelines

- Keep extensions focused and single-purpose
- Follow Raycast best practices and UI guidelines
- Include proper error handling and loading states
- Write clear, maintainable TypeScript code
- Update documentation when adding features

## License

MIT
