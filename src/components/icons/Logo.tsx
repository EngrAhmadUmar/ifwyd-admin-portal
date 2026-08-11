import { assets } from "@/config/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={assets.logo}
      alt="IFWYD"
      width={162}
      height={151}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
