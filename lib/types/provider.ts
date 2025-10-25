/**
 * Provider types and validation for AI consciousness API
 */

export const PROVIDERS = [
  'claude',
  'gpt',
  'gemini',
  'huggingface',
  'local',
  'quantum',
] as const

export type Provider = typeof PROVIDERS[number]

/**
 * Type guard to check if a value is a valid Provider
 */
export function isProvider(x: unknown): x is Provider {
  return typeof x === 'string' && (PROVIDERS as readonly string[]).includes(x)
}
