"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Copy,
  Check,
  FolderTree,
  FileText,
  FilePlus,
  FileMinus,
  FileEdit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiffFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previousFilename?: string;
}

interface DiffViewerProps {
  files: DiffFile[];
}

export function DiffViewer({ files }: DiffViewerProps) {
  const totalAdditions = files.reduce((acc, f) => acc + f.additions, 0);
  const totalDeletions = files.reduce((acc, f) => acc + f.deletions, 0);

  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    new Set(files.map((f) => f.sha)),
  );

  const toggleFile = (sha: string) => {
    const next = new Set(expandedFiles);
    if (next.has(sha)) {
      next.delete(sha);
    } else {
      next.add(sha);
    }
    setExpandedFiles(next);
  };

  const expandAll = () => setExpandedFiles(new Set(files.map((f) => f.sha)));
  const collapseAll = () => setExpandedFiles(new Set());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <FolderTree className="size-4 text-primary" />
            </div>
            <div>
              <span className="text-base font-medium tabular-nums">
                {files.length}
              </span>
              <span className="ml-1.5 text-sm text-muted-foreground">
                {files.length === 1 ? "file" : "files"} changed
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-border" />

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Plus className="size-3.5" />
              <span className="font-mono tabular-nums">{totalAdditions}</span>
            </span>
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <Minus className="size-3.5" />
              <span className="font-mono tabular-nums">{totalDeletions}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Collapse all
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <DiffFileCard
            key={file.sha}
            file={file}
            expanded={expandedFiles.has(file.sha)}
            onToggle={() => toggleFile(file.sha)}
          />
        ))}
      </div>
    </div>
  );
}

function DiffFileCard({
  file,
  expanded,
  onToggle,
}: {
  file: DiffFile;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyFilename = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.filename);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "added":
        return FilePlus;
      case "removed":
        return FileMinus;
      default:
        return FileEdit;
    }
  };

  const StatusIcon = getStatusIcon(file.status);
  const parts = file.filename.split("/");
  const fileName = parts.pop();
  const dirPath = parts.length > 0 ? parts.join("/") + "/" : null;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="shrink-0">
          {expanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </div>

        <div className="shrink-0 rounded-md bg-muted/60 p-1.5">
          <StatusIcon className="size-4 text-muted-foreground" />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          {dirPath && (
            <span className="truncate font-mono text-sm text-muted-foreground">
              {dirPath}
            </span>
          )}
          <span className="truncate font-mono text-sm font-medium">
            {fileName}
          </span>
          {file.previousFilename && (
            <Badge variant="outline" className="shrink-0 text-xs">
              renamed from {file.previousFilename}
            </Badge>
          )}
          {file.changes >= 300 && (
            <Badge
              variant="outline"
              className="shrink-0 gap-1 border-amber-500/20 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
            >
              Large change
            </Badge>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2 text-xs tabular-nums">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              +{file.additions}
            </span>
            <span className="font-medium text-red-600 dark:text-red-400">
              -{file.deletions}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <CardContent className="relative border-t border-border/60 p-0">
          {file.patch ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyFilename}
                className="absolute right-2 top-2 z-10 size-7 bg-background/80 backdrop-blur"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
              <DiffContent patch={file.patch} />
            </>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <FileText className="mx-auto mb-2 size-8 opacity-50" />
              <p>No diff available for this file</p>
              <p className="mt-1 text-xs">Binary file or unchanged content</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function parseLine(line: string) {
  if (line.startsWith("@@")) {
    return { type: "hunk", content: line };
  }
  if (line.startsWith("+")) {
    return { type: "addition", content: line.slice(1) };
  }
  if (line.startsWith("-")) {
    return { type: "deletion", content: line.slice(1) };
  }
  return {
    type: "context",
    content: line.startsWith(" ") ? line.slice(1) : line,
  };
}

function DiffContent({ patch }: { patch: string }) {
  const lines = patch.split("\n");
  let oldNum = 0;
  let newNum = 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-xs">
        <tbody>
          {lines.map((line, idx) => {
            const parsed = parseLine(line);

            if (parsed.type === "hunk") {
              const match = line.match(
                /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/,
              );
              if (match && match[1] && match[2]) {
                oldNum = parseInt(match[1], 10);
                newNum = parseInt(match[2], 10);
              }
              return (
                <tr
                  key={idx}
                  className="select-none bg-muted/40 text-muted-foreground"
                >
                  <td colSpan={3} className="px-4 py-1 text-xs">
                    {line}
                  </td>
                </tr>
              );
            }

            const currentOld = parsed.type === "addition" ? "" : oldNum++;
            const currentNew = parsed.type === "deletion" ? "" : newNum++;

            const bgClass =
              parsed.type === "addition"
                ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
                : parsed.type === "deletion"
                  ? "bg-red-500/10 text-red-900 dark:text-red-100"
                  : "hover:bg-muted/30";

            return (
              <tr key={idx} className={cn("font-mono leading-5", bgClass)}>
                <td className="w-12 select-none border-r border-border/40 px-2 text-right text-muted-foreground/50">
                  {currentOld}
                </td>
                <td className="w-12 select-none border-r border-border/40 px-2 text-right text-muted-foreground/50">
                  {currentNew}
                </td>
                <td className="overflow-x-auto whitespace-pre px-3">
                  <span className="inline-block w-4 select-none text-muted-foreground">
                    {parsed.type === "addition"
                      ? "+"
                      : parsed.type === "deletion"
                        ? "-"
                        : " "}
                  </span>
                  {parsed.content}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}