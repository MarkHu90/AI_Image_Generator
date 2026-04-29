"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await authClient.signUp.email({ email, password, name });
        if (error) throw error;
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw error;
        router.push("/generate");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : mode === "login" ? "Sign in failed" : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      {mode === "register" && (
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
