import fs from "fs";
import path from "path";
import os from "os";

/**
 * Lists all MiToDos project files in ~/wiki/mitodos/
 */
export default async function () {
  const mitodosDir = path.join(os.homedir(), "wiki", "mitodos");

  try {
    if (!fs.existsSync(mitodosDir)) {
      return "MiToDos directory not found";
    }

    const files = fs
      .readdirSync(mitodosDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", ""));

    return files.length > 0 ? files : "No MiToDos files found";
  } catch (error) {
    return `Error listing MiToDos files: ${String(error)}`;
  }
}
