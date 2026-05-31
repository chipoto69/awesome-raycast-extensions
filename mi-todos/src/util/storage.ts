import fs from "fs";
import path from "path";
import os from "os";

export function expandHome(filepath: string): string {
  if (filepath.startsWith("~")) {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

export function resolvePath(base: string): string {
  return path.resolve(expandHome(base));
}

export function ensureDir(dirPath: string): void {
  const resolved = resolvePath(dirPath);
  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }
}

export function fileExists(filepath: string): boolean {
  return fs.existsSync(resolvePath(filepath));
}

export function readFile(filepath: string): string {
  return fs.readFileSync(resolvePath(filepath), "utf-8");
}

export function writeFile(filepath: string, content: string): void {
  const resolved = resolvePath(filepath);
  ensureDir(path.dirname(resolved));
  fs.writeFileSync(resolved, content, "utf-8");
}

export function appendFile(filepath: string, content: string): void {
  const resolved = resolvePath(filepath);
  ensureDir(path.dirname(resolved));
  fs.appendFileSync(resolved, content, "utf-8");
}

const INBOX_HEADING = "## 📋 Inbox";

export function appendToInbox(filepath: string, task: string): string {
  const resolved = resolvePath(filepath);

  if (!fs.existsSync(resolved)) {
    const header = `# MiToDos — ${todayDate()}\n\n${INBOX_HEADING}\n`;
    writeFile(filepath, header);
  }

  const content = readFile(filepath);
  const taskLine = `- [ ] ${task}\n`;

  if (content.includes(INBOX_HEADING)) {
    const lines = content.split("\n");
    const inboxIndex = lines.findIndex((l) => l.trim() === INBOX_HEADING);

    let insertIndex = inboxIndex + 1;
    while (insertIndex < lines.length && lines[insertIndex].startsWith("- [")) {
      insertIndex++;
    }

    lines.splice(insertIndex, 0, taskLine.trimEnd());
    writeFile(filepath, lines.join("\n"));
  } else {
    appendFile(filepath, `\n${INBOX_HEADING}\n${taskLine}`);
  }

  return task;
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const PROJECT_TEMPLATE = `# MiToDos — {{name}}

> Created {{date}}

## 📋 Inbox

## 📁 Tasks

### 🔴 Priority

### 🟡 Medium

### 🟢 Low

## 📊 Notes
`;

export function createProjectFile(wikiPath: string, projectName: string): string {
  const metaDir = resolvePath(path.join(wikiPath, "_meta"));
  ensureDir(metaDir);

  const filename = `mitodos-${projectName.toLowerCase().replace(/\s+/g, "-")}.md`;
  const filepath = path.join(metaDir, filename);

  if (fs.existsSync(filepath)) {
    throw new Error(`Project file already exists: ${filename}`);
  }

  const content = PROJECT_TEMPLATE.replace("{{name}}", projectName).replace("{{date}}", todayDate());
  writeFile(filepath, content);

  return filepath;
}
