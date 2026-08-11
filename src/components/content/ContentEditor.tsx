"use client";

import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link2,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

type ContentEditorProps = {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  disabled?: boolean;
};

type ToolbarAction =
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "justifyFull"
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "createLink";

const toolbarItems: { action: ToolbarAction; icon: typeof Bold; label: string }[] = [
  { action: "justifyLeft", icon: AlignLeft, label: "Align left" },
  { action: "justifyCenter", icon: AlignCenter, label: "Align center" },
  { action: "justifyRight", icon: AlignRight, label: "Align right" },
  { action: "justifyFull", icon: AlignJustify, label: "Justify" },
  { action: "bold", icon: Bold, label: "Bold" },
  { action: "italic", icon: Italic, label: "Italic" },
  { action: "underline", icon: Underline, label: "Underline" },
  { action: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  { action: "createLink", icon: Link2, label: "Insert link" },
];

export function ContentEditor({ content, onChange, className, disabled = false }: ContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || syncingRef.current) return;
    if (editor.innerHTML !== content) {
      editor.innerHTML = content;
    }
  }, [content]);

  const runCommand = useCallback(
    (action: ToolbarAction) => {
      if (disabled) return;
      editorRef.current?.focus();

      if (action === "createLink") {
        const url = window.prompt("Enter URL");
        if (url) document.execCommand(action, false, url);
        return;
      }

      document.execCommand(action);
    },
    [disabled],
  );

  function handleInput() {
    const editor = editorRef.current;
    if (!editor) return;
    syncingRef.current = true;
    onChange(editor.innerHTML);
    queueMicrotask(() => {
      syncingRef.current = false;
    });
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-neutral-200/80 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-neutral-200/80 bg-[#FAFAFA] px-4 py-2.5">
        {toolbarItems.map(({ action, icon: Icon, label }) => (
          <button
            key={action}
            type="button"
            onClick={() => runCommand(action)}
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900 disabled:opacity-40"
            aria-label={label}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        className={cn(
          "content-editor min-h-0 flex-1 overflow-y-auto px-6 py-5 text-[15px] font-light leading-7 text-neutral-900 outline-none",
          disabled && "opacity-60",
        )}
      />
    </div>
  );
}
