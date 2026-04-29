# Glass & Chrome UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current dark-only theme with a Glass & Chrome dual-mode design — frosted glass panels, chrome metallic accents, DM Serif Display + Manrope typography, smooth CSS transitions.

**Architecture:** Theme context with localStorage persistence, CSS custom properties for dual-mode tokens, `next/font/google` for typography, CSS-only animations. All existing component functionality preserved — purely visual overhaul.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (base-ui), CSS custom properties

**Design Doc:** `docs/plans/2026-04-29-glass-chrome-redesign-design.md`

---

### Task 1: Theme Provider + Toggle Infrastructure

**Files:**
- Create: `src/components/layout/theme-provider.tsx`
- Create: `src/components/layout/theme-toggle.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeProvider component**

Write `src/components/layout/theme-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 2: Create ThemeToggle component**

Write `src/components/layout/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="size-8 flex items-center justify-center rounded-md text-text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
```

**Step 3: Update root layout**

Modify `src/app/layout.tsx`:
- Import ThemeProvider
- Remove `dark` from html className
- Wrap children in ThemeProvider
- Change `Toaster theme="dark"` to `Toaster` (let it follow system)

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Create stunning images with the world's best AI models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

**Step 4: Verify**

Run `npm run dev`, open http://localhost:3000 — should load with light mode default.

**Step 5: Commit**

```bash
git add src/components/layout/theme-provider.tsx src/components/layout/theme-toggle.tsx src/app/layout.tsx
git commit -m "feat: add theme provider and toggle infrastructure"
```

---

### Task 2: CSS Variable Overhaul

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Rewrite CSS variables**

Replace the entire content of `src/app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
  --font-mono: var(--font-mono, monospace);
  --font-heading: var(--font-display);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-surface: var(--surface);
  --color-surface-hover: var(--surface-hover);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  /* Glass & Chrome — Light */
  --background: oklch(0.975 0.003 260);
  --foreground: oklch(0.16 0.005 260);
  --card: oklch(1 0 0 / 60%);
  --card-foreground: oklch(0.16 0.005 260);
  --popover: oklch(1 0 0 / 80%);
  --popover-foreground: oklch(0.16 0.005 260);
  --primary: oklch(0.60 0.10 240);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.96 0.003 260);
  --secondary-foreground: oklch(0.20 0.005 260);
  --muted: oklch(0.96 0.003 260);
  --muted-foreground: oklch(0.50 0.01 260);
  --accent: oklch(0.94 0.02 240);
  --accent-foreground: oklch(0.20 0.01 240);
  --destructive: oklch(0.55 0.18 22);
  --border: oklch(0 0 0 / 6%);
  --input: oklch(0 0 0 / 8%);
  --ring: oklch(0.60 0.10 240);
  --chart-1: oklch(0.60 0.10 240);
  --chart-2: oklch(0.50 0.08 240);
  --chart-3: oklch(0.40 0.06 240);
  --chart-4: oklch(0.30 0.04 240);
  --chart-5: oklch(0.20 0.02 240);
  --radius: 0.625rem;
  --sidebar: oklch(1 0 0 / 50%);
  --sidebar-foreground: oklch(0.16 0.005 260);
  --sidebar-primary: oklch(0.60 0.10 240);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.94 0.02 240);
  --sidebar-accent-foreground: oklch(0.20 0.01 240);
  --sidebar-border: oklch(0 0 0 / 4%);
  --sidebar-ring: oklch(0.60 0.10 240);
  --surface: oklch(0.98 0.002 260);
  --surface-hover: oklch(0.94 0.01 260);
  --text-secondary: oklch(0.48 0.01 260);
  --text-tertiary: oklch(0.65 0.01 260);
  --glass-bg: oklch(1 0 0 / 55%);
  --glass-border: oklch(1 0 0 / 70%);
  --chrome-accent: linear-gradient(135deg, oklch(0.68 0.10 240), oklch(0.55 0.12 260));
}

.dark {
  /* Glass & Chrome — Dark */
  --background: oklch(0.13 0.01 260);
  --foreground: oklch(0.93 0.003 260);
  --card: oklch(1 0 0 / 6%);
  --card-foreground: oklch(0.93 0.003 260);
  --popover: oklch(1 0 0 / 8%);
  --popover-foreground: oklch(0.93 0.003 260);
  --primary: oklch(0.70 0.12 240);
  --primary-foreground: oklch(0.12 0.01 260);
  --secondary: oklch(1 0 0 / 8%);
  --secondary-foreground: oklch(0.93 0.003 260);
  --muted: oklch(1 0 0 / 6%);
  --muted-foreground: oklch(0.58 0.01 260);
  --accent: oklch(0.65 0.10 240 / 20%);
  --accent-foreground: oklch(0.90 0.005 260);
  --destructive: oklch(0.55 0.18 22);
  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 10%);
  --ring: oklch(0.70 0.12 240);
  --chart-1: oklch(0.70 0.12 240);
  --chart-2: oklch(0.60 0.10 240);
  --chart-3: oklch(0.50 0.08 240);
  --chart-4: oklch(0.40 0.06 240);
  --chart-5: oklch(0.30 0.04 240);
  --sidebar: oklch(1 0 0 / 4%);
  --sidebar-foreground: oklch(0.93 0.003 260);
  --sidebar-primary: oklch(0.70 0.12 240);
  --sidebar-primary-foreground: oklch(0.12 0.01 260);
  --sidebar-accent: oklch(0.65 0.10 240 / 20%);
  --sidebar-accent-foreground: oklch(0.90 0.005 260);
  --sidebar-border: oklch(1 0 0 / 6%);
  --sidebar-ring: oklch(0.70 0.12 240);
  --surface: oklch(1 0 0 / 4%);
  --surface-hover: oklch(1 0 0 / 8%);
  --text-secondary: oklch(0.58 0.01 260);
  --text-tertiary: oklch(0.45 0.01 260);
  --glass-bg: oklch(1 0 0 / 5%);
  --glass-border: oklch(1 0 0 / 10%);
  --chrome-accent: linear-gradient(135deg, oklch(0.75 0.12 240), oklch(0.65 0.10 260));
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

/* Background gradient halo */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.65 0.08 240 / 6%), transparent),
    radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.55 0.06 260 / 5%), transparent);
}

.dark body::before {
  background:
    radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.65 0.10 240 / 8%), transparent),
    radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.55 0.08 260 / 6%), transparent);
}

/* Glass utility */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.glass-strong {
  background: oklch(1 0 0 / 75%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid oklch(1 0 0 / 80%);
}

.dark .glass-strong {
  background: oklch(1 0 0 / 8%);
  border: 1px solid oklch(1 0 0 / 12%);
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: overhaul CSS variables for glass-chrome dual-mode theme"
```

---

### Task 3: Sidebar Glass Redesign

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

**Step 1: Redesign sidebar**

Replace the sidebar content with glass-styled version. Key changes:
- Floating from viewport edge (not flush)
- Glass background with backdrop-blur
- New active indicator: subtle inner glow with chrome left border
- DM Serif Display for "ImageForge" logo
- Manrope body (inherited)

Replace `src/components/layout/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Clock, Settings, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import clsx from "clsx";

const links = [
  { href: "/generate", label: "Generate", icon: ImageIcon },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-60 h-screen flex flex-col shrink-0 px-3 py-4">
      {/* Logo */}
      <div className="px-3 pb-5 pt-1">
        <span className="font-display text-xl text-foreground tracking-tight">
          ImageForge
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent text-accent-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="pt-2">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-foreground w-full transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat: glass sidebar with floating layout and display font logo"
```

---

### Task 4: Topbar Glass Redesign + Theme Toggle

**Files:**
- Modify: `src/components/layout/topbar.tsx`
- Modify: `src/components/layout/theme-toggle.tsx` (if exists)

**Step 1: Redesign topbar**

Replace `src/components/layout/topbar.tsx` to be transparent with glass blur and include the theme toggle:

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "./theme-toggle";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  return (
    <header className="h-12 flex items-center justify-between px-6 shrink-0 glass border-b border-border/50">
      <span className="text-xs text-text-tertiary font-medium">Generate anything</span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-xs text-text-secondary font-medium">{email}</span>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/topbar.tsx src/components/layout/theme-toggle.tsx
git commit -m "feat: glass topbar with theme toggle"
```

---

### Task 5: Dashboard Layout Glass Treatment

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`

**Step 1: Update dashboard layout**

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
```

Only change: `p-6` → `p-8` for more breathing room.

**Step 2: Commit**

```bash
git add src/app/\(dashboard\)/layout.tsx
git commit -m "feat: increase dashboard content padding"
```

---

### Task 6: Landing Page Redesign

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Redesign landing page**

Replace `src/app/page.tsx`:

```tsx
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
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: glass-chrome landing page with display typography"
```

---

### Task 7: Auth Pages Redesign

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/components/auth/auth-form.tsx`

**Step 1: Update login page**

Replace `src/app/(auth)/login/page.tsx`:

```tsx
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
```

**Step 2: Update register page**

Replace `src/app/(auth)/register/page.tsx`:

```tsx
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
        <h2 className="font-display text-2xl mb-6 text-foreground">Create Account</h2>
        <AuthForm mode="register" />
        <p className="mt-4 text-text-secondary text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
```

**Step 3: Update auth form**

Replace `src/components/auth/auth-form.tsx` — update the button to use chrome gradient:

The only change to the auth form is making the button use the chrome gradient. Replace the `<Button>` line:

```tsx
<Button
  type="submit"
  className="w-full h-9 font-semibold"
  style={{ background: "var(--chrome-accent)" }}
  disabled={loading}
>
  {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
</Button>
```

**Step 4: Commit**

```bash
git add src/app/\(auth\)/login/page.tsx src/app/\(auth\)/register/page.tsx src/components/auth/auth-form.tsx
git commit -m "feat: glass-chrome auth pages with card containers"
```

---

### Task 8: Generate Page Components Redesign

**Files:**
- Modify: `src/components/generate/generate-form.tsx`
- Modify: `src/components/generate/feature-tabs.tsx`
- Modify: `src/components/generate/generation-preview.tsx`
- Modify: `src/components/generate/prompt-input.tsx`
- Modify: `src/components/generate/config-panel.tsx`

**Step 1: Update generate form layout**

Modify `src/components/generate/generate-form.tsx` to wrap panels in glass containers and use chrome button:

```tsx
"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { ModelSelector } from "./model-selector";
import { ConfigPanel } from "./config-panel";
import { ModeToggle } from "./mode-toggle";
import { useGenerate } from "@/lib/hooks/use-generate";
import { GenerationPreview } from "./generation-preview";

interface GenerateFormProps {
  type: "text_to_image" | "image_to_image" | "edit" | "remove_bg";
}

export function GenerateForm({ type }: GenerateFormProps) {
  const [provider, setProvider] = useState("gemini");
  const [mode, setMode] = useState<"sync" | "async">("sync");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { generate, loading, result, error } = useGenerate();

  async function handleSubmit() {
    await generate({
      provider,
      type,
      mode,
      prompt,
      negativePrompt,
      aspectRatio,
      imageCount,
    });
  }

  return (
    <div className="flex gap-8">
      {/* Left panel */}
      <div className="w-[380px] shrink-0 space-y-4">
        <div className="glass-strong rounded-xl p-4 space-y-4">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
          />
        </div>

        <div className="glass rounded-xl p-4 space-y-4">
          <ModelSelector value={provider} onChange={setProvider} />
          <ConfigPanel
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            imageCount={imageCount}
            onImageCountChange={setImageCount}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-text-secondary hover:text-foreground transition-colors font-medium"
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {showAdvanced && (
          <div className="glass rounded-xl p-4">
            <ModeToggle value={mode} onChange={setMode} />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full h-10 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--chrome-accent)" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Right panel */}
      <div className="flex-1">
        <GenerationPreview result={result} loading={loading} />
      </div>
    </div>
  );
}
```

**Step 2: Update feature tabs with chrome active indicator**

Modify `src/components/generate/feature-tabs.tsx` — add font-medium to triggers and a tighter design:

No major structural changes needed, just style tweaks. The tabs already use the `line` variant. Ensure the active indicator color matches the chrome accent.

**Step 3: Update generation preview**

Modify `src/components/generate/generation-preview.tsx` — glass background for placeholder, rounded-xl:

Change the empty state border wrapper to use `glass` class and `rounded-xl`.

**Step 4: Update prompt input**

Modify `src/components/generate/prompt-input.tsx` — lighter label treatment:

Change label to not use uppercase tracking-wide, use `font-medium`.

**Step 5: Update config panel**

Modify `src/components/generate/config-panel.tsx` — chrome active segment:

Change the active segment from `bg-accent` to use chrome gradient background.

**Step 6: Commit**

```bash
git add src/components/generate/
git commit -m "feat: glass-chrome generate page with panel containers and chrome buttons"
```

---

### Task 9: History Page Redesign

**Files:**
- Modify: `src/app/(dashboard)/history/page.tsx`
- Modify: `src/components/history/task-card.tsx`
- Modify: `src/components/history/task-list.tsx`

**Step 1: Update history page heading**

Modify `src/app/(dashboard)/history/page.tsx` — use DM Serif Display for heading:

Change `h1` to use `font-display`.

**Step 2: Update task card with glass hover**

Modify `src/components/history/task-card.tsx` — glass card with lift hover effect:

```tsx
<div className="group rounded-xl overflow-hidden glass transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
```

**Step 3: Update empty state**

Modify `src/components/history/task-list.tsx` — cleaner empty state with DM Serif Display.

**Step 4: Commit**

```bash
git add src/app/\(dashboard\)/history/page.tsx src/components/history/
git commit -m "feat: glass-chrome history page with lift-hover cards"
```

---

### Task 10: Settings Page Redesign

**Files:**
- Modify: `src/app/(dashboard)/settings/page.tsx`

**Step 1: Redesign settings page**

Replace `src/app/(dashboard)/settings/page.tsx` with glass containers and display heading:

```tsx
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
```

**Step 2: Commit**

```bash
git add src/app/\(dashboard\)/settings/page.tsx
git commit -m "feat: glass-chrome settings page with display typography"
```

---

### Task 11: UI Button Chrome Gradient

**Files:**
- Modify: `src/components/ui/button.tsx`

**Step 1: Add chrome variant to button**

Modify the default button variant to use the chrome gradient for primary actions:

In `buttonVariants`, change the `default` variant:

```tsx
default: "text-primary-foreground hover:opacity-90 hover:shadow-lg disabled:hover:shadow-none",
```

And in the Button component, apply the chrome gradient as inline style for the default variant:

```tsx
function Button({
  className,
  variant = "default",
  size = "default",
  style,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { style?: React.CSSProperties }) {
  const isDefault = variant === "default" || (!variant);
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        ...(isDefault ? { background: "var(--chrome-accent)" } : {}),
        ...style,
      }}
      {...props}
    />
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ui/button.tsx
git commit -m "feat: chrome gradient on default button variant"
```

---

### Task 12: Motion & Animation Pass

**Files:**
- Create: `src/app/globals.css` (append animations)
- Modify: `src/app/(dashboard)/layout.tsx` (if needed for page transitions)

**Step 1: Add CSS animations**

Append to `src/app/globals.css`:

```css
/* Page load stagger */
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-scale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes chrome-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-slide-in-left {
  animation: slide-in-left 250ms ease-out both;
}

.animate-fade-in-up {
  animation: fade-in-up 250ms ease-out both;
  animation-delay: 80ms;
}

.animate-fade-in-scale {
  animation: fade-in-scale 300ms ease-out both;
}

/* Stagger children */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
.stagger > *:nth-child(6) { animation-delay: 300ms; }
```

**Step 2: Apply animations to dashboard layout**

Modify the dashboard layout to add animation classes:

```tsx
<main className="flex-1 overflow-auto p-8 animate-fade-in-up">{children}</main>
```

And the sidebar:

```tsx
<aside className="w-60 h-screen flex flex-col shrink-0 px-3 py-4 animate-slide-in-left">
```

**Step 3: Commit**

```bash
git add src/app/globals.css src/app/\(dashboard\)/layout.tsx src/components/layout/sidebar.tsx
git commit -m "feat: add page load stagger animations"
```

---

### Task 13: Final Verification & Polish

**Step 1: Start dev server and verify**

```bash
npm run dev
```

Check:
- http://localhost:3000 — landing page with DM Serif Display, glass effect
- http://localhost:3000/login — glass card, chrome button
- http://localhost:3000/generate — glass panels, chrome generate button, animations
- http://localhost:3000/history — glass cards, lift hover
- http://localhost:3000/settings — glass containers, display headings
- Toggle light/dark — smooth transition, all pages render correctly
- Background gradient halos visible in both modes

**Step 2: Commit any final tweaks**

```bash
git add -A
git commit -m "chore: final polish and verification fixes"
```
