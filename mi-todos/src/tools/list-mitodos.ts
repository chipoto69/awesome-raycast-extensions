import fs from "fs";
import path from "path";
import os from "os";

/**
 * Lists all available MiToDos files in the wiki _meta directory.
 */
export default async function () {
  const wikiPath = path.join(os.homedir(), "wiki", "_meta");

  try {
    if (!fs.existsSync(wikiPath)) {
      return "Wiki _meta directory not found";
    }

    const files = fs
      .readdirSync(wikiPath)
      .filter((f) => f.startsWith("mitodos") && f.endsWith(".md"))
      .map((f) => f.replace(".md", ""));

    return files.length > 0 ? files : "No MiToDos files found";
  } catch (error) {
    return `Error listing MiToDos files: ${String(error)}`;
  }
}
