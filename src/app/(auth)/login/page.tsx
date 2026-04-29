import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <AuthForm mode="login" />
      <p className="mt-4 text-muted-foreground text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-400 hover:underline">
          Register
        </Link>
      </p>
    </main>
  );
}
