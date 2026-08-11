"use client";

import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  className?: string;
};

type ActionMenuProps = {
  items: ActionMenuItem[];
  ariaLabel?: string;
  className?: string;
};

export function ActionMenu({ items, ariaLabel = "Actions", className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4 text-neutral-900" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2">
          <div className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-neutral-200 bg-white" />
          <div className="relative min-w-[130px] overflow-hidden rounded-2xl border border-neutral-200 bg-white py-0.5 shadow-lg">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className={cn(
                  "block w-full whitespace-nowrap px-4 py-2 text-left text-[12px] font-normal text-neutral-900 hover:bg-neutral-50/80",
                  item.className,
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
