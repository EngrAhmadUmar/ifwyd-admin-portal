"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { assets } from "@/config/assets";
import { mainNav, type NavItem } from "@/config/navigation";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function NavLink({ href, label, icon: Icon, badge }: NavItem & { badge?: number }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-[52px] w-full items-center gap-3 overflow-hidden rounded-[10px] px-4 text-[13px] font-medium transition-colors",
        isActive ? "bg-[#D54B9C0D] text-ifwyd-brand" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
      )}
    >
      <Icon className="h-[21px] w-[21px] shrink-0" strokeWidth={2} />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span className="rounded-[10px] bg-ifwyd-brand px-2 py-0.5 text-[13px] font-medium text-white">{badge}</span>
      )}
      {isActive && <span className="absolute inset-y-0 right-0 w-[6px] rounded-[10px] bg-ifwyd-brand" />}
    </Link>
  );
}

export function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogoutConfirm() {
    setLogoutOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <>
      <aside className="flex h-screen w-[291px] shrink-0 flex-col overflow-hidden border-r border-neutral-200/80 bg-white px-3 py-6">
        <div className="mb-6 px-2">
          <Image
            src={assets.logoHorizontal}
            alt="Ikra Foundation for Women & Youth Development"
            width={203}
            height={31}
            priority
            className="block"
          />
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-4 flex shrink-0 items-center gap-2 border-t border-neutral-200/80 px-2 pt-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ifwyd-brand text-sm font-bold text-white">
            IA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-neutral-900">{APP_NAME} Admin</p>
            <p className="truncate text-[11px] text-neutral-500">Editor</p>
          </div>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ifwyd-brand transition-colors hover:bg-ifwyd-brand/10 hover:text-ifwyd-brand-dark"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
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
