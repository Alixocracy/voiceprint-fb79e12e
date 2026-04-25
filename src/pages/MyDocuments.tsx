import { useMemo, useRef, useState } from "react";
import { useAgency, type Folder } from "@/state/agencyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FolderOpen, FolderPlus, Upload, LinkIcon, Trash2, FileText, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { extractFileText } from "@/lib/extractText";
import { ingestLink } from "@/integrations/agnic/client";

const STARTER_FOLDERS = ["My Writing", "Talks and Interviews", "Industry Reading", "Working Drafts"];

export default function MyDocuments() {
  const { folders, documents, createFolder, deleteFolder, addDocument, updateDocumentText, deleteDocument } = useAgency();
  const [selectedId, setSelectedId] = useState<string | null>(folders[0]?.id ?? null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pasteFor, setPasteFor] = useState<{ name: string } | null>(null);
  const [pasteText, setPasteText] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const tree = useMemo(() => buildTree(folders), [folders]);
  const selected = selectedId ? folders.find((f) => f.id === selectedId) ?? null : null;
  const items = selected ? documents.filter((d) => d.folder_id === selected.id) : [];

  const handleCreateFolder = (name: string) => {
    const f = createFolder(name);
    setSelectedId(f.id);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !selected) return;
    setUploadBusy(true);
    for (const file of Array.from(files)) {
      const result = await extractFileText(file);
      if (result.ok) {
        addDocument({
          folder_id: selected.id,
          name: file.name,
          type: "file",
          text_content: result.text,
          text_extraction_status: "ok",
        });
        if (result.truncated) toast.message(`${file.name}: large file truncated`);
      } else {
        const placeholder = addDocument({
          folder_id: selected.id,
          name: file.name,
          type: "file",
          text_content: "",
          text_extraction_status: "failed",
        });
        toast.error(`Could not read ${file.name}`, {
          description: "We could not read this file's text; you can paste it in manually instead.",
          action: {
            label: "Paste text",
            onClick: () => {
              setPasteFor({ name: placeholder.id });
              setPasteText("");
            },
          },
        });
      }
    }
    setUploadBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleAddLink = async () => {
    const url = linkUrl.trim();
    if (!url || !selected) return;
    setLinkBusy(true);
    try {
      const ingested = await ingestLink(url);
      addDocument({
        folder_id: selected.id,
        name: ingested.title || url,
        type: "link",
        source_url: ingested.source_url,
        text_content: ingested.text,
        text_extraction_status: "ok",
      });
      toast.success("Link ingested.");
      setLinkUrl("");
      setShowLink(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not fetch link");
    } finally {
      setLinkBusy(false);
    }
  };

  // Empty state
  if (folders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-20">
        <header className="mb-8">
          <h1 className="font-serif text-4xl text-foreground">My Documents</h1>
          <p className="font-serif italic text-muted-foreground mt-3">
            Your knowledge base. Folders feed your voice with grounded context.
          </p>
        </header>
        <div className="rounded-xl border border-dashed border-border bg-surface-elevated p-10">
          <p className="text-sm text-muted-foreground mb-6">Start with a few folders:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {STARTER_FOLDERS.map((name) => (
              <button
                key={name}
                onClick={() => handleCreateFolder(name)}
                className="text-left rounded-lg border border-border bg-background hover:bg-primary-soft/40 hover:border-primary/30 transition-colors px-4 py-4 flex items-center gap-3"
              >
                <FolderPlus className="size-4 text-primary" />
                <span className="font-serif text-foreground">{name}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Or create your own:</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newFolderName.trim()) handleCreateFolder(newFolderName.trim());
              }}
              className="flex gap-2"
            >
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
              />
              <Button type="submit" variant="studio">
                Create
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-20">
      <header className="mb-6 flex items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl text-foreground">My Documents</h1>
          <p className="font-serif italic text-muted-foreground mt-2">
            Your knowledge base. Pin a folder to ground your chat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowNewFolder((s) => !s)}>
            <FolderPlus className="size-3.5" /> New folder
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInput.current?.click()}
            disabled={!selected || uploadBusy}
          >
            {uploadBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            Upload file
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowLink((s) => !s)} disabled={!selected}>
            <LinkIcon className="size-3.5" /> Add link
          </Button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </header>

      {showNewFolder && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newFolderName.trim()) handleCreateFolder(newFolderName.trim());
          }}
          className="mb-4 flex gap-2 max-w-md"
        >
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            autoFocus
          />
          <Button type="submit" variant="studio" size="sm">
            Create
          </Button>
        </form>
      )}

      {showLink && selected && (
        <div className="mb-4 flex gap-2 max-w-2xl">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://…"
            type="url"
          />
          <Button onClick={handleAddLink} disabled={!linkUrl.trim() || linkBusy} variant="studio" size="sm">
            {linkBusy ? <Loader2 className="size-3.5 animate-spin" /> : "Fetch"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-[260px_1fr] gap-6 items-start">
        {/* Folder tree */}
        <aside className="rounded-xl border border-border bg-surface-elevated p-3 max-h-[70vh] overflow-y-auto">
          <FolderTree
            tree={tree}
            selectedId={selectedId}
            onSelect={setSelectedId}
            depth={0}
            onDelete={(id) => {
              if (confirm("Delete this folder and everything in it?")) {
                deleteFolder(id);
                if (selectedId === id) setSelectedId(folders.find((f) => f.id !== id)?.id ?? null);
              }
            }}
          />
        </aside>

        {/* Items */}
        <section className="rounded-xl border border-border bg-surface-elevated min-h-[400px]">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <p className="font-serif text-foreground">{selected?.name ?? "—"}</p>
            <span className="text-xs text-muted-foreground">{items.length} items</span>
          </div>
          {items.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              <FolderOpen className="size-8 mx-auto mb-3 opacity-40" />
              <p className="font-serif italic">Empty. Upload a file or add a link.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((d) => (
                <li key={d.id} className="px-5 py-3 flex items-start gap-3">
                  <FileText className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {d.type === "link" && d.source_url ? d.source_url : `${d.size_chars.toLocaleString()} chars`}
                      {d.text_extraction_status === "failed" && (
                        <span className="ml-2 inline-flex items-center gap-1 text-destructive">
                          <AlertTriangle className="size-3" /> extraction failed
                        </span>
                      )}
                      {d.text_extraction_status === "manual" && (
                        <span className="ml-2 text-muted-foreground italic">manual paste</span>
                      )}
                    </p>
                    {d.text_extraction_status === "failed" && pasteFor?.name === d.id && (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          rows={4}
                          value={pasteText}
                          onChange={(e) => setPasteText(e.target.value)}
                          placeholder="Paste the text content here…"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="studio"
                            onClick={() => {
                              if (!pasteText.trim()) return;
                              updateDocumentText(d.id, pasteText.trim(), "manual");
                              setPasteFor(null);
                              setPasteText("");
                              toast.success("Text saved.");
                            }}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setPasteFor(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {d.text_extraction_status === "failed" && pasteFor?.name !== d.id && (
                      <button
                        onClick={() => {
                          setPasteFor({ name: d.id });
                          setPasteText("");
                        }}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        Paste text manually
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDocument(d.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

interface TreeNode { folder: Folder; children: TreeNode[] }

function buildTree(folders: Folder[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  folders.forEach((f) => map.set(f.id, { folder: f, children: [] }));
  const roots: TreeNode[] = [];
  folders.forEach((f) => {
    const node = map.get(f.id)!;
    if (f.parent_folder_id && map.has(f.parent_folder_id)) {
      map.get(f.parent_folder_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

const FolderTree = ({
  tree, selectedId, onSelect, depth, onDelete,
}: {
  tree: TreeNode[]; selectedId: string | null; onSelect: (id: string) => void; depth: number; onDelete: (id: string) => void;
}) => {
  if (depth > 3) return null;
  return (
    <ul className="space-y-0.5">
      {tree.map((node) => (
        <li key={node.folder.id}>
          <div
            className={cn(
              "group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer",
              selectedId === node.folder.id ? "bg-primary-soft text-primary" : "text-foreground hover:bg-accent",
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => onSelect(node.folder.id)}
          >
            <FolderOpen className="size-3.5 shrink-0" />
            <span className="flex-1 truncate">{node.folder.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(node.folder.id); }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              aria-label="Delete folder"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
          {node.children.length > 0 && (
            <FolderTree
              tree={node.children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
              onDelete={onDelete}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
