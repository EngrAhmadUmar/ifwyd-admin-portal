"use client";

import { cn } from "@/lib/utils";

type SettingsToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SettingsToggle({ checked, onChange }: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-8 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-ifwyd-brand" : "bg-[#E8E8E8]",
      )}
    >
      <span
        className={cn(
          "absolute left-[2px] top-[4px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-200",
          checked ? "translate-x-[14px]" : "translate-x-0",
        )}
      />
    </button>
  );
}

type SettingsToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SettingsToggleRow({ label, checked, onChange }: SettingsToggleRowProps) {
  return (
    <div className="flex max-w-[460px] items-center justify-between gap-6 py-4">
      <span className="text-[15px] font-normal text-neutral-900">{label}</span>
      <SettingsToggle checked={checked} onChange={onChange} />
    </div>
  );
}
