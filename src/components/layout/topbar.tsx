import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <span className="text-sm text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{email}</span>
    </header>
  );
}
