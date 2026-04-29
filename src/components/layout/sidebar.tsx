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
    <aside className="w-56 h-screen border-r border-border bg-card flex flex-col shrink-0">
      <div className="p-4 font-bold text-lg flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-indigo-400" />
        AI Image Gen
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-border">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
