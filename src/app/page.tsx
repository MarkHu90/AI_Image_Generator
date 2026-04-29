import Link from "next/link";
import { ImageIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="mb-6 rounded-2xl bg-indigo-500/10 p-4">
        <ImageIcon className="w-12 h-12 text-indigo-400" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-4 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        AI Image Generator
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        Create stunning images with the world&apos;s best AI models.
        Text-to-image, image editing, background removal — all in one place.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors font-medium"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
