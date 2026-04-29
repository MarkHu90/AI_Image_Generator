"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Clock, Settings, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import clsx from "clsx";

const links = [
  { href: "/generate", label: "Generate", icon: ImageIcon },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-55 h-screen bg-surface flex flex-col shrink-0">
      <div className="px-4 py-4 font-semibold text-sm text-foreground">
        ImageForge
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-accent text-foreground border-l-2 border-primary pl-2.5"
                  : "text-text-secondary hover:bg-surface-hover hover:text-foreground border-l-2 border-transparent pl-2.5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
