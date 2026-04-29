import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
        <h2 className="font-display text-2xl mb-6 text-foreground">Sign In</h2>
        <AuthForm mode="login" />
        <p className="mt-4 text-text-secondary text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
