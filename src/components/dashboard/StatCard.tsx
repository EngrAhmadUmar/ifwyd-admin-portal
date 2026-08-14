import type { ContentStat } from "@/lib/dashboard-data";

type StatCardProps = Omit<ContentStat, "key">;

export function StatCard({ label, value, highlight }: StatCardProps) {
  if (highlight) {
    return (
      <div
        className="flex h-[126px] w-full min-w-0 flex-col justify-center rounded-[10px] px-5 py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(180deg, #FF507D 0%, #D54B9C 100%)" }}
      >
        <p className="text-[26px] font-semibold leading-none">{value}</p>
        <p className="mt-2 text-[15px] font-regular text-white/90">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[126px] w-full min-w-0 flex-col justify-center rounded-[10px] bg-white px-5 py-4 shadow-sm">
      <p className="text-[26px] font-semibold leading-none text-neutral-900">{value}</p>
      <p className="mt-2 text-[15px] font-regular text-neutral-500">{label}</p>
    </div>
  );
}
