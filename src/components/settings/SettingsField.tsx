"use client";

type SettingsFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
};

export function SettingsField({ label, value, onChange, type = "text", placeholder }: SettingsFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-neutral-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[47px] w-full rounded-[10px] bg-[#F5F5F5] px-4 text-[14px] font-normal text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
      />
    </label>
  );
}

type SettingsSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
};

export function SettingsSelect({ label, value, onChange, options }: SettingsSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-neutral-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[47px] w-full appearance-none rounded-[10px] bg-[#F5F5F5] px-4 text-[14px] font-normal text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type SettingsTextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export function SettingsTextArea({ label, value, onChange, rows = 3 }: SettingsTextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-neutral-900">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-[10px] bg-[#F5F5F5] px-4 py-3 text-[14px] font-normal text-neutral-900 outline-none focus:ring-2 focus:ring-ifwyd-brand/20"
      />
    </label>
  );
}
