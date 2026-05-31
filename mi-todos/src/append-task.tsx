import {
  Action,
  ActionPanel,
  Form,
  getPreferenceValues,
  showHUD,
  showToast,
  Toast,
} from "@raycast/api";
import { useState } from "react";
import { expandHome, resolvePath, appendToInbox, fileExists } from "./util/storage";

interface Preferences {
  mitodosPath: string;
}

export default function Command(props: { arguments: { text?: string } }) {
  const [taskText, setTaskText] = useState(props.arguments.text || "");
  const prefs = getPreferenceValues<Preferences>();
  const filepath = resolvePath(expandHome(prefs.mitodosPath));

  async function handleSubmit() {
    const trimmed = taskText.trim();
    if (!trimmed) {
      await showToast({ style: Toast.Style.Failure, title: "Task cannot be empty" });
      return;
    }

    try {
      appendToInbox(filepath, trimmed);
      await showHUD(`✓ Added: ${trimmed}`);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to add task",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Task" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="task"
        title="Task"
        placeholder="What needs doing?"
        value={taskText}
        onChange={setTaskText}
        autoFocus
        enableMarkdown={false}
      />
      <Form.Description
        title="File"
        text={fileExists(prefs.mitodosPath) ? filepath : `${filepath} (will be created)`}
      />
    </Form>
  );
}
