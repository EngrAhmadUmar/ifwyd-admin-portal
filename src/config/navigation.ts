import { Home, Image as ImageIcon, SquarePlus, type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const mainNav: NavItem[] = [
  { label: "All Content", href: "/", icon: Home },
  { label: "New Post", href: "/posts/new", icon: SquarePlus },
  { label: "Media Library", href: "/media", icon: ImageIcon },
];
