import { getPreferenceValues, showHUD, showToast, Toast } from "@raycast/api";
import { expandHome, resolvePath, createProjectFile } from "./util/storage";

interface Preferences {
  wikiPath: string;
}

export default async function Command(props: { arguments: { name: string } }) {
  const prefs = getPreferenceValues<Preferences>();
  const wikiPath = resolvePath(expandHome(prefs.wikiPath));
  const name = props.arguments.name.trim();

  if (!name) {
    await showToast({ style: Toast.Style.Failure, title: "Project name cannot be empty" });
    return;
  }

  try {
    const filepath = createProjectFile(wikiPath, name);
    await showHUD(`✓ Project: ${name}\n${filepath}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("already exists")) {
      await showToast({ style: Toast.Style.Failure, title: "Project already exists", message: msg });
    } else {
      await showToast({ style: Toast.Style.Failure, title: "Failed to create project", message: msg });
    }
  }
}
