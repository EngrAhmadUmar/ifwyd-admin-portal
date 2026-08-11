import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-ifwyd-surface">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vh,0.75rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
