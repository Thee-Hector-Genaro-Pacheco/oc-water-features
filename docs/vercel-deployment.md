# Vercel Deployment Guide - Dynamic Next.js App Router

This guide documents the actual production hosting setup for the OC Water Features web application.

## Overview

The OC Water Features website runs as a dynamic Next.js 15 App Router application with Server Components, Route Handlers, Supabase PostgreSQL, and Supabase SSR Authentication, deployed on **Vercel**.

Production domain: `https://www.ocwaterfeaturesinc.com` (apex `ocwaterfeaturesinc.com` 308-redirects to `www`). Both are served directly by Vercel's edge network (confirmed via `server: Vercel` / `x-vercel-id` response headers and `vercel-dns` nameserver records).

*Note: The project does not use static export (`output: "export"`) — it is a standard dynamic Next.js deploy, which is why no `vercel.json` is required in the repo (zero-config detection).*

## Deployment Pipeline

1. The GitHub repository (`Thee-Hector-Genaro-Pacheco/oc-water-features`) is connected to a Vercel project via Vercel's native GitHub integration.
2. Pushes to `main` trigger an automatic production deployment. Pushes to other branches (and pull requests) get their own Vercel preview deployments.
3. No manual build/deploy step is required — Vercel runs `npm install` and `next build` automatically using its zero-config Next.js detection.

## Environment Variables (configured in the Vercel Project Settings, not in this repo)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL` (production value: `https://www.ocwaterfeaturesinc.com`)
- `BUSINESS_NOTIFICATION_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `GOOGLE_SITE_VERIFICATION`
- `RESEND_API_KEY`
- `EMAIL_FROM_ADDRESS`

Changing any of these requires a redeploy (or takes effect on the next automatic deploy) — set them in the Vercel dashboard under the project's **Settings → Environment Variables**.
