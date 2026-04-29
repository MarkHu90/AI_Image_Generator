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
      <h1 className="font-display text-2xl text-foreground">Settings</h1>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Profile
        </h2>
        <div className="glass rounded-xl p-5 space-y-4">
          <div>
            <span className="text-xs text-text-secondary font-medium">Email</span>
            <p className="text-sm text-foreground mt-0.5">{user?.email ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary font-medium">Name</span>
            <p className="text-sm text-foreground mt-0.5">{user?.name ?? "—"}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Credits
        </h2>
        <div className="glass rounded-xl p-5">
          <p className="text-3xl font-display text-primary">{user?.credits ?? 0}</p>
          <p className="text-xs text-text-secondary mt-2">
            One credit per image generation. Different models may consume more.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          API Keys
        </h2>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-text-secondary">
            API keys are configured server-side. Contact your administrator to add custom keys.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
          Danger Zone
        </h2>
        <div className="border border-red-400/20 rounded-xl p-5">
          <p className="text-xs text-text-secondary mb-3">
            Permanently delete your account and all data.
          </p>
          <button className="px-4 py-2 text-xs font-semibold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
