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
  confirmClassName?: string;
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
  confirmClassName,
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
        className="relative flex h-[322px] w-[524px] max-w-[calc(100vw-2rem)] flex-col rounded-[20px] bg-white px-8 pb-8 pt-10 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <h2
          id={titleId}
          className="shrink-0 text-center text-[22px] font-semibold leading-tight text-neutral-900"
        >
          {title}
        </h2>

        <p
          id={descriptionId}
          className="mx-auto mt-[42px] max-w-[420px] shrink-0 text-center text-[15px] font-light leading-6 text-neutral-900"
        >
          {description}
        </p>

        <div className="mt-auto flex justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] w-[177px] rounded-full bg-[#F0F0F0] text-[15px] font-medium text-neutral-900 transition-colors hover:bg-[#E8E8E8]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={cn(
              "h-[52px] w-[177px] rounded-full bg-black text-[15px] font-medium text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60",
              confirmClassName,
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
