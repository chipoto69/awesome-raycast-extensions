import {
  Action,
  ActionPanel,
  Detail,
  Form,
  Icon,
  showToast,
  Toast,
  BrowserExtension,
  environment,
  open,
  useNavigation,
} from "@raycast/api";
import { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import os from "os";

export default function SaveTweet() {
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { push } = useNavigation();

  const extractContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!environment.canAccess(BrowserExtension)) {
        throw new Error(
          "Raycast Browser Extension is not installed. Please install it from the Raycast Store."
        );
      }

      const content = await BrowserExtension.getContent({ format: "markdown" });

      if (!content?.trim()) {
        throw new Error("No content could be extracted from the current browser tab.");
      }

      setMarkdown(content.trim());
    } catch (err) {
      const message = String(err);
      setError(message);
      showToast({ style: Toast.Style.Failure, title: "Extraction failed", message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    extractContent();
  }, []);

  const saveMarkdown = async (customFolder?: string) => {
    if (!markdown) return;

    const defaultFolder = path.join(os.homedir(), "Downloads", "Tweets");
    const targetFolder = customFolder || defaultFolder;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `tweet-${timestamp}.md`;
    const filePath = path.join(targetFolder, filename);

    try {
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      fs.writeFileSync(filePath, markdown, "utf8");

      showToast({
        style: Toast.Style.Success,
        title: "Tweet saved!",
        message: filePath,
      });

      await open(targetFolder);
    } catch (err) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to save file",
        message: String(err),
      });
    }
  };

  const showFolderPicker = () => {
    const defaultPath = path.join(os.homedir(), "Downloads", "Tweets");

    push(
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Save to This Folder"
              onSubmit={(values) => {
                saveMarkdown(values.folder);
              }}
            />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="folder"
          title="Save Location"
          defaultValue={defaultPath}
          placeholder="~/Downloads/Tweets"
        />
      </Form>
    );
  };

  if (error) {
    return (
      <Detail
        markdown={`# Error\n\n${error}`}
        actions={
          <ActionPanel>
            <Action title="Try Again" onAction={extractContent} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown || "Extracting content from the current browser tab..."}
      actions={
        markdown && !isLoading ? (
          <ActionPanel>
            <Action
              title="Save to Downloads/Tweets"
              icon={Icon.Download}
              onAction={() => saveMarkdown()}
            />
            <Action
              title="Choose Different Folder"
              icon={Icon.Folder}
              onAction={showFolderPicker}
            />
            <Action.CopyToClipboard title="Copy Markdown" content={markdown} />
            <Action
              title="Refresh"
              icon={Icon.ArrowClockwise}
              onAction={extractContent}
            />
          </ActionPanel>
        ) : null
      }
    />
  );
}
