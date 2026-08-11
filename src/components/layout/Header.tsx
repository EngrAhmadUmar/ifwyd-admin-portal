import { Search, UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vh,0.75rem)]">
      <div className="relative min-w-0 w-full max-w-[368px]">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
          <Search className="h-4 w-4" strokeWidth={2} />
        </span>
        <input
          type="search"
          placeholder="Search news, projects, submissions..."
          className="h-[clamp(40px,5vh,47px)] w-full rounded-full bg-neutral-100 pl-11 pr-4 text-[12px] font-normal text-[#1C1C1C] outline-none placeholder:text-[12px] placeholder:font-normal placeholder:text-neutral-500 focus:ring-2 focus:ring-ifwyd-brand/20"
        />
      </div>

      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ifwyd-sidebar"
        aria-label="Profile"
      >
        <UserRound className="h-5 w-5 text-white" strokeWidth={2} />
      </button>
    </header>
  );
}
