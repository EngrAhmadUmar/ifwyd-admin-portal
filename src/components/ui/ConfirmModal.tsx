"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  /** "danger" renders a red confirm button for destructive actions like delete. */
  variant?: "default" | "danger";
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmDisabled = false,
  variant = "default",
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-[17px] font-semibold leading-tight text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ifwyd-brand transition-colors hover:bg-ifwyd-brand/10 hover:text-ifwyd-brand-dark"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p id={descriptionId} className="mt-3 text-center text-[13px] leading-relaxed text-neutral-500">
          {description}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-full bg-[#F0F0F0] text-[14px] font-medium text-neutral-900 transition-colors hover:bg-[#E8E8E8]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={cn(
              "h-11 flex-1 rounded-full text-[14px] font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              variant === "danger" ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-black hover:bg-neutral-900",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
