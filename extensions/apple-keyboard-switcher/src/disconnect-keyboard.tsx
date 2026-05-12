import { Action, ActionPanel, Detail, Icon, List, showToast, Toast, useNavigation } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { useEffect, useState } from "react";

const execAsync = promisify(exec);

interface Keyboard {
  name: string;
  address: string;
  connected: boolean;
}

async function getConnectedKeyboards(): Promise<Keyboard[]> {
  try {
    const { stdout } = await execAsync("blueutil --paired --format json");
    const devices = JSON.parse(stdout);

    return devices
      .filter((device: any) => 
        device.name?.toLowerCase().includes("keyboard") || 
        device.name?.toLowerCase().includes("magic")
      )
      .map((device: any) => ({
        name: device.name,
        address: device.address,
        connected: device.connected,
      }));
  } catch (error) {
    return [];
  }
}

async function disconnectKeyboard(address: string) {
  await execAsync(`blueutil --disconnect ${address}`);
}

export default function DisconnectKeyboard() {
  const [keyboards, setKeyboards] = useState<Keyboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pop } = useNavigation();

  async function loadKeyboards() {
    setIsLoading(true);
    const connected = await getConnectedKeyboards();
    setKeyboards(connected);
    setIsLoading(false);
  }

  useEffect(() => {
    loadKeyboards();
  }, []);

  async function handleDisconnect(keyboard: Keyboard) {
    try {
      await showToast({
        style: Toast.Style.Animated,
        title: `Disconnecting ${keyboard.name}...`,
      });

      await disconnectKeyboard(keyboard.address);

      await showToast({
        style: Toast.Style.Success,
        title: `${keyboard.name} disconnected`,
        message: "It should now connect to your other Mac",
      });

      // Refresh list
      await loadKeyboards();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to disconnect",
        message: "Make sure blueutil is installed",
      });
    }
  }

  if (keyboards.length === 0 && !isLoading) {
    return (
      <Detail
        markdown={`# No Apple Keyboards Found

**Install blueutil first:**

\`\`\`bash
brew install blueutil
\`\`\`

Then make sure your Magic Keyboard is paired with this Mac.`}
      />
    );
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search keyboards...">
      {keyboards.map((keyboard) => (
        <List.Item
          key={keyboard.address}
          title={keyboard.name}
          subtitle={keyboard.connected ? "Connected" : "Disconnected"}
          icon={Icon.Keyboard}
          accessories={[{ text: keyboard.address }]}
          actions={
            <ActionPanel>
              {keyboard.connected && (
                <Action
                  title="Disconnect Keyboard"
                  icon={Icon.XMarkCircle}
                  style={Action.Style.Destructive}
                  onAction={() => handleDisconnect(keyboard)}
                />
              )}
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
                onAction={loadKeyboards}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
