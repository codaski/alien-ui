import { getCurrentInstance } from 'vue'

/**
 * Generate a stable, SSR-safe unique ID.
 *
 * Prefers Vue 3.5's built-in `useId()` when available.
 * Falls back to a monotonic counter for older Vue versions or non-component contexts.
 *
 * Usage:
 *   const id = useAlienId('input')  // → "alien-input-3"
 */

let counter = 0

export function useAlienId(prefix = 'alien'): string {
  // Vue 3.5+ provides useId() which is SSR-hydration-safe
  try {
    // Dynamic import so we don't break older Vue versions at parse time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useId } = require('vue') as typeof import('vue')
    if (typeof useId === 'function') {
      const id = useId()
      return `${prefix}-${id}`
    }
  }
  catch {
    // fallthrough
  }

  // Fallback: instance uid or global counter
  const instance = getCurrentInstance()
  const uid = instance?.uid ?? ++counter
  return `${prefix}-${uid}`
}
