import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background">
      <span className="text-xs text-text-tertiary" />
      <span className="text-xs text-text-secondary">{email}</span>
    </header>
  );
}
