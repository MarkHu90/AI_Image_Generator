import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="relative z-10 max-w-md">
        <h1 className="font-display text-7xl tracking-tight mb-4 text-foreground">
          Image<span className="text-primary">Forge</span>
        </h1>
        <p className="text-base text-text-secondary max-w-sm mx-auto mb-10 leading-relaxed">
          Create stunning images with the world&apos;s best AI models.
          Text to image, editing, and more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg"
            style={{ background: "var(--chrome-accent)" }}
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
