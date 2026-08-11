import type { ContentStat } from "@/lib/dashboard-data";

type StatCardProps = Omit<ContentStat, "key">;

export function StatCard({ label, value, change, highlight }: StatCardProps) {
  if (highlight) {
    return (
      <div
        className="flex h-[126px] w-full min-w-0 flex-col justify-end rounded-2xl px-5 py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #E0499D 0%, #B53A84 100%)" }}
      >
        <p className="text-[32px] font-bold leading-none">{value}</p>
        <p className="mt-1.5 text-[14px] font-normal text-white/90">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[126px] w-full min-w-0 flex-col justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ifwyd-brand/10 text-[13px] font-bold text-ifwyd-brand-dark">
          {label.charAt(0)}
        </div>
        {change ? (
          <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[9px] font-semibold text-[#2E7D32]">
            ↑ {change.replace(/^[+-]\s*/, "")}
          </span>
        ) : (
          <span className="h-[22px]" aria-hidden />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[22px] font-semibold leading-none text-neutral-900">{value}</p>
        <p className="mt-1.5 truncate text-[14px] font-normal text-black">{label}</p>
      </div>
    </div>
  );
}
