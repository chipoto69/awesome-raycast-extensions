import { execSync } from "child_process";
import { resolvePath } from "./storage";

export interface QmdResult {
  path: string;
  snippet: string;
  score: number;
}

export function isQmdAvailable(): boolean {
  try {
    execSync("which qmd", { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

export function qmdSearch(query: string, wikiPath: string, limit = 20): QmdResult[] {
  const resolved = resolvePath(wikiPath);
  const cmd = `HOME=/Users/rudlord qmd search "${query.replace(/"/g, '\\"')}" --path "${resolved}" --json --limit ${limit}`;

  try {
    const output = execSync(cmd, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env, HOME: "/Users/rudlord" },
    });
    const parsed = JSON.parse(output);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export function grepSearch(query: string, wikiPath: string, limit = 20): QmdResult[] {
  const resolved = resolvePath(wikiPath);
  try {
    const words = query.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const primaryWord = words[0].replace(/[^a-zA-Z0-9_-]/g, "");
    const cmd = `grep -ril "${primaryWord}" "${resolved}/_meta/" "${resolved}/" --include="*.md" 2>/dev/null | head -${limit}`;

    const output = execSync(cmd, { encoding: "utf-8", timeout: 5000 });
    const lines = output.trim().split("\n").filter(Boolean);

    return lines.map((filepath) => ({
      path: filepath,
      snippet: `(grep match: ${primaryWord})`,
      score: 0.5,
    }));
  } catch {
    return [];
  }
}

export function search(query: string, wikiPath: string, limit = 20): { results: QmdResult[]; method: "qmd" | "grep" | "none" } {
  if (isQmdAvailable()) {
    const results = qmdSearch(query, wikiPath, limit);
    if (results.length > 0) return { results, method: "qmd" };
  }

  const grepResults = grepSearch(query, wikiPath, limit);
  if (grepResults.length > 0) return { results: grepResults, method: "grep" };

  return { results: [], method: "none" };
}
