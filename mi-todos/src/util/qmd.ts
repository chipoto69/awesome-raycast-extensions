import { execSync } from "child_process";
import { resolvePath, readFile } from "./storage";

export interface QmdResult {
  path: string;
  snippet: string;
  score: number;
}

function isQmdAvailable(): boolean {
  try {
    execSync("HOME=/Users/rudlord qmd status", { encoding: "utf-8", timeout: 3000, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Search MiToDos directory with grep (primary — fast, always works).
 * QMD is available as a secondary option if a collection exists.
 */
export function searchMitodos(mitodosDir: string, query: string, limit = 20): QmdResult[] {
  const dir = resolvePath(mitodosDir);
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  try {
    // Grep across all .md files in the MiToDos directory
    const word = words[0].replace(/[^\w-]/g, "");
    const cmd = `grep -ril "${word}" "${dir}" --include="*.md" 2>/dev/null | head -${limit}`;

    const output = execSync(cmd, { encoding: "utf-8", timeout: 5000 });
    const paths = output.trim().split("\n").filter(Boolean);

    return paths.map((filepath) => {
      let snippet = "";
      try {
        const content = readFile(filepath);
        const idx = content.toLowerCase().indexOf(word.toLowerCase());
        if (idx >= 0) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(content.length, idx + word.length + 100);
          snippet = (start > 0 ? "…" : "") + content.slice(start, end).replace(/\n/g, " ").trim() + (end < content.length ? "…" : "");
        }
      } catch {
        snippet = `(match: ${word})`;
      }
      return { path: filepath, snippet, score: 0.7 };
    });
  } catch {
    return [];
  }
}

/**
 * Search the wiki vault with QMD (secondary — only if QMD is available).
 */
export function searchWikiWithQmd(wikiPath: string, query: string, limit = 10): QmdResult[] {
  if (!isQmdAvailable()) return [];

  const resolved = resolvePath(wikiPath);
  try {
    const cmd = `HOME=/Users/rudlord qmd search "${query.replace(/"/g, '\\"')}" --json --limit ${limit}`;
    const output = execSync(cmd, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env, HOME: "/Users/rudlord" },
    });
    const parsed = JSON.parse(output);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter QMD results to only wiki paths
      return parsed.filter(
        (r: QmdResult) => r.path && (r.path.startsWith(resolved) || r.path.includes("/wiki/")),
      ).slice(0, limit);
    }
    return [];
  } catch {
    return [];
  }
}
