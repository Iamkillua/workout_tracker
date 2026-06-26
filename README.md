# FitTrack — Gym Workout Tracker

A full-featured gym workout tracker built with Next.js 16, featuring glassmorphism UI, BMI tracking, workout progress charts, and CSV export. Mobile-friendly with full PWA support (installable, offline capable).

## Features

- 🔐 **Authentication** — Username/password login & registration (NextAuth v4, JWT)
- 📊 **BMI Tracking** — Calculates BMI from age/height/weight, shows history graph
- 💪 **Workout Types** — Weights/Machines · Bodyweight · Treadmill · Cycling
- 📈 **Progress Charts** — Interactive history charts per workout (Recharts)
- 📁 **CSV Export** — Full date-wise export for every workout
- 📱 **PWA** — Install to home screen, works offline
- 🌌 **Glassmorphism UI** — Dark purple gradient with backdrop-blur glass cards

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | NextAuth.js v4 — credentials + JWT |
| Database ORM | Prisma 6 |
| Dev database | SQLite |
| Prod database | PostgreSQL (any provider) |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |

---

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create the SQLite development database and run migrations
npx prisma migrate dev --name init

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `.env.local` is already pre-configured for local SQLite — no extra setup needed.

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## Deployment

### Environment Variables

All deployments require these three variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | Secret used to sign JWTs — **must be random and kept private** | *(see below)* |
| `NEXTAUTH_URL` | Full public URL of your deployment | `https://fittrack.vercel.app` |

**Generate a secure `NEXTAUTH_SECRET`:**

```bash
# Option 1 — openssl (Linux/macOS/WSL)
openssl rand -base64 32

# Option 2 — Node.js (any platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Switch Prisma to PostgreSQL

Before any production deployment, update `prisma/schema.prisma`:

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

Then regenerate and run migrations against your production database:

```bash
npx prisma generate
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

### Option A — Vercel (Recommended)

Vercel is the simplest option: zero-config CI/CD, global edge network, free tier.

#### Step 1 — Create a PostgreSQL database

Choose one of these free-tier options:

| Provider | Free tier | Notes |
|---|---|---|
| **[Neon](https://neon.tech)** | 0.5 GB, serverless | Best for serverless/edge; has a Vercel integration |
| **[Supabase](https://supabase.com)** | 500 MB, 2 projects | Full Postgres with dashboard |
| **[Railway](https://railway.app)** | $5 credit/month free | Great DX |
| **[Aiven](https://aiven.io)** | 1 free service | Enterprise-grade |

#### Step 2 — Update the Prisma schema

Change the provider to `postgresql` as shown above.

#### Step 3 — Push your code to GitHub

```bash
git init          # if not already a repo
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fittrack.git
git push -u origin main
```

#### Step 4 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Vercel auto-detects Next.js — no build settings needed.
3. In **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | Your generated secret |
   | `NEXTAUTH_URL` | Leave **blank** — Vercel sets this automatically from the deployment URL |

4. Click **Deploy**.

Vercel runs `npm run build` which executes `prisma generate && next build` automatically.

#### Step 5 — Run database migrations

After the first deploy, run migrations against your production database **once**:

```bash
# From your local machine with the production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

Or use the Vercel CLI:

```bash
npx vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma migrate deploy
```

#### Neon + Vercel Integration (fastest path)

If you chose Neon, use the official integration to skip manual env var setup:

1. In your Vercel project → **Storage** tab → **Connect Store** → **Neon**.
2. Neon automatically injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into your Vercel environment.
3. Set `NEXTAUTH_SECRET` manually, then redeploy.

---

### Option B — Railway

Railway lets you deploy the app **and** database together in one project.

#### Step 1 — Create a Railway project

1. Sign in at [railway.app](https://railway.app).
2. **New Project** → **Deploy from GitHub repo** → select your repo.
3. Railway detects Node.js and will build using `npm run build`.

#### Step 2 — Add a PostgreSQL database

1. In your Railway project, click **+ New** → **Database** → **PostgreSQL**.
2. Go to your PostgreSQL service → **Connect** tab → copy the **DATABASE_URL**.

#### Step 3 — Set environment variables

In your app service → **Variables** tab, add:

```
DATABASE_URL=postgresql://...   ← from step 2
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://<your-railway-domain>.railway.app
```

Railway injects `PORT` automatically; Next.js picks it up.

#### Step 4 — Run migrations

Open the Railway shell for your app service:

```bash
npx prisma migrate deploy
```

Or add a one-time **Migration Service** in Railway with the command:

```bash
npx prisma migrate deploy
```

---

### Option C — Self-hosted (VPS / Docker)

#### Docker Compose

Create a `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: fittrack
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: fittrack
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://fittrack:changeme@db:5432/fittrack
      NEXTAUTH_SECRET: <your-secret>
      NEXTAUTH_URL: https://yourdomain.com
    depends_on:
      - db
    command: >
      sh -c "npx prisma migrate deploy && npm run start"

volumes:
  pgdata:
```

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXTAUTH_SECRET=build-time-placeholder
ENV NEXTAUTH_URL=http://localhost:3000
ENV DATABASE_URL=file:/tmp/build.db
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

> **Note:** For the standalone Docker output, add `output: "standalone"` to `next.config.ts`.

**Start everything:**

```bash
docker compose up -d
```

#### Nginx reverse proxy (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Get a free TLS certificate with Certbot:

```bash
certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Checklist

- [ ] `DATABASE_URL` points to a **PostgreSQL** database (not SQLite)
- [ ] `prisma/schema.prisma` provider is set to `"postgresql"`
- [ ] `NEXTAUTH_SECRET` is a random 32+ byte string, **not** the development placeholder
- [ ] `NEXTAUTH_URL` matches your exact public URL (including `https://`)
- [ ] `npx prisma migrate deploy` has been run against the production database
- [ ] App loads at your public URL and you can register + log in
- [ ] PWA manifest is reachable at `https://yourdomain.com/manifest.webmanifest`
- [ ] Chrome DevTools → Application → Service Workers shows the SW registered

---

## Troubleshooting

### `PrismaClientInitializationError` on first boot
The database tables don't exist yet. Run:
```bash
npx prisma migrate deploy
```

### `NEXTAUTH_URL` mismatch / redirect loop
Make sure `NEXTAUTH_URL` exactly matches the URL in your browser, including the protocol (`https://`) and no trailing slash.

### Build fails with `Environment variable not found: DATABASE_URL`
The `postinstall` script runs `prisma generate` which reads the schema but **does not** need a live database. Make sure `DATABASE_URL` is set in your CI/build environment even if it's a dummy value during the build step. On Vercel this is handled automatically.

### Service worker not updating
Hard-reload: **Ctrl+Shift+R** (or Cmd+Shift+R on Mac). Or in DevTools → Application → Service Workers → **Update**.

### PWA install banner not showing
The install prompt only appears in Chrome/Edge on HTTPS with a valid manifest and an active service worker. It will not appear on `localhost` in all browsers — test on your production URL.

### SQLite `SQLITE_CANTOPEN` error
Never use SQLite in production on serverless platforms — file writes are not persistent. Use PostgreSQL.

