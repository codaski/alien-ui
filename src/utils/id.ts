import { getCurrentInstance, useId } from 'vue'

/**
 * Generate a stable, SSR-safe unique ID.
 *
 * Uses Vue 3.5's built-in `useId()` (SSR-hydration-safe) when called
 * inside a component setup context. Falls back to a monotonic counter
 * for non-component contexts (e.g. server utilities).
 *
 * Usage:
 *   const id = useAlienId('input')  // → "alien-input-3"
 */

let counter = 0

export function useAlienId(prefix = 'alien'): string {
  try {
    const id = useId()
    return `${prefix}-${id}`
  }
  catch {
    // Not inside a component setup context — fall back to counter
    const instance = getCurrentInstance()
    const uid = instance?.uid ?? ++counter
    return `${prefix}-${uid}`
  }
}
