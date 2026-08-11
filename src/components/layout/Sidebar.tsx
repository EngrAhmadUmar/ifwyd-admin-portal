"use client";

import { Logo } from "@/components/icons/Logo";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { footerNav, mainNav, type NavItem } from "@/config/navigation";
import { badgeForHref, fetchNavBadges, type NavBadges } from "@/lib/api/nav-badges";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function NavLink({ href, label, icon: Icon, badge }: NavItem & { badge?: number }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex h-[48px] w-[277px] items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium transition-colors",
        isActive
          ? "bg-ifwyd-sidebar-active text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white/90",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span className="rounded-full bg-ifwyd-brand px-2 py-0.5 text-[11px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [badges, setBadges] = useState<NavBadges | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchNavBadges().then((result) => {
      if (!cancelled) setBadges(result.badges);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogoutConfirm() {
    setLogoutOpen(false);
    await logout();
    router.push("/login");
  }

  const email = user?.email ?? "admin@ifwyd.org";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <>
      <aside className="flex h-screen w-[291px] shrink-0 flex-col overflow-hidden bg-ifwyd-sidebar px-[7px] py-6">
        <div className="mb-6 px-3">
          <Logo className="h-11 w-auto" priority />
        </div>

        <div className="mb-4 h-px bg-white/10" />

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {mainNav.map((item) => (
            <NavLink key={item.href} {...item} badge={badgeForHref(item.href, badges)} />
          ))}

          <div className="my-2 h-px bg-white/10" />

          {footerNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ifwyd-brand text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-white">Admin</p>
              <p className="truncate text-[11px] text-white/60">{email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="mx-auto flex h-[48px] w-[251px] items-center justify-center gap-2 rounded-[10px] border-[0.7px] border-white/15 bg-white/5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out"
        description="Are you sure you want to log out? You will need to sign in again to access the admin portal."
        cancelLabel="Cancel"
        confirmLabel="Log Out"
      />
    </>
  );
}
