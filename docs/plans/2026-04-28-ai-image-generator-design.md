# AI Image Generator — Design Document

**Date:** 2026-04-28  
**Status:** Approved  
**Stack:** Next.js 16, React 19, Better Auth, Prisma + PostgreSQL

## Overview

A consumer-facing SaaS product for AI image generation. Users authenticate, manage their own API keys for various AI image models, and generate images via text-to-image, image-to-image, image editing, and background removal — in both synchronous and asynchronous modes.

## Architecture

```
Client (React 19)
  → Next.js 16 API Routes (Server Components + Server Actions)
    → Better Auth Middleware (session, rate limiting)
      → Task Queue (sync + async)
      → Provider Router (unified adapter pattern)
      → Storage Manager (local filesystem → S3 later)
      → Prisma (PostgreSQL)
```

External AI Providers: Gemini Nano Banana, Qwen Image, GPT Image, Stable Diffusion, Seedream

## AI Provider Abstraction

Unified `ImageProvider` interface with per-provider implementations:

```ts
interface ImageProvider {
  readonly id: string;
  readonly capabilities: { textToImage, imageToImage, imageEdit, removeBackground };
  generate(params: ImageGenerationInput): Promise<GenerationResult>;
  edit(params: ImageEditInput): Promise<GenerationResult>;
  removeBackground(params: RemoveBgInput): Promise<GenerationResult>;
}
```

Provider files: `lib/providers/{gemini,gpt-image,qwen,stable-diffusion,seedream}.ts`

Each provider encapsulates its own API parameters accurately per official documentation.

## Database Schema

- **User** — email, name, avatar, credits
- **Task** — type (text_to_image|image_to_image|edit|remove_bg), mode (sync|async), status (pending|processing|completed|failed), provider, input JSON, output JSON, cost
- **ApiKey** — per-user per-provider encrypted key storage

## Frontend Routes & Components

```
/(marketing)/page.tsx          Landing
/(auth)/login, /register       Auth pages
/(dashboard)/layout            Shell with sidebar + topbar
/(dashboard)/generate          Main workspace with feature tabs
/(dashboard)/history           Task history list
/(dashboard)/settings          API keys management + account
```

Main workspace: FeatureTabs → GenerateForm (PromptInput, ImageUploader, ModelSelector, ConfigPanel, ModeToggle) → GenerationPreview (ImageGrid, ImageDetail)

UX: dark theme, drag-drop upload, clipboard paste, prompt history (localStorage), cost display before generation

## Auth (Better Auth)

- Email/Password + Google OAuth + GitHub OAuth
- JWT session (cookie-based)
- Middleware protects /(dashboard)/* and /api/generate/*
- Rate limiting per-user on generate endpoints

## Billing (Credit System)

- 50 free credits on signup
- Per-model credit cost: Gemini 2, SD 2, Qwen 3, Seedream 3, GPT 5, Remove BG 1
- MVP: credits deducted on success; no real payment yet
- Future: Stripe Checkout for credit packs

## Async Task Queue

- MVP: Database polling — POST creates pending task, frontend polls `GET /api/tasks/:id` every 3s
- Production upgrade path: Inngest or Trigger.dev
- API: POST /api/generate/async → { taskId, status: "pending" }
- API: GET /api/tasks/:id → full task with output

## Storage

- Development: `public/input/{userId}/{taskId}/` and `public/output/{userId}/{taskId}/`
- Adapter pattern for later migration to S3/R2

## Phases

1. Project scaffold + Auth + DB + frontend shell
2. Provider abstraction + Gemini + GPT Image
3. Qwen + SD + Seedream + async queue
4. Image-to-image + edit + remove BG + credits
5. History, polish, download
