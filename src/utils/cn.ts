import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely.
 *
 * - `clsx` handles conditional class objects/arrays
 * - `twMerge` resolves Tailwind class conflicts (e.g. p-2 vs p-4 → keeps last)
 *
 * @example
 * cn('px-4 py-2', props.class, isActive && 'bg-primary')
 * cn({ 'opacity-50': disabled }, variantClass)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
