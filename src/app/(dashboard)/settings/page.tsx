import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user?.id
    ? await db.user.findUnique({ where: { id: session.user.id } })
    : null;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid gap-2">
          <div>
            <span className="text-sm text-text-secondary">Email</span>
            <p>{user?.email ?? "—"}</p>
          </div>
          <div>
            <span className="text-sm text-text-secondary">Name</span>
            <p>{user?.name ?? "—"}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Credits</h2>
        <p className="text-3xl font-bold text-accent">{user?.credits ?? 0}</p>
        <p className="text-sm text-text-secondary">
          Credits are consumed per generation. Different models use different
          amounts.
        </p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <p className="text-sm text-text-secondary">
          API keys are configured server-side by the administrator. Contact
          support to add your own keys.
        </p>
      </Card>
    </div>
  );
}
