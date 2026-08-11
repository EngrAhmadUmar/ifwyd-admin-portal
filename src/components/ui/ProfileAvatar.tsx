"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type ProfileAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: number;
  textClassName?: string;
  className?: string;
};

function initialsFromName(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??"
  );
}

export function ProfileAvatar({
  name,
  photoUrl,
  size = 40,
  textClassName,
  className,
}: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFromName(name);
  const showImage = Boolean(photoUrl) && !failed;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ifwyd-brand/10 font-semibold text-ifwyd-brand-dark",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={cn("select-none", textClassName)} style={{ fontSize: Math.max(10, size * 0.3) }}>
          {initials}
        </span>
      )}
    </div>
  );
}
