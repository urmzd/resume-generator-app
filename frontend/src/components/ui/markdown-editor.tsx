import * as React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";

type Tab = "write" | "preview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-b-2 border-primary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write markdown...",
  rows = 4,
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>("write");

  return (
    <div className={cn("rounded-md border border-input", className)}>
      <div className="flex border-b border-input">
        <TabButton active={tab === "write"} onClick={() => setTab("write")}>
          Write
        </TabButton>
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
      </div>

      {tab === "write" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="border-0 rounded-none rounded-b-md shadow-none focus-visible:ring-0"
        />
      ) : (
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none px-3 py-2 min-h-[60px] overflow-auto",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-sm italic">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}
