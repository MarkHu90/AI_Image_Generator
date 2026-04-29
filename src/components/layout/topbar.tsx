import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "./theme-toggle";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  return (
    <header className="h-12 flex items-center justify-between px-6 shrink-0 glass border-b border-border/50">
      <span className="text-xs text-text-tertiary font-medium">Generate anything</span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-xs text-text-secondary font-medium">{email}</span>
      </div>
    </header>
  );
}
