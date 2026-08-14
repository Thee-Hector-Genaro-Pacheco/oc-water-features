# AWS Amplify Deployment Guide - Dynamic Next.js App Router

This guide details the deployment procedure for hosting the dynamic Next.js web application on AWS Amplify.

## Overview

The OC Water Features website runs as a dynamic Next.js 15 App Router application with Server Components, Route Handlers, Supabase PostgreSQL, and Supabase SSR Authentication.

*Note: The project no longer uses static export (`output: "export"`).*

## Step-by-Step AWS Amplify Setup

### 1. Connect Code Repository
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to **AWS Amplify**.
2. Select your repository `oc-water-features` and branch (`main`).

### 2. Configure Environment Variables in AWS Amplify
In AWS Amplify Console under **App settings > Environment variables**, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://ocwaterfeatures.com`)
- `BUSINESS_NOTIFICATION_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `GOOGLE_REVIEW_URL`

### 3. Build Settings (`amplify.yml`)
Amplify will detect Next.js App Router dynamic SSR build:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```
