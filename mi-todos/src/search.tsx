import {
  Action,
  ActionPanel,
  Detail,
  getPreferenceValues,
  Icon,
  List,
  useNavigation,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { expandHome, resolvePath, readFile } from "./util/storage";
import { search } from "./util/qmd";

interface Preferences {
  wikiPath: string;
}

interface QmdResult {
  path: string;
  snippet: string;
  score: number;
}

function ContentDetail({ filepath, fileName }: { filepath: string; fileName: string }) {
  let content = "(file not readable)";
  try {
    content = readFile(filepath);
  } catch {
    // keep fallback
  }

  return (
    <Detail
      markdown={`# ${fileName}\n\n\`\`\`markdown\n${content.slice(0, 5000)}\n\`\`\``}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Path" content={filepath} />
          <Action.CopyToClipboard title="Copy Content" content={content} />
        </ActionPanel>
      }
    />
  );
}

function SearchResults({ query }: { query: string }) {
  const prefs = getPreferenceValues<Preferences>();
  const wikiPath = resolvePath(expandHome(prefs.wikiPath));
  const { push } = useNavigation();

  const { data, isLoading } = usePromise(
    async () => {
      if (!query.trim()) return { results: [] as QmdResult[], method: "none" as const };
      return search(query, wikiPath);
    },
    [query],
  );

  const results = data?.results ?? [];
  const method = data?.method ?? "none";

  if (!query.trim()) {
    return (
      <List.EmptyView
        icon={Icon.MagnifyingGlass}
        title="Search your tasks and knowledge base"
        description="Type to search across mitodos files and wiki notes"
      />
    );
  }

  if (isLoading) {
    return <List.EmptyView icon={Icon.CircleProgress} title="Searching..." />;
  }

  if (results.length === 0) {
    return <List.EmptyView icon={Icon.XMarkCircle} title="No results" description={`No matches for "${query}"`} />;
  }

  const methodLabel =
    method === "qmd"
      ? "QMD semantic search"
      : method === "grep"
        ? "grep (QMD not available)"
        : "";

  return (
    <List.Section title={methodLabel}>
      {results.map((r, i) => {
        const fileName = r.path.split("/").pop()?.replace(/\.md$|\.txt$/, "") || r.path;
        const snippet = r.snippet.slice(0, 200);
        const isTodo = r.path.includes("/mitodos/");

        return (
          <List.Item
            key={`${r.path}-${i}`}
            icon={isTodo ? Icon.CheckCircle : Icon.Document}
            title={fileName}
            subtitle={snippet}
            accessories={[
              { text: isTodo ? "todo" : "wiki" },
              { text: r.score > 0 ? `${(r.score * 100).toFixed(0)}%` : "" },
            ]}
            actions={
              <ActionPanel>
                <Action
                  title="View Content"
                  icon={Icon.Eye}
                  onAction={() => push(<ContentDetail filepath={r.path} fileName={fileName} />)}
                />
                <Action.CopyToClipboard title="Copy Path" content={r.path} />
                <Action.CopyToClipboard title="Copy Snippet" content={r.snippet} />
              </ActionPanel>
            }
          />
        );
      })}
    </List.Section>
  );
}

export default function Command(props: { arguments: { query?: string } }) {
  const [searchText, setSearchText] = useState(props.arguments.query || "");

  return (
    <List
      searchBarPlaceholder="Search tasks and wiki..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={false}
      throttle
    >
      <SearchResults query={searchText} />
    </List>
  );
}
