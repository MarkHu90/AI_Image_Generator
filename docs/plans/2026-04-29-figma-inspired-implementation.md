# Figma-Inspired UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all pages with a Figma-inspired dark tool aesthetic — de-AI-fied, clean, cool, scannable.

**Architecture:** Update CSS design tokens first (single source of truth), then rewrite each page/component top-down: landing → auth → dashboard shell → generate → history → settings. Each task replaces indigo/purple with blue-gray accent, removes AI clichés, applies hairline borders and refined spacing.

**Tech Stack:** Next.js, Tailwind CSS, shadcn/ui (base-ui), Geist font, Lucide icons

---

### Task 1: Update Design Tokens (globals.css)

**Files:**
- Modify: `src/app/globals.css:51-118` (dark mode :root variables)

**Step 1: Replace dark mode CSS custom properties**

Replace the `.dark` block (lines 86-118) with the new color system:

```css
.dark {
  --background: oklch(0.11 0 0);          /* #0D0D0D */
  --foreground: oklch(0.93 0 0);          /* #EDEDED */
  --card: oklch(0.17 0 0);                /* #1C1C1C */
  --card-foreground: oklch(0.93 0 0);     /* #EDEDED */
  --popover: oklch(0.17 0 0);             /* #1C1C1C */
  --popover-foreground: oklch(0.93 0 0);  /* #EDEDED */
  --primary: oklch(0.65 0.12 265);        /* #6B8CFF blue-gray accent */
  --primary-foreground: oklch(0.11 0 0);  /* #0D0D0D */
  --secondary: oklch(0.20 0 0);           /* #242424 */
  --secondary-foreground: oklch(0.93 0 0);/* #EDEDED */
  --muted: oklch(0.15 0 0);               /* #141414 */
  --muted-foreground: oklch(0.60 0 0);    /* #888888 */
  --accent: oklch(0.20 0 0);              /* #242424 */
  --accent-foreground: oklch(0.93 0 0);   /* #EDEDED */
  --destructive: oklch(0.55 0.18 22);     /* red */
  --border: oklch(1 0 0 / 6%);            /* hairline */
  --input: oklch(1 0 0 / 10%);            /* subtle input border */
  --ring: oklch(0.65 0.12 265);           /* #6B8CFF */
  --chart-1: oklch(0.65 0.12 265);
  --chart-2: oklch(0.55 0.10 265);
  --chart-3: oklch(0.45 0.08 265);
  --chart-4: oklch(0.35 0.06 265);
  --chart-5: oklch(0.25 0.04 265);
  --sidebar: oklch(0.13 0 0);             /* #141414 */
  --sidebar-foreground: oklch(0.93 0 0);  /* #EDEDED */
  --sidebar-primary: oklch(0.65 0.12 265);
  --sidebar-primary-foreground: oklch(0.11 0 0);
  --sidebar-accent: oklch(0.17 0 0);      /* #1C1C1C */
  --sidebar-accent-foreground: oklch(0.93 0 0);
  --sidebar-border: oklch(1 0 0 / 6%);
  --sidebar-ring: oklch(0.65 0.12 265);
}
```

Also update the `:root` (light) block — set primary to blue-gray instead of near-black:

```css
:root {
  --primary: oklch(0.55 0.10 265);
  --primary-foreground: oklch(0.99 0 0);
  --ring: oklch(0.55 0.10 265);
  --chart-1: oklch(0.65 0.12 265);
  --chart-2: oklch(0.55 0.10 265);
  --chart-3: oklch(0.45 0.08 265);
  --chart-4: oklch(0.35 0.06 265);
  --chart-5: oklch(0.25 0.04 265);
  --sidebar-primary: oklch(0.55 0.10 265);
  --sidebar-ring: oklch(0.55 0.10 265);
}
```

Also update the Tailwind `@theme` block to add new color tokens for the subtle surface layers:

```css
@theme inline {
  /* ... existing tokens ... */
  --color-surface: var(--surface);
  --color-surface-hover: var(--surface-hover);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
}
```

And add to `.dark`:
```css
.dark {
  /* ... existing tokens ... */
  --surface: oklch(0.13 0 0);
  --surface-hover: oklch(0.17 0 0);
  --text-secondary: oklch(0.60 0 0);
  --text-tertiary: oklch(0.42 0 0);
}
```

**Step 2: Verify build**

Run: `npm run build` (or `npx next build`)
Expected: No CSS-related errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: update design tokens to Figma-inspired dark palette"
```

---

### Task 2: Redesign Landing Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace landing page content**

Rewrite `src/app/page.tsx`:

```tsx
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
```

Key changes:
- Removed indigo icon container
- Solid white heading (no gradient)
- Product-verb copy: "Create. Edit. Export."
- Single accent CTA + ghost secondary
- Clean, minimal, no AI buzzwords

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign landing page with Figma-inspired minimal style"
```

---

### Task 3: Redesign Auth Pages

**Files:**
- Modify: `src/components/auth/auth-form.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`

**Step 1: Update auth form component**

In `src/components/auth/auth-form.tsx`:
- Replace placeholder-only inputs with visible labels above each input
- Update the link color from `text-indigo-400` to `text-primary`
- Adjust spacing for cleaner look

```tsx
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
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <Button type="submit" className="w-full h-9" disabled={loading}>
        {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
```

**Step 2: Update login page**

In `src/app/(auth)/login/page.tsx`, replace `text-indigo-400` with `text-primary`:

```tsx
<Link href="/register" className="text-primary hover:underline">
  Register
</Link>
```

**Step 3: Update register page**

In `src/app/(auth)/register/page.tsx`, same link color fix:

```tsx
<Link href="/login" className="text-primary hover:underline">
  Sign In
</Link>
```

**Step 4: Commit**

```bash
git add src/components/auth/auth-form.tsx src/app/(auth)/login/page.tsx src/app/(auth)/register/page.tsx
git commit -m "feat: redesign auth pages with labels and accent links"
```

---

### Task 4: Redesign Dashboard Shell

**Files:**
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/topbar.tsx`
- Modify: `src/app/(dashboard)/layout.tsx`

**Step 1: Rewrite sidebar**

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
    <aside className="w-55 h-screen bg-surface flex flex-col shrink-0">
      <div className="px-4 py-4 font-semibold text-sm text-foreground">
        ImageForge
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-accent text-foreground border-l-2 border-primary pl-2.5"
                  : "text-text-secondary hover:bg-surface-hover hover:text-foreground border-l-2 border-transparent pl-2.5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover hover:text-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
```

Key changes:
- Background: `bg-surface` (#141414), no right border
- Active nav: 2px left accent bar + subtle gray bg
- Inactive: secondary text
- Brand: text only, no icon
- No top border before sign out

**Step 2: Simplify topbar**

Replace `src/components/layout/topbar.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background">
      <span className="text-xs text-text-tertiary" />
      <span className="text-xs text-text-secondary">{email}</span>
    </header>
  );
}
```

Key changes:
- Reduced height (h-12 from h-14)
- Removed `bg-card`, use `bg-background` (transparent feel)
- Hairline border inherited from tokens
- Smaller muted text

**Step 3: Update dashboard layout**

In `src/app/(dashboard)/layout.tsx`, update padding:

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
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

(Only change: ensure background colors cascade properly — no direct changes needed beyond sidebar/topbar)

**Step 4: Commit**

```bash
git add src/components/layout/sidebar.tsx src/components/layout/topbar.tsx src/app/\(dashboard\)/layout.tsx
git commit -m "feat: redesign dashboard shell with minimal sidebar and topbar"
```

---

### Task 5: Redesign Generate Page Components

**Files:**
- Modify: `src/app/(dashboard)/generate/page.tsx`
- Modify: `src/components/generate/feature-tabs.tsx`
- Modify: `src/components/generate/generate-form.tsx`
- Modify: `src/components/generate/prompt-input.tsx`
- Modify: `src/components/generate/model-selector.tsx`
- Modify: `src/components/generate/config-panel.tsx`
- Modify: `src/components/generate/mode-toggle.tsx`
- Modify: `src/components/generate/generation-preview.tsx`

**Step 1: Update feature tabs to underline style**

In `src/components/generate/feature-tabs.tsx`, switch to `variant="line"`:

```tsx
<Tabs
  value={value}
  onValueChange={(v) => onChange(v as TaskType)}
>
  <TabsList variant="line">
    {tabs.map((tab) => (
      <TabsTrigger key={tab.value} value={tab.value}>
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

**Step 2: Redesign the generate page layout**

In `src/app/(dashboard)/generate/page.tsx` — no structural change needed, just remove the `space-y-6` wrapper or reduce to `space-y-4`.

**Step 3: Redesign generate form**

Replace `src/components/generate/generate-form.tsx` with cleaner layout:

```tsx
"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { ModelSelector } from "./model-selector";
import { ConfigPanel } from "./config-panel";
import { ModeToggle } from "./mode-toggle";
import { useGenerate } from "@/lib/hooks/use-generate";
import { Button } from "@/components/ui/button";
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
    <div className="flex gap-6">
      <div className="w-[380px] shrink-0 space-y-4">
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          negativePrompt={negativePrompt}
          onNegativePromptChange={setNegativePrompt}
        />
        <ModelSelector value={provider} onChange={setProvider} />
        <ConfigPanel
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          imageCount={imageCount}
          onImageCountChange={setImageCount}
        />
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-text-secondary hover:text-foreground transition-colors"
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>
        {showAdvanced && (
          <>
            <ModeToggle value={mode} onChange={setMode} />
          </>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full h-9"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
      <div className="flex-1">
        <GenerationPreview result={result} loading={loading} />
      </div>
    </div>
  );
}
```

Key changes:
- Narrower left panel (380px from 480px)
- Advanced options collapsed behind toggle
- Cleaner button text

**Step 4: Update prompt input**

Replace `src/components/generate/prompt-input.tsx`:

```tsx
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  negativePrompt?: string;
  onNegativePromptChange?: (value: string) => void;
}

export function PromptInput({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
}: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Prompt
      </label>
      <Textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <span className="text-xs text-text-tertiary">
        {prompt.length} characters
      </span>
      {onNegativePromptChange && (
        <Input
          placeholder="What to avoid (optional)"
          value={negativePrompt ?? ""}
          onChange={(e) => onNegativePromptChange(e.target.value)}
        />
      )}
    </div>
  );
}
```

**Step 5: Update config panel**

Replace `src/components/generate/config-panel.tsx` with segmented button style:

```tsx
"use client";

import clsx from "clsx";

const ratios = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
];

const counts = [1, 2, 4];

interface ConfigPanelProps {
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  imageCount: number;
  onImageCountChange: (value: number) => void;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border overflow-hidden">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-3 py-1.5 text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-accent text-foreground"
              : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ConfigPanel({
  aspectRatio,
  onAspectRatioChange,
  imageCount,
  onImageCountChange,
}: ConfigPanelProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Aspect Ratio
        </span>
        <SegmentedControl
          options={ratios}
          value={aspectRatio}
          onChange={onAspectRatioChange}
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Images
        </span>
        <SegmentedControl
          options={counts.map((c) => ({ value: c, label: String(c) }))}
          value={imageCount}
          onChange={onImageCountChange}
        />
      </div>
    </div>
  );
}
```

**Step 6: Update mode toggle**

Replace `src/components/generate/mode-toggle.tsx` with same SegmentedControl pattern:

```tsx
"use client";

import clsx from "clsx";

interface ModeToggleProps {
  value: "sync" | "async";
  onChange: (value: "sync" | "async") => void;
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Mode
      </span>
      <div className="inline-flex rounded-md border border-border overflow-hidden">
        {(["sync", "async"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium transition-colors capitalize",
              value === mode
                ? "bg-accent text-foreground"
                : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
            )}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 7: Update generation preview**

Replace `src/components/generate/generation-preview.tsx`:

```tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface GenerationPreviewProps {
  result: {
    images: Array<{ url: string }>;
    metadata: {
      provider: string;
      model: string;
      durationMs: number;
      revisedPrompt?: string;
    };
    remainingCredits: number;
  } | null;
  loading: boolean;
}

export function GenerationPreview({ result, loading }: GenerationPreviewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border border-border rounded-lg text-text-secondary">
        <p className="text-sm">Generated images will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {result.images.map((img, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`Generated ${i + 1}`}
              className="w-full rounded-lg"
            />
            <a
              href={img.url}
              download
              className="absolute top-2 right-2 px-3 py-1.5 bg-background/90 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Download
            </a>
          </div>
        ))}
      </div>
      <div className="text-xs text-text-secondary space-y-1">
        <p>
          {result.metadata.model} — {(result.metadata.durationMs / 1000).toFixed(1)}s
        </p>
        {result.metadata.revisedPrompt && (
          <p>Revised: {result.metadata.revisedPrompt}</p>
        )}
        <p>{result.remainingCredits} credits remaining</p>
      </div>
    </div>
  );
}
```

**Step 8: Commit**

```bash
git add src/app/\(dashboard\)/generate/page.tsx \
  src/components/generate/feature-tabs.tsx \
  src/components/generate/generate-form.tsx \
  src/components/generate/prompt-input.tsx \
  src/components/generate/model-selector.tsx \
  src/components/generate/config-panel.tsx \
  src/components/generate/mode-toggle.tsx \
  src/components/generate/generation-preview.tsx
git commit -m "feat: redesign generate page with segmented controls and cleaner layout"
```

---

### Task 6: Redesign History Page

**Files:**
- Modify: `src/app/(dashboard)/history/page.tsx`
- Modify: `src/components/history/task-card.tsx`
- Modify: `src/components/history/task-list.tsx`

**Step 1: Update history page**

Replace `src/app/(dashboard)/history/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { TaskList } from "@/components/history/task-list";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  type: string;
  status: string;
  provider: string;
  createdAt: string;
  output?: { urls?: string[] } | null;
}

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks?limit=50")
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">History</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
```

**Step 2: Update task card**

Replace `src/components/history/task-card.tsx`:

```tsx
"use client";

import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: {
    id: string;
    type: string;
    status: string;
    provider: string;
    createdAt: string;
    output?: { urls?: string[] } | null;
  };
}

const typeLabels: Record<string, string> = {
  text_to_image: "Text to Image",
  image_to_image: "Image to Image",
  edit: "Edit",
  remove_bg: "Remove BG",
};

export function TaskCard({ task }: TaskCardProps) {
  const thumbnail = task.output?.urls?.[0];

  return (
    <div className="group rounded-lg overflow-hidden bg-card border border-border hover:border-border-active transition-colors">
      <div className="aspect-square bg-surface flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text-secondary text-xs">
            {task.status === "processing" ? "Processing..." : "No preview"}
          </span>
        )}
      </div>
      <div className="p-2.5 space-y-1.5">
        <Badge variant="secondary" className="text-[10px]">
          {typeLabels[task.type] ?? task.type}
        </Badge>
        <div className="flex items-center justify-between text-[11px] text-text-secondary">
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          <span className={task.status === "failed" ? "text-red-400" : task.status === "completed" ? "text-primary" : ""}>
            {task.status}
          </span>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Update task list**

Replace `src/components/history/task-list.tsx`:

```tsx
"use client";

import Link from "next/link";
import { TaskCard } from "./task-card";

interface Task {
  id: string;
  type: string;
  status: string;
  provider: string;
  createdAt: string;
  output?: { urls?: string[] } | null;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <p className="text-sm font-medium mb-1">No generations yet</p>
        <p className="text-xs text-text-tertiary mb-4">
          Your generated images will appear here.
        </p>
        <Link
          href="/generate"
          className="text-xs text-primary hover:underline"
        >
          Create your first image
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/\(dashboard\)/history/page.tsx \
  src/components/history/task-card.tsx \
  src/components/history/task-list.tsx
git commit -m "feat: redesign history page with refined card grid and empty state"
```

---

### Task 7: Redesign Settings Page

**Files:**
- Modify: `src/app/(dashboard)/settings/page.tsx`

**Step 1: Redesign settings page**

Replace `src/app/(dashboard)/settings/page.tsx`:

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
```

Key changes:
- Section headers: uppercase, small, secondary color
- Cards: bg-card + hairline border
- Credits: primary accent color
- Danger zone: red-tinged, separated at bottom
- Cleaner spacing (space-y-8 sections)

**Step 2: Commit**

```bash
git add src/app/\(dashboard\)/settings/page.tsx
git commit -m "feat: redesign settings page with grouped sections and danger zone"
```

---

### Task 8: Final Polish Pass

**Files:**
- Check: All pages visually in browser
- Verify: `src/app/globals.css` tokens are consistent

**Step 1: Grep for remaining indigo references**

Run: `rg "indigo" src/ --no-ignore`
Expected: No results (all indigo replaced with primary/accent tokens)

**Step 2: Grep for remaining gradient text AI clichés**

Run: `rg "bg-linear-to-r|bg-clip-text|gradient" src/ --no-ignore`
Expected: No results in component code (globals.css may have library defaults)

**Step 3: Verify build passes**

Run: `npm run build` (or `npx next build`)
Expected: Clean build, no errors

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final polish pass for Figma-inspired redesign"
```
