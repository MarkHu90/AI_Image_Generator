import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <h1 className="text-5xl font-semibold tracking-tight mb-4 text-foreground">
        ImageForge
      </h1>
      <p className="text-lg text-text-secondary max-w-md mb-8 leading-relaxed">
        Create. Edit. Export. A powerful image toolkit for designers
        and creators.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 text-text-secondary hover:text-foreground transition-colors text-sm"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
