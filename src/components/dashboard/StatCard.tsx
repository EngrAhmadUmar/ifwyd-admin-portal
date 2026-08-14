import type { ContentStat } from "@/lib/dashboard-data";

type StatCardProps = Omit<ContentStat, "key">;

export function StatCard({ label, value, highlight }: StatCardProps) {
  if (highlight) {
    return (
      <div
        className="flex h-[126px] w-full min-w-0 flex-col justify-start rounded-2xl px-5 py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #E0499D 0%, #B53A84 100%)" }}
      >
        <p className="text-[28px] font-bold leading-none">{value}</p>
        <p className="mt-2 text-[14px] font-normal text-white/90">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[126px] w-full min-w-0 flex-col justify-start rounded-2xl bg-white px-5 py-4 shadow-sm">
      <p className="text-[28px] font-bold leading-none text-neutral-900">{value}</p>
      <p className="mt-2 text-[14px] font-normal text-neutral-500">{label}</p>
    </div>
  );
}
