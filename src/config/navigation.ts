import {
  Briefcase,
  ClipboardList,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Home,
  Image as ImageIcon,
  Mail,
  Settings,
  SquarePlus,
  type LucideIcon,
} from "lucide-react";

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
  { label: "Classrooms", href: "/classrooms", icon: GraduationCap },
  { label: "Career", href: "/career", icon: Briefcase },
  { label: "Volunteer Applications", href: "/volunteer", icon: HeartHandshake },
  { label: "Registrations", href: "/register", icon: ClipboardList },
  { label: "Contact Messages", href: "/contact", icon: Mail },
  { label: "Donate Settings", href: "/donate", icon: HandCoins },
];

export const footerNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];
