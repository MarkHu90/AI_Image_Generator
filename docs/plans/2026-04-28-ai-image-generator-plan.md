# AI Image Generator — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a consumer SaaS AI image generator supporting text-to-image, image-to-image, image editing, and background removal across multiple AI providers (Gemini, GPT Image, Qwen, Stable Diffusion, Seedream).

**Architecture:** Next.js 16 App Router with React 19 Server Components. Better Auth for JWT-based authentication. PostgreSQL via Prisma ORM. Unified provider abstraction layer with factory pattern. Local filesystem storage (adapter pattern for future S3 migration). Database-polling async task queue.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Better Auth, Prisma, PostgreSQL, shadcn/ui

**Design Doc:** `docs/plans/2026-04-28-ai-image-generator-design.md`

---

## Phase 1: Project Scaffold + Auth + DB + Frontend Shell

### Task 1.1: Initialize Next.js 16 project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.local`, `.env.example`, `.gitignore`

**Step 1: Create Next.js app**

Run:
```bash
cd /Users/mark.hu/Documents/AI_Image_Generator
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Expected: Next.js 16 project scaffolded in current directory.

**Step 2: Verify dev server starts**

Run:
```bash
npm run dev
```

Open http://localhost:3000 — should see Next.js welcome page.

**Step 3: Create `.env.example`**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_image_gen"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_AI_KEY=""
OPENAI_API_KEY=""
DASHSCOPE_API_KEY=""
STABILITY_API_KEY=""
SEEDREAM_API_KEY=""
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 project with TypeScript and Tailwind"
```

---

### Task 1.2: Install core dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install all dependencies**

```bash
npm install better-auth prisma @prisma/client @better-auth/prisma-adapter
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-toast
npm install lucide-react clsx tailwind-merge
npm install zod react-dropzone sonner
npm install -D @types/node
```

**Step 2: Initialize Prisma**

```bash
npx prisma init
```

Expected: `prisma/schema.prisma` and `.env` created.

**Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input textarea tabs select dialog dropdown-menu toast card avatar badge skeleton tooltip
```

Expected: `src/components/ui/` populated with shadcn components.

**Step 4: Commit**

```bash
git add package.json package-lock.json prisma/ src/components/ui/
git commit -m "chore: install core dependencies and init shadcn/ui"
```

---

### Task 1.3: Set up Prisma schema and database

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db/index.ts`

**Step 1: Write Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  credits   Int      @default(50)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
  sessions  Session[]

  @@map("users")
}

model Task {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String    // text_to_image | image_to_image | edit | remove_bg
  mode        String    // sync | async
  status      String    @default("pending") // pending | processing | completed | failed
  provider    String    // gemini | gpt_image | qwen | stable_diffusion | seedream
  input       Json
  output      Json?
  error       String?
  cost        Int       @default(0)
  createdAt   DateTime  @default(now())
  completedAt DateTime?

  @@index([userId])
  @@index([userId, status])
  @@map("tasks")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("sessions")
}
```

**Step 2: Run migration**

```bash
npx prisma migrate dev --name init
```

Expected: Migration applied, tables created in PostgreSQL.

**Step 3: Create Prisma client singleton**

Write `src/lib/db/index.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

**Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ src/lib/db/
git commit -m "feat: add Prisma schema and database client"
```

---

### Task 1.4: Set up Better Auth

**Files:**
- Create: `src/lib/auth/index.ts`
- Create: `src/app/api/auth/[...all]/route.ts`

**Step 1: Create Better Auth config**

Write `src/lib/auth/index.ts`:

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
});
```

**Step 2: Create auth API route**

Write `src/app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**Step 3: Add env vars to `.env.local`**

```env
BETTER_AUTH_SECRET="generate-a-random-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

**Step 4: Commit**

```bash
git add src/lib/auth/ src/app/api/auth/ .env.local .env.example
git commit -m "feat: set up Better Auth with email and social providers"
```

---

### Task 1.5: Create auth middleware and route protection

**Files:**
- Create: `src/middleware.ts`

**Step 1: Write middleware**

```ts
import { betterAuthMiddleware } from "better-auth/next-js";
import { NextResponse } from "next/server";

const dashboardPaths = ["/generate", "/history", "/settings"];
const authPaths = ["/login", "/register"];

export default betterAuthMiddleware(async (request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  // Protect dashboard routes
  if (dashboardPaths.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL("/generate", request.url));
  }

  return NextResponse.next();
});
```

**Step 2: Verify middleware works**

Run `npm run dev`, visit http://localhost:3000/generate — should redirect to /login.

**Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add route protection middleware"
```

---

### Task 1.6: Create landing page and auth pages

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/components/auth/auth-form.tsx`

**Step 1: Update global styles for dark theme**

Write `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #0a0a0b;
  --color-bg-secondary: #111113;
  --color-bg-tertiary: #1a1a1e;
  --color-border-primary: #232329;
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-accent: #6366f1;
  --color-accent-hover: #818cf8;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

**Step 2: Create landing page**

Write `src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold tracking-tight mb-4">
        AI Image Generator
      </h1>
      <p className="text-lg text-text-secondary max-w-lg mb-8">
        Create stunning images with the world&apos;s best AI models. Text-to-image,
        image editing, background removal — all in one place.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
```

**Step 3: Create AuthForm component**

Write `src/components/auth/auth-form.tsx`:

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
        await authClient.signUp.email({ email, password, name });
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        await authClient.signIn.email({ email, password });
        router.push("/generate");
      }
    } catch (err) {
      toast.error(mode === "login" ? "Sign in failed" : "Registration failed");
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
```

**Step 4: Create login and register pages**

Write `src/app/(auth)/login/page.tsx`:

```tsx
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <AuthForm mode="login" />
      <p className="mt-4 text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent hover:underline">Register</Link>
      </p>
    </main>
  );
}
```

Write `src/app/(auth)/register/page.tsx` similarly (swap login/register labels).

**Step 5: Create auth client**

Write `src/lib/auth/client.ts`:

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();
```

**Step 6: Commit**

```bash
git add src/app/ src/components/auth/ src/lib/auth/client.ts
git commit -m "feat: add landing page and auth pages"
```

---

### Task 1.7: Create dashboard layout shell

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/topbar.tsx`

**Step 1: Create Sidebar**

Write `src/components/layout/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <aside className="w-56 h-screen border-r border-border-primary bg-bg-secondary flex flex-col">
      <div className="p-4 font-bold text-lg">AI Image Gen</div>
      <nav className="flex-1 px-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === href
                ? "bg-accent/10 text-accent"
                : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-border-primary">
        <button
          onClick={() => authClient.signOut().then(() => router.push("/"))}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-bg-tertiary w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
```

**Step 2: Create Topbar**

Write `src/components/layout/topbar.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function Topbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const credits = session?.user?.credits ?? 0;

  return (
    <header className="h-14 border-b border-border-primary bg-bg-secondary flex items-center justify-between px-6">
      <span className="text-sm text-text-secondary">
        Credits: <span className="text-text-primary font-medium">{credits}</span>
      </span>
      <span className="text-sm text-text-secondary">
        {session?.user?.email}
      </span>
    </header>
  );
}
```

**Step 3: Create dashboard layout**

Write `src/app/(dashboard)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/(dashboard)/layout.tsx src/components/layout/
git commit -m "feat: add dashboard layout with sidebar and topbar"
```

---

## Phase 2: Provider Abstraction + Gemini + GPT Image

### Task 2.1: Create provider types and registry

**Files:**
- Create: `src/lib/providers/types.ts`
- Create: `src/lib/providers/registry.ts`

**Step 1: Write provider interface**

Write `src/lib/providers/types.ts`:

```ts
export type TaskType = "text_to_image" | "image_to_image" | "edit" | "remove_bg";

export interface ProviderCapability {
  textToImage: boolean;
  imageToImage: boolean;
  imageEdit: boolean;
  removeBackground: boolean;
}

export interface ImageGenerationInput {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "9:16";
  referenceImage?: string;
  strength?: number;
  imageCount?: number;
  seed?: number;
}

export interface ImageEditInput {
  image: string;
  prompt: string;
  mask?: string;
}

export interface RemoveBgInput {
  image: string;
  format?: "png" | "webp";
}

export interface GenerationResult {
  images: Array<{ data: Buffer; mimeType: string }>;
  metadata: {
    provider: string;
    model: string;
    durationMs: number;
    revisedPrompt?: string;
  };
}

export interface ImageProvider {
  readonly id: string;
  readonly name: string;
  readonly capabilities: ProviderCapability;
  readonly creditCost: number;
  generate(params: ImageGenerationInput): Promise<GenerationResult>;
  edit?(params: ImageEditInput): Promise<GenerationResult>;
  removeBackground?(params: RemoveBgInput): Promise<GenerationResult>;
}

export interface ProviderConfig {
  apiKey: string;
}
```

**Step 2: Write provider registry**

Write `src/lib/providers/registry.ts`:

```ts
import { ImageProvider, ProviderConfig } from "./types";
import { GeminiProvider } from "./gemini";
import { GPTImageProvider } from "./gpt-image";
import { QwenProvider } from "./qwen";
import { StableDiffusionProvider } from "./stable-diffusion";
import { SeedreamProvider } from "./seedream";

type ProviderConstructor = new (config: ProviderConfig) => ImageProvider;

const providerMap: Record<string, ProviderConstructor> = {
  gemini: GeminiProvider,
  gpt_image: GPTImageProvider,
  qwen: QwenProvider,
  stable_diffusion: StableDiffusionProvider,
  seedream: SeedreamProvider,
};

export function getProvider(id: string, apiKey: string): ImageProvider {
  const Ctor = providerMap[id];
  if (!Ctor) throw new Error(`Unknown provider: ${id}`);
  return new Ctor({ apiKey });
}

export function getAvailableProviders(): Array<{
  id: string;
  name: string;
  capabilities: ProviderCapability;
  creditCost: number;
}> {
  // Return metadata without instantiating (no API key needed)
  return [
    { id: "gemini", name: "Gemini Nano Banana", capabilities: { textToImage: true, imageToImage: true, imageEdit: true, removeBackground: false }, creditCost: 2 },
    { id: "gpt_image", name: "GPT Image", capabilities: { textToImage: true, imageToImage: true, imageEdit: true, removeBackground: false }, creditCost: 5 },
    { id: "qwen", name: "Qwen Image", capabilities: { textToImage: true, imageToImage: true, imageEdit: false, removeBackground: false }, creditCost: 3 },
    { id: "stable_diffusion", name: "Stable Diffusion", capabilities: { textToImage: true, imageToImage: true, imageEdit: true, removeBackground: false }, creditCost: 2 },
    { id: "seedream", name: "Seedream", capabilities: { textToImage: true, imageToImage: false, imageEdit: false, removeBackground: false }, creditCost: 3 },
  ];
}
```

**Step 3: Commit**

```bash
git add src/lib/providers/types.ts src/lib/providers/registry.ts
git commit -m "feat: add provider types and registry"
```

---

### Task 2.2: Implement Gemini provider

**Files:**
- Create: `src/lib/providers/gemini.ts`

**Step 1: Implement GeminiProvider**

Write `src/lib/providers/gemini.ts`:

```ts
import { ImageProvider, ImageGenerationInput, GenerationResult, ProviderCapability, ProviderConfig } from "./types";

export class GeminiProvider implements ImageProvider {
  readonly id = "gemini";
  readonly name = "Gemini Nano Banana";
  readonly creditCost = 2;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: true,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    // Gemini 2.0 Flash with image generation (Nano Banana)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: input.prompt }],
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const images: Array<{ data: Buffer; mimeType: string }> = [];

    for (const part of data.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        images.push({
          data: Buffer.from(part.inlineData.data, "base64"),
          mimeType: part.inlineData.mimeType ?? "image/png",
        });
      }
    }

    return {
      images,
      metadata: {
        provider: this.id,
        model: "gemini-2.0-flash-exp-image-generation",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/providers/gemini.ts
git commit -m "feat: implement Gemini provider"
```

---

### Task 2.3: Implement GPT Image provider

**Files:**
- Create: `src/lib/providers/gpt-image.ts`

**Step 1: Implement GPTImageProvider**

Write `src/lib/providers/gpt-image.ts`:

```ts
import { ImageProvider, ImageGenerationInput, GenerationResult, ProviderCapability, ProviderConfig } from "./types";
import OpenAI from "openai";

export class GPTImageProvider implements ImageProvider {
  readonly id = "gpt_image";
  readonly name = "GPT Image";
  readonly creditCost = 5;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: true,
    removeBackground: false,
  };

  private client: OpenAI;

  constructor(config: ProviderConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();
    const size = input.aspectRatio === "16:9" ? "1792x1024"
      : input.aspectRatio === "9:16" ? "1024x1792"
      : "1024x1024";

    const response = await this.client.images.generate({
      model: "dall-e-3",
      prompt: input.prompt,
      n: input.imageCount ?? 1,
      size,
      quality: "standard",
      response_format: "b64_json",
    });

    const images = response.data.map((img) => ({
      data: Buffer.from(img.b64_json!, "base64"),
      mimeType: "image/png",
    }));

    return {
      images,
      metadata: {
        provider: this.id,
        model: "dall-e-3",
        durationMs: Date.now() - startTime,
        revisedPrompt: response.data[0]?.revised_prompt,
      },
    };
  }
}
```

**Step 2: Install OpenAI SDK**

```bash
npm install openai
```

**Step 3: Commit**

```bash
git add src/lib/providers/gpt-image.ts package.json package-lock.json
git commit -m "feat: implement GPT Image (DALL-E 3) provider"
```

---

### Task 2.4: Create generate API route (sync)

**Files:**
- Create: `src/app/api/generate/route.ts`
- Create: `src/lib/credits/index.ts`
- Create: `src/lib/storage/index.ts`

**Step 1: Create credits manager**

Write `src/lib/credits/index.ts`:

```ts
import { db } from "@/lib/db";
import { getAvailableProviders } from "@/lib/providers/registry";

export async function checkCredits(userId: string, providerId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  const providers = getAvailableProviders();
  const provider = providers.find((p) => p.id === providerId);
  if (!provider) return false;
  return user.credits >= provider.creditCost;
}

export async function deductCredits(userId: string, providerId: string): Promise<number> {
  const providers = getAvailableProviders();
  const provider = providers.find((p) => p.id === providerId);
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  const user = await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: provider.creditCost } },
  });
  return user.credits;
}
```

**Step 2: Create storage manager**

Write `src/lib/storage/index.ts`:

```ts
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function saveGeneratedImages(
  userId: string,
  taskId: string,
  images: Array<{ data: Buffer; mimeType: string }>
): Promise<string[]> {
  const dir = path.join(PUBLIC_DIR, "output", userId, taskId);
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const ext = images[i].mimeType === "image/webp" ? "webp" : "png";
    const filename = `${i}.${ext}`;
    await writeFile(path.join(dir, filename), images[i].data);
    urls.push(`/output/${userId}/${taskId}/${filename}`);
  }
  return urls;
}

export async function saveUploadedImage(
  userId: string,
  taskId: string,
  data: Buffer,
  filename: string
): Promise<string> {
  const dir = path.join(PUBLIC_DIR, "input", userId, taskId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);
  return `/input/${userId}/${taskId}/${filename}`;
}
```

**Step 3: Create generate API route**

Write `src/app/api/generate/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProvider } from "@/lib/providers/registry";
import { checkCredits, deductCredits } from "@/lib/credits";
import { saveGeneratedImages } from "@/lib/storage";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { provider: providerId, type, prompt, ...params } = body;

  // Check credits
  const hasCredits = await checkCredits(session.user.id, providerId);
  if (!hasCredits) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  try {
    const envKey = `${providerId.toUpperCase()}_API_KEY`;
    const apiKey = process.env[envKey] ?? "";

    // For MVP, use server-wide API key; later switch to user's own key
    const provider = getProvider(providerId, apiKey);

    const result = await provider.generate({ prompt, ...params });

    // Save images
    const task = await db.task.create({
      data: {
        userId: session.user.id,
        type: type ?? "text_to_image",
        mode: "sync",
        status: "completed",
        provider: providerId,
        input: body,
        output: { urls: [] },
      },
    });

    const urls = await saveGeneratedImages(session.user.id, task.id, result.images);

    // Update task with output URLs
    await db.task.update({
      where: { id: task.id },
      data: {
        output: { urls, metadata: result.metadata },
        completedAt: new Date(),
      },
    });

    // Deduct credits
    const remainingCredits = await deductCredits(session.user.id, providerId);

    return NextResponse.json({
      taskId: task.id,
      images: urls.map((url) => ({ url })),
      metadata: result.metadata,
      remainingCredits,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
```

**Step 4: Commit**

```bash
git add src/app/api/generate/ src/lib/credits/ src/lib/storage/
git commit -m "feat: add sync generate API route with credits and storage"
```

---

### Task 2.5: Create providers list API

**Files:**
- Create: `src/app/api/providers/route.ts`

**Step 1: Write providers API**

```ts
import { NextResponse } from "next/server";
import { getAvailableProviders } from "@/lib/providers/registry";

export async function GET() {
  return NextResponse.json(getAvailableProviders());
}
```

**Step 2: Commit**

```bash
git add src/app/api/providers/
git commit -m "feat: add providers list API endpoint"
```

---

### Task 2.6: Create generate page with frontend components

**Files:**
- Create: `src/app/(dashboard)/generate/page.tsx`
- Create: `src/components/generate/feature-tabs.tsx`
- Create: `src/components/generate/generate-form.tsx`
- Create: `src/components/generate/prompt-input.tsx`
- Create: `src/components/generate/model-selector.tsx`
- Create: `src/components/generate/config-panel.tsx`
- Create: `src/components/generate/mode-toggle.tsx`
- Create: `src/components/generate/generation-preview.tsx`
- Create: `src/lib/hooks/use-generate.ts`

**Step 1: Create useGenerate hook**

Write `src/lib/hooks/use-generate.ts`:

```ts
"use client";

import { useState } from "react";

interface GenerateParams {
  provider: string;
  type: string;
  mode: "sync" | "async";
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  imageCount?: number;
  referenceImage?: string;
  strength?: number;
}

interface GenerationResult {
  taskId: string;
  images: Array<{ url: string }>;
  metadata: { provider: string; model: string; durationMs: number; revisedPrompt?: string };
  remainingCredits: number;
}

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(params: GenerateParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, result, error };
}
```

**Step 2: Create GenerateForm**

Write `src/components/generate/generate-form.tsx`:

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

  const { generate, loading, result, error } = useGenerate();

  async function handleSubmit() {
    await generate({ provider, type, mode, prompt, negativePrompt, aspectRatio, imageCount });
  }

  return (
    <div className="flex gap-6">
      <div className="w-[480px] space-y-4">
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
        <ModeToggle value={mode} onChange={setMode} />
        <Button onClick={handleSubmit} disabled={loading || !prompt} className="w-full">
          {loading ? "Generating..." : "Generate"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex-1">
        <GenerationPreview result={result} loading={loading} />
      </div>
    </div>
  );
}
```

**Step 3: Create individual components**

Write each component stub:

**PromptInput** — textarea with prompt + optional negative prompt textarea, with localStorage prompt history suggestion dropdown.

**ModelSelector** — select dropdown populated from `/api/providers`, showing provider name and credit cost.

**ConfigPanel** — aspect ratio toggle buttons (1:1, 4:3, 16:9, 9:16) + image count selector (1, 2, 4).

**ModeToggle** — sync/async toggle switch.

**GenerationPreview** — image grid or loading skeleton. On mobile, show download button per image.

**FeatureTabs** — horizontal tabs: Text to Image, Image to Image, Edit, Remove BG. Controls which form type is shown.

**Step 4: Create generate page**

Write `src/app/(dashboard)/generate/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { FeatureTabs } from "@/components/generate/feature-tabs";
import { GenerateForm } from "@/components/generate/generate-form";
import type { TaskType } from "@/lib/providers/types";

export default function GeneratePage() {
  const [activeType, setActiveType] = useState<TaskType>("text_to_image");

  return (
    <div className="space-y-6">
      <FeatureTabs value={activeType} onChange={setActiveType} />
      <GenerateForm type={activeType} />
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add src/app/(dashboard)/generate/ src/components/generate/ src/lib/hooks/
git commit -m "feat: add generate page with form components and API integration"
```

---

## Phase 3: Qwen + SD + Seedream + Async Queue

### Task 3.1: Implement Qwen provider

**Files:**
- Create: `src/lib/providers/qwen.ts`

Write `src/lib/providers/qwen.ts`:

```ts
import { ImageProvider, ImageGenerationInput, GenerationResult, ProviderCapability, ProviderConfig } from "./types";

export class QwenProvider implements ImageProvider {
  readonly id = "qwen";
  readonly name = "Qwen Image";
  readonly creditCost = 3;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: false,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();
    const size = input.aspectRatio === "16:9" ? "1792*1024"
      : input.aspectRatio === "9:16" ? "1024*1792"
      : "1024*1024";

    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-max-image-generation",
          input: {
            prompt: input.prompt,
            negative_prompt: input.negativePrompt,
          },
          parameters: {
            size,
            n: input.imageCount ?? 1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const images = await Promise.all(
      data.output.results.map(async (img: { url: string }) => {
        const imgRes = await fetch(img.url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        return { data: buffer, mimeType: "image/png" };
      })
    );

    return {
      images,
      metadata: {
        provider: this.id,
        model: "qwen-max-image-generation",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
```

**Commit:**

```bash
git add src/lib/providers/qwen.ts
git commit -m "feat: implement Qwen Image provider"
```

---

### Task 3.2: Implement Stable Diffusion provider

**Files:**
- Create: `src/lib/providers/stable-diffusion.ts`

Write `src/lib/providers/stable-diffusion.ts`:

```ts
import { ImageProvider, ImageGenerationInput, GenerationResult, ProviderCapability, ProviderConfig } from "./types";

export class StableDiffusionProvider implements ImageProvider {
  readonly id = "stable_diffusion";
  readonly name = "Stable Diffusion";
  readonly creditCost = 2;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: true,
    imageEdit: true,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "multipart/form-data",
        },
        body: (() => {
          const fd = new FormData();
          fd.append("prompt", input.prompt);
          if (input.negativePrompt) fd.append("negative_prompt", input.negativePrompt);
          fd.append("aspect_ratio", input.aspectRatio ?? "1:1");
          fd.append("output_format", "png");
          return fd;
        })(),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status} ${await response.text()}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      images: [{ data: buffer, mimeType: "image/png" }],
      metadata: {
        provider: this.id,
        model: "stable-image-core",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
```

**Commit:**

```bash
git add src/lib/providers/stable-diffusion.ts
git commit -m "feat: implement Stable Diffusion provider"
```

---

### Task 3.3: Implement Seedream provider

**Files:**
- Create: `src/lib/providers/seedream.ts`

Write `src/lib/providers/seedream.ts` — placeholder with actual API endpoint to be confirmed:

```ts
import { ImageProvider, ImageGenerationInput, GenerationResult, ProviderCapability, ProviderConfig } from "./types";

export class SeedreamProvider implements ImageProvider {
  readonly id = "seedream";
  readonly name = "Seedream";
  readonly creditCost = 3;
  readonly capabilities: ProviderCapability = {
    textToImage: true,
    imageToImage: false,
    imageEdit: false,
    removeBackground: false,
  };

  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
  }

  async generate(input: ImageGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    // Seedream API — verify endpoint from official docs
    const response = await fetch("https://api.seedream.example/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        aspect_ratio: input.aspectRatio ?? "1:1",
        num_images: input.imageCount ?? 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Seedream API error: ${response.status}`);
    }

    const data = await response.json();
    // Adapt to actual response shape
    const images = await Promise.all(
      (data.images ?? []).map(async (img: { url: string }) => {
        const imgRes = await fetch(img.url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        return { data: buffer, mimeType: "image/png" };
      })
    );

    return {
      images,
      metadata: {
        provider: this.id,
        model: "seedream",
        durationMs: Date.now() - startTime,
      },
    };
  }
}
```

**Commit:**

```bash
git add src/lib/providers/seedream.ts
git commit -m "feat: implement Seedream provider (placeholder)"
```

---

### Task 3.4: Create async generation API

**Files:**
- Create: `src/app/api/generate/async/route.ts`
- Create: `src/app/api/tasks/[id]/route.ts`
- Create: `src/app/api/tasks/route.ts`

**Step 1: Create async generation endpoint**

Write `src/app/api/generate/async/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkCredits } from "@/lib/credits";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { provider, type, prompt } = body;

  const hasCredits = await checkCredits(session.user.id, provider);
  if (!hasCredits) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const task = await db.task.create({
    data: {
      userId: session.user.id,
      type: type ?? "text_to_image",
      mode: "async",
      status: "pending",
      provider,
      input: body,
    },
  });

  // Kick off background processing
  // In MVP: use fetch to self in a non-blocking way via after()
  // Production: replace with Inngest/Trigger.dev
  if (typeof globalThis !== "undefined") {
    fetch(`${req.nextUrl.origin}/api/generate/async/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id }),
    }).catch(console.error);
  }

  return NextResponse.json({ taskId: task.id, status: "pending" });
}
```

**Step 2: Create task status endpoint**

Write `src/app/api/tasks/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const task = await db.task.findUnique({ where: { id, userId: session.user.id } });

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json(task);
}
```

**Step 3: Create task list endpoint**

Write `src/app/api/tasks/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const tasks = await db.task.findMany({
    where: { userId: session.user.id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(tasks);
}
```

**Step 4: Commit**

```bash
git add src/app/api/generate/async/ src/app/api/tasks/
git commit -m "feat: add async generation API with task polling endpoints"
```

---

## Phase 4: Image-to-Image, Edit, Remove BG + Credits

### Task 4.1: Add image upload support

**Files:**
- Create: `src/components/generate/image-uploader.tsx`
- Create: `src/app/api/upload/route.ts`

**Step 1: Create upload API**

Write `src/app/api/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/storage";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const taskId = formData.get("taskId") as string;

  // Create a temp task for the upload
  const task = await db.task.create({
    data: {
      userId: session.user.id,
      type: "text_to_image",
      mode: "sync",
      provider: "upload",
      input: {},
    },
  });

  const url = await saveUploadedImage(session.user.id, task.id, buffer, file.name);
  return NextResponse.json({ taskId: task.id, url });
}
```

**Step 2: Create ImageUploader component**

Write `src/components/generate/image-uploader.tsx` — uses react-dropzone for drag-and-drop with preview. Supports clipboard paste. Returns the uploaded image URL to the parent form.

**Step 3: Commit**

```bash
git add src/app/api/upload/ src/components/generate/image-uploader.tsx
git commit -m "feat: add image upload API and component"
```

---

### Task 4.2: Extend generate API for image-to-image, edit, remove BG

**Files:**
- Modify: `src/app/api/generate/route.ts`

**Step 1: Update generate route to handle image operations**

Modify the POST handler in `src/app/api/generate/route.ts` to:
- Accept `referenceImage` for image-to-image (pass to provider)
- Accept `mask` for image editing
- Route `remove_bg` type to use a dedicated rembg service or provider's removeBackground method

For remove BG, add a simple adapter using `@imgly/background-removal` (runs locally in browser) or call `remove.bg` API:

```ts
// In remove_bg case:
const buffer = Buffer.from(body.imageBase64, "base64");
const formData = new FormData();
formData.append("image_file", new Blob([buffer]));
const res = await fetch("https://api.remove.bg/v1.0/removebg", {
  method: "POST",
  headers: { "X-Api-Key": process.env.REMOVEBG_API_KEY! },
  body: formData,
});
```

**Step 2: Commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: extend generate API for image-to-image, edit, and remove BG"
```

---

### Task 4.3: Wire up frontend tabs and feature forms

**Files:**
- Modify: `src/components/generate/generate-form.tsx`
- Modify: `src/components/generate/feature-tabs.tsx`

**Step 1: Update GenerateForm to render different input sections based on type**

- `text_to_image`: Prompt input only
- `image_to_image`: Image uploader + prompt + strength slider
- `edit`: Image uploader + canvas mask editor + prompt
- `remove_bg`: Image uploader only

**Step 2: Commit**

```bash
git add src/components/generate/
git commit -m "feat: wire up all feature tabs with appropriate form inputs"
```

---

## Phase 5: History + Polish

### Task 5.1: Create history page

**Files:**
- Create: `src/app/(dashboard)/history/page.tsx`
- Create: `src/components/history/task-list.tsx`
- Create: `src/components/history/task-card.tsx`

**Step 1: Create history page**

Write `src/app/(dashboard)/history/page.tsx` — fetch tasks from `/api/tasks`, display as grid of cards with status badges, click to view full result. Support pagination with "Load More".

**Step 2: Create TaskCard component**

Show thumbnail, provider badge, type, date, status. Click opens full result with download option.

**Step 3: Commit**

```bash
git add src/app/(dashboard)/history/ src/components/history/
git commit -m "feat: add history page with task list"
```

---

### Task 5.2: Create settings page

**Files:**
- Create: `src/app/(dashboard)/settings/page.tsx`

**Step 1: Create settings page**

Write `src/app/(dashboard)/settings/page.tsx`:
- User profile section (email, name)
- Credits display
- API key settings (for future per-user keys)

**Step 2: Commit**

```bash
git add src/app/(dashboard)/settings/
git commit -m "feat: add settings page with profile and credits display"
```

---

### Task 5.3: Polish and final integration

**Files:**
- Modify: various component files

**Step 1: Polish items**

- Add loading skeletons to all pages
- Add toast notifications for all actions (sonner)
- Ensure responsive layout (mobile sidebar collapse)
- Add image download (individual + zip for multi-image)
- Add keyboard shortcuts (Ctrl+Enter to generate)
- Add prompt history in localStorage (last 20 prompts)
- Empty states for history page

**Step 2: Verify full flow**

Test the complete user journey:
1. Register → Login → See 50 credits
2. Select model → Enter prompt → Generate (sync) → See result
3. Generate (async) → Task pending → Poll → See result
4. Upload image → Image-to-image → Generate
5. View history
6. Check settings

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: polish UI, add loading states, empty states, keyboard shortcuts"
```

---

## Appendix: File Tree Summary

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Landing
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── generate/page.tsx
│   │   ├── history/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...all]/route.ts
│       ├── providers/route.ts
│       ├── generate/route.ts
│       ├── generate/async/route.ts
│       ├── tasks/route.ts
│       ├── tasks/[id]/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/                           # shadcn/ui (auto-generated)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   ├── auth/
│   │   └── auth-form.tsx
│   ├── generate/
│   │   ├── feature-tabs.tsx
│   │   ├── generate-form.tsx
│   │   ├── prompt-input.tsx
│   │   ├── image-uploader.tsx
│   │   ├── model-selector.tsx
│   │   ├── config-panel.tsx
│   │   ├── mode-toggle.tsx
│   │   └── generation-preview.tsx
│   └── history/
│       ├── task-list.tsx
│       └── task-card.tsx
├── lib/
│   ├── auth/
│   │   ├── index.ts
│   │   └── client.ts
│   ├── db/
│   │   └── index.ts
│   ├── providers/
│   │   ├── types.ts
│   │   ├── registry.ts
│   │   ├── gemini.ts
│   │   ├── gpt-image.ts
│   │   ├── qwen.ts
│   │   ├── stable-diffusion.ts
│   │   └── seedream.ts
│   ├── storage/
│   │   └── index.ts
│   ├── credits/
│   │   └── index.ts
│   └── hooks/
│       └── use-generate.ts
└── middleware.ts
```
