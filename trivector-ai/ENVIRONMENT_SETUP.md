# Environment Setup Guide for Trivector.AI

This guide will help you configure your development and production environments for the Trivector.AI project.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd trivector-ai
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local  # or use your preferred editor
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Environment Variables

### Required for Development

Create a `.env.local` file with these minimum variables:

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Optional but Recommended

For full functionality, add these variables:

```bash
# AI Provider Keys (add at least one if using AI features)
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_ai_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here

# External Services
PYTHON_SERVICE_URL=http://localhost:8000
```

### Environment Variable Types

This project uses type-safe environment variables with Zod validation. Variables are categorized into:

1. **Public Variables** (prefixed with `NEXT_PUBLIC_`)
   - Exposed to the browser
   - Safe to use in client-side code
   - Examples: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`

2. **Private Variables** (no prefix)
   - Only available on the server
   - Never exposed to the browser
   - Examples: `ANTHROPIC_API_KEY`, `DATABASE_URL`

## Local Development Setup

### Using npm (Recommended)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Using Docker

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

The application will be available at:
- Next.js App: [http://localhost:3000](http://localhost:3000)
- Python Service: [http://localhost:8000](http://localhost:8000)

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI** (optional, for CLI deployment)

```bash
npm install -g vercel
```

2. **Configure Environment Variables in Vercel Dashboard**

Visit your Vercel project settings and add these environment variables:

**Production Variables:**
```
NEXT_PUBLIC_APP_URL=https://trivector.ai
NEXT_PUBLIC_API_URL=https://trivector.ai/api
ANTHROPIC_API_KEY=<your-production-key>
OPENAI_API_KEY=<your-production-key>
# Add other API keys as needed
```

**Preview Variables (optional):**
```
NEXT_PUBLIC_APP_URL=https://preview.trivector.ai
NEXT_PUBLIC_API_URL=https://preview.trivector.ai/api
# Use separate API keys for preview if desired
```

3. **Deploy from GitHub**

Vercel automatically deploys when you push to your main branch. For manual deployment:

```bash
vercel --prod
```

### Multi-Region Deployment

The project is configured to deploy to multiple regions for better performance:
- **iad1**: US East (Virginia)
- **sfo1**: US West (San Francisco)
- **lhr1**: Europe (London)

You can modify regions in `vercel.json`:

```json
{
  "regions": ["iad1", "sfo1", "lhr1", "syd1"]
}
```

Available regions:
- `iad1` - Washington, D.C., USA
- `sfo1` - San Francisco, USA
- `lhr1` - London, UK
- `hnd1` - Tokyo, Japan
- `gru1` - São Paulo, Brazil
- `syd1` - Sydney, Australia

### Security Headers

The project includes production-ready security headers in `vercel.json`:
- HTTPS enforcement (HSTS)
- XSS protection
- Frame options (prevent clickjacking)
- Content type sniffing prevention
- Referrer policy
- Permissions policy

### CORS Configuration

API routes are configured with CORS headers. For production, update the allowed origin in `vercel.json`:

```json
{
  "key": "Access-Control-Allow-Origin",
  "value": "https://trivector.ai"
}
```

For multiple origins, create a middleware file:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = [
  'https://trivector.ai',
  'https://www.trivector.ai',
  'https://preview.trivector.ai'
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', origin)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

## Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t trivector-ai .

# Run the container
docker run -p 3000:3000 --env-file .env.local trivector-ai
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

### Environment Variables in Docker

Create a `.env.docker` file for Docker-specific variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Internal service URLs (Docker network)
PYTHON_SERVICE_URL=http://icf:8000

# API Keys
ANTHROPIC_API_KEY=your_key_here
```

Then update `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .env.docker
```

## Security Best Practices

### 1. Never Commit Secrets

Ensure these files are in `.gitignore`:
```
.env
.env.local
.env.production
.env.development
.env.docker
.env*.local
```

### 2. Use Different Keys for Each Environment

- Development: Use test/sandbox API keys
- Staging: Use separate staging keys
- Production: Use production keys with appropriate rate limits

### 3. Rotate API Keys Regularly

Update your API keys periodically:
1. Generate new keys in provider dashboards
2. Update in Vercel environment variables
3. Deploy to apply changes
4. Revoke old keys

### 4. Validate Environment Variables

The project includes automatic validation in `src/lib/env.ts`:
- Required variables will cause build failures if missing
- Type checking ensures correct formats
- Helpful error messages during development

### 5. Use Vercel Secret Storage

For sensitive variables in Vercel:

```bash
# Add a secret
vercel secrets add my-api-key "actual-secret-value"

# Reference in vercel.json or environment variables
# Environment Variable: MY_API_KEY
# Value: @my-api-key
```

## Troubleshooting

### Build Failures

**Issue:** Build fails with "Invalid environment variables"

**Solution:**
1. Check the error message for missing variables
2. Add them to your `.env.local` or Vercel dashboard
3. Ensure correct formatting (URLs must be valid, etc.)

```bash
# Validate your environment locally
npm run build
```

### API Connection Issues

**Issue:** Cannot connect to Python service

**Solution:**
1. Check `PYTHON_SERVICE_URL` is set correctly
2. For Docker: Use service name (e.g., `http://icf:8000`)
3. For local: Use `http://localhost:8000`
4. Verify the service is running:

```bash
curl http://localhost:8000/health
```

### CORS Errors

**Issue:** CORS errors in browser console

**Solution:**
1. Check the origin is allowed in `vercel.json`
2. For development, you may need to allow `http://localhost:3000`
3. Update the CORS configuration to include your origin

### Environment Variables Not Loading

**Issue:** Environment variables are `undefined` in code

**Solution:**
1. Restart the development server after changing `.env.local`
2. For client-side access, ensure variable is prefixed with `NEXT_PUBLIC_`
3. Import from `@/lib/env` instead of using `process.env` directly:

```typescript
// ❌ Don't use process.env directly
const url = process.env.NEXT_PUBLIC_APP_URL

// ✅ Use the validated env object
import { env } from '@/lib/env'
const url = env.NEXT_PUBLIC_APP_URL
```

### Type Errors

**Issue:** TypeScript errors related to environment variables

**Solution:**
1. Ensure `src/lib/env.ts` is included in your TypeScript compilation
2. Check `tsconfig.json` includes the `src` directory
3. Run type checking:

```bash
npx tsc --noEmit
```

## Getting API Keys

### Anthropic Claude
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env.local` as `ANTHROPIC_API_KEY`

### OpenAI
1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new secret key
4. Add to `.env.local` as `OPENAI_API_KEY`

### Google Generative AI
1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create an API key
4. Add to `.env.local` as `GOOGLE_API_KEY`

### HuggingFace
1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Create a new access token
4. Add to `.env.local` as `HUGGINGFACE_API_KEY`

## Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Zod Documentation](https://zod.dev/)

## Support

If you encounter issues not covered in this guide:
1. Check the project's GitHub issues
2. Review Vercel deployment logs
3. Verify all environment variables are correctly set
4. Ensure you're using Node.js version 20 or higher

For more help, create an issue in the GitHub repository with:
- Detailed description of the problem
- Error messages (with secrets redacted)
- Environment (local/Vercel/Docker)
- Steps to reproduce
