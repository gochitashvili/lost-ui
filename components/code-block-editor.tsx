"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronRight, Clipboard, File, Folder } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Types for our file system
type FileItem = {
  name: string;
  path: string;
  content?: string;
  type: "file";
};

type FolderItem = {
  name: string;
  path: string;
  type: "folder";
  children: FileTreeItem[];
};

type FileTreeItem = FileItem | FolderItem;

// Sample data structure
const sampleFileTree: FileTreeItem[] = [
  {
    name: "app",
    path: "app",
    type: "folder",
    children: [
      {
        name: "login",
        path: "app/login",
        type: "folder",
        children: [
          {
            name: "page.tsx",
            path: "app/login/page.tsx",
            type: "file",
            content: `import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}`,
          },
        ],
      },
    ],
  },
  {
    name: "components",
    path: "components",
    type: "folder",
    children: [
      {
        name: "login-form.tsx",
        path: "components/login-form.tsx",
        type: "file",
        content: `import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to sign in to your account
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@example.com" required type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" />
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </div>
    </div>
  )
}`,
      },
    ],
  },
];

// Context for our code block editor
type CodeBlockEditorContext = {
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  fileTree: FileTreeItem[];
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
};

const CodeBlockEditorContext =
  React.createContext<CodeBlockEditorContext | null>(null);

function useCodeBlockEditor() {
  const context = React.useContext(CodeBlockEditorContext);
  if (!context) {
    throw new Error(
      "useCodeBlockEditor must be used within a CodeBlockEditorProvider"
    );
  }
  return context;
}

function CodeBlockEditorProvider({
  children,
  fileTree,
}: {
  children: React.ReactNode;
  fileTree: FileTreeItem[];
}) {
  const [activeFile, setActiveFile] = React.useState<string | null>(
    // Find the first file in the tree
    findFirstFile(fileTree)?.path || null
  );
  // Track expanded folders - initially expand all folders
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    () => {
      const expanded = new Set<string>();
      const addFolderPaths = (items: FileTreeItem[]) => {
        items.forEach((item) => {
          if (item.type === "folder") {
            expanded.add(item.path);
            addFolderPaths(item.children);
          }
        });
      };
      addFolderPaths(fileTree);
      return expanded;
    }
  );

  const toggleFolder = React.useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  return (
    <CodeBlockEditorContext.Provider
      value={{
        activeFile,
        setActiveFile,
        fileTree,
        expandedFolders,
        toggleFolder,
      }}
    >
      <div className="flex min-w-0 flex-col items-stretch rounded-lg border">
        {children}
      </div>
    </CodeBlockEditorContext.Provider>
  );
}

// Helper function to find the first file in the tree
function findFirstFile(items: FileTreeItem[]): FileItem | null {
  for (const item of items) {
    if (item.type === "file") {
      return item;
    } else if (item.type === "folder") {
      const file = findFirstFile(item.children);
      if (file) return file;
    }
  }
  return null;
}

// Helper function to find a file by path
function findFileByPath(items: FileTreeItem[], path: string): FileItem | null {
  for (const item of items) {
    if (item.type === "file" && item.path === path) {
      return item;
    } else if (item.type === "folder") {
      const file = findFileByPath(item.children, path);
      if (file) return file;
    }
  }
  return null;
}

function CodeBlockEditorToolbar() {
  const { activeFile, fileTree } = useCodeBlockEditor();
  const [isCopied, setIsCopied] = React.useState(false);

  const file = activeFile ? findFileByPath(fileTree, activeFile) : null;
  const content = file?.content || "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex h-10 items-center gap-2 border-b px-4 text-sm font-medium">
      <File className="h-4 w-4" />
      {file?.path || "Select a file"}
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={copyToClipboard}
          className="h-7 w-7 rounded-md p-0"
          variant="ghost"
          size="sm"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
    </div>
  );
}

function FileTreeView() {
  const { fileTree, expandedFolders } = useCodeBlockEditor();

  // Create a hierarchical structure for rendering
  const renderableTree = React.useMemo(() => {
    // First, create a map of all items by path
    const itemMap = new Map<
      string,
      FileTreeItem & { depth: number; visible: boolean }
    >();

    // Add all items to the map with initial visibility
    const addToMap = (
      items: FileTreeItem[],
      depth: number,
      parentVisible = true
    ) => {
      items.forEach((item) => {
        const isVisible =
          parentVisible &&
          (item.type === "folder" ||
            (item.type === "file" &&
              (!item.path.includes("/") ||
                expandedFolders.has(
                  item.path.substring(0, item.path.lastIndexOf("/"))
                ))));

        itemMap.set(item.path, { ...item, depth, visible: isVisible });

        if (item.type === "folder") {
          // For folders, children are only visible if the folder is expanded
          const folderVisible = isVisible && expandedFolders.has(item.path);
          addToMap(item.children, depth + 1, folderVisible);
        }
      });
    };

    addToMap(fileTree, 0);

    // Convert the map to an array and filter out invisible items
    return Array.from(itemMap.values()).filter((item) => item.visible);
  }, [fileTree, expandedFolders]);

  return (
    <SidebarProvider className="flex !min-h-full flex-col">
      <Sidebar
        collapsible="none"
        className="w-full flex-1 border-r bg-muted/50"
      >
        <SidebarGroupLabel className="h-10 rounded-none border-b px-4 text-sm">
          Files
        </SidebarGroupLabel>
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <div className="flex flex-col gap-1 rounded-none">
                {renderableTree.map((item) => (
                  <TreeItem key={item.path} item={item} depth={item.depth} />
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

// A non-list item component for rendering tree items
function TreeItem({ item, depth }: { item: FileTreeItem; depth: number }) {
  const { activeFile, setActiveFile, expandedFolders, toggleFolder } =
    useCodeBlockEditor();
  const isExpanded = item.type === "folder" && expandedFolders.has(item.path);

  const handleClick = () => {
    if (item.type === "file") {
      setActiveFile(item.path);
    } else {
      toggleFolder(item.path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 whitespace-nowrap py-1.5 text-left text-sm hover:bg-muted",
        "pl-[calc(0.5rem+0.8rem*var(--depth))]",
        item.type === "file" &&
          item.path === activeFile &&
          "bg-muted font-medium"
      )}
      style={{ "--depth": depth } as React.CSSProperties}
    >
      {item.type === "folder" ? (
        <>
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
          <Folder className="h-4 w-4 shrink-0" />
          <span className="font-medium truncate">{item.name}</span>
        </>
      ) : (
        <>
          <span className="w-4" /> {/* Spacer to align with folder items */}
          <File className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.name}</span>
        </>
      )}
    </button>
  );
}

function CodeView() {
  const { activeFile, fileTree } = useCodeBlockEditor();

  const file = activeFile ? findFileByPath(fileTree, activeFile) : null;
  const content = file?.content || "";

  if (!file) {
    return <div className="p-4">Select a file to view its content</div>;
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <pre className="flex-1 overflow-auto bg-muted/30 p-4 text-sm !rounded-l-none !rounded-tr-none">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function CodeBlockEditor() {
  const [fileTree] = React.useState(sampleFileTree);

  return (
    <CodeBlockEditorProvider fileTree={fileTree}>
      <CodeBlockEditorToolbar />

      <div className="flex h-[700px] w-full overflow-hidden">
        <div className="w-[240px]">
          <FileTreeView />
        </div>
        <CodeView />
      </div>
    </CodeBlockEditorProvider>
  );
}
