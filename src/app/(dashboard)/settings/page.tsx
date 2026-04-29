import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user?.id
    ? await db.user.findUnique({ where: { id: session.user.id } })
    : null;

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Profile
        </h2>
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div>
            <span className="text-xs text-text-secondary">Email</span>
            <p className="text-sm text-foreground">{user?.email ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary">Name</span>
            <p className="text-sm text-foreground">{user?.name ?? "—"}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Credits
        </h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl font-semibold text-primary">{user?.credits ?? 0}</p>
          <p className="text-xs text-text-secondary mt-1">
            One credit per image generation. Different models may consume more.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          API Keys
        </h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-text-secondary">
            API keys are configured server-side. Contact your administrator to
            add custom keys.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-medium text-red-400 uppercase tracking-wide">
          Danger Zone
        </h2>
        <div className="border border-red-400/20 rounded-lg p-4">
          <p className="text-xs text-text-secondary mb-3">
            Permanently delete your account and all data.
          </p>
          <button className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-400/30 rounded-md hover:bg-red-400/10 transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
