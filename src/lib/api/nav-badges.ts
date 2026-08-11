import { mockVolunteerApplications } from "@/lib/volunteer-data";
import { mockRegistrations } from "@/lib/register-data";
import { mockContactMessages } from "@/lib/contact-data";
import { apiClient } from "./client";

export type NavBadges = {
  volunteer: number;
  register: number;
  contact: number;
};

export type NavBadgesResult = {
  badges: NavBadges;
  source: "api" | "mock";
};

const HREF_TO_KEY: Record<string, keyof NavBadges> = {
  "/volunteer": "volunteer",
  "/register": "register",
  "/contact": "contact",
};

export function badgeForHref(href: string, badges: NavBadges | null): number | undefined {
  if (!badges) return undefined;
  const key = HREF_TO_KEY[href];
  if (!key) return undefined;
  const value = badges[key];
  return value > 0 ? value : undefined;
}

function mockBadges(): NavBadges {
  return {
    volunteer: mockVolunteerApplications.filter((item) => item.status === "New").length,
    register: mockRegistrations.filter((item) => item.status === "New").length,
    contact: mockContactMessages.filter((item) => item.status === "Unread").length,
  };
}

export async function fetchNavBadges(): Promise<NavBadgesResult> {
  try {
    const badges = await apiClient<NavBadges>("/api/admin/nav-badges");
    return { badges, source: "api" };
  } catch {
    return { badges: mockBadges(), source: "mock" };
  }
}
