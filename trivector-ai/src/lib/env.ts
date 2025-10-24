/**
 * Environment Variable Validation and Type Safety
 *
 * This file validates all environment variables at build/runtime using Zod.
 * It ensures type safety and provides helpful error messages if required
 * variables are missing or invalid.
 *
 * Usage:
 *   import { env } from '@/lib/env'
 *   console.log(env.NEXT_PUBLIC_APP_URL)
 */

import { z } from 'zod'

/**
 * Client-side environment variables schema
 * These are exposed to the browser (prefixed with NEXT_PUBLIC_)
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:3000')
    .describe('Public-facing URL of the application'),

  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api')
    .describe('Base URL for API calls'),

  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z
    .string()
    .optional()
    .describe('Vercel Analytics ID (auto-populated by Vercel)'),

  NEXT_PUBLIC_ANALYTICS_ID: z
    .string()
    .optional()
    .describe('Custom analytics tracking ID'),

  NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable experimental features'),

  NEXT_PUBLIC_DEBUG_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable debug mode'),

  NEXT_PUBLIC_ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable API mocking for development'),
})

/**
 * Server-side environment variables schema
 * These are only available on the server (not exposed to browser)
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),

  // AI/ML Provider API Keys
  ANTHROPIC_API_KEY: z
    .string()
    .min(1)
    .optional()
    .describe('Anthropic Claude API key'),

  OPENAI_API_KEY: z
    .string()
    .min(1)
    .optional()
    .describe('OpenAI API key'),

  GOOGLE_API_KEY: z
    .string()
    .min(1)
    .optional()
    .describe('Google Generative AI API key'),

  HUGGINGFACE_API_KEY: z
    .string()
    .min(1)
    .optional()
    .describe('HuggingFace API token'),

  // Vercel Infrastructure
  KV_URL: z
    .string()
    .url()
    .optional()
    .describe('Vercel KV database URL'),

  KV_REST_API_URL: z
    .string()
    .url()
    .optional()
    .describe('Vercel KV REST API URL'),

  KV_REST_API_TOKEN: z
    .string()
    .optional()
    .describe('Vercel KV REST API token'),

  KV_REST_API_READ_ONLY_TOKEN: z
    .string()
    .optional()
    .describe('Vercel KV REST API read-only token'),

  // External Services
  PYTHON_SERVICE_URL: z
    .string()
    .url()
    .default('http://localhost:8000')
    .describe('Python/FastAPI service URL'),

  DATABASE_URL: z
    .string()
    .url()
    .optional()
    .describe('Database connection URL'),

  REDIS_URL: z
    .string()
    .url()
    .optional()
    .describe('Redis connection URL'),

  // Security & Authentication
  RATE_LIMIT_MAX: z
    .string()
    .default('100')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(10000))
    .describe('API rate limit (requests per minute)'),

  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((val) => val.split(',').map((s) => s.trim()))
    .describe('CORS allowed origins (comma-separated)'),

  SESSION_SECRET: z
    .string()
    .min(32)
    .optional()
    .describe('Session secret for secure sessions'),

  JWT_SECRET: z
    .string()
    .min(32)
    .optional()
    .describe('JWT secret for token signing'),

  // Analytics & Monitoring
  SENTRY_DSN: z
    .string()
    .url()
    .optional()
    .describe('Sentry DSN for error tracking'),

  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug'])
    .default('info')
    .describe('Application log level'),

  // Deployment Configuration
  VERCEL_REGION: z
    .string()
    .default('iad1')
    .describe('Vercel deployment region'),

  ENABLE_EDGE_FUNCTIONS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable edge functions'),

  // Development Tools
  SKIP_TYPE_CHECK: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Skip TypeScript type checking during build'),

  SKIP_LINT: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Skip ESLint during build'),

  ENABLE_SOURCE_MAPS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable source maps in production'),
})

/**
 * Combined schema for all environment variables
 */
const envSchema = serverSchema.merge(clientSchema)

/**
 * Get and validate client-side environment variables
 * These can be safely accessed in browser code
 */
function getClientEnv() {
  const clientEnv: Record<string, string | undefined> = {}

  // Extract only NEXT_PUBLIC_ variables for client-side
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      clientEnv[key] = process.env[key]
    }
  })

  const parsed = clientSchema.safeParse(clientEnv)

  if (!parsed.success) {
    console.error(
      '❌ Invalid client environment variables:',
      parsed.error.flatten().fieldErrors
    )
    throw new Error('Invalid client environment variables')
  }

  return parsed.data
}

/**
 * Get and validate all environment variables (server-side only)
 */
function getServerEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    )
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

/**
 * Type-safe environment variables
 *
 * On the server: Access all environment variables
 * On the client: Only NEXT_PUBLIC_ variables are available
 */
export const env = typeof window === 'undefined'
  ? getServerEnv()  // Server-side: full env
  : getClientEnv()  // Client-side: only public env

/**
 * Type definitions for autocomplete and type checking
 */
export type Env = z.infer<typeof envSchema>
export type ClientEnv = z.infer<typeof clientSchema>
export type ServerEnv = z.infer<typeof serverSchema>

/**
 * Helper to check if we're in production
 */
export const isProd = env.NODE_ENV === 'production'

/**
 * Helper to check if we're in development
 */
export const isDev = env.NODE_ENV === 'development'

/**
 * Helper to check if we're in test environment
 */
export const isTest = env.NODE_ENV === 'test'
