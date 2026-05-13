/**
 * Alien UI — Global shared types.
 *
 * Import these in components and composables instead of redefining them.
 */

// ── Size variants ──────────────────────────────────────────────────────────

/** Standard size tokens shared across all form and block components */
export type AlienSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// ── State variants ─────────────────────────────────────────────────────────

/** Visual state tokens for form fields */
export type AlienFieldState = 'default' | 'error' | 'success' | 'warning'

// ── Theme ──────────────────────────────────────────────────────────────────

/** Available colour theme modes */
export type AlienColorMode = 'light' | 'dark' | 'system'

// ── Component base props ───────────────────────────────────────────────────

/**
 * Props that every Alien UI component accepts.
 * Extend this in each component's props interface.
 */
export interface AlienBaseProps {
  /** Additional CSS classes merged onto the root element via cn() */
  class?: string
  /** Inline styles (avoid using — prefer CSS vars + Tailwind) */
  style?: string | Record<string, string>
}

// ── Form field props ───────────────────────────────────────────────────────

/**
 * Common props shared by all form input components.
 * Extend per-component with more specific props.
 */
export interface AlienFormFieldProps extends AlienBaseProps {
  /** VeeValidate / HTML field name — must match Zod schema key */
  name?: string
  /** Visible label text */
  label?: string
  /** Helper text shown below the field */
  hint?: string
  /** Validation error message (overrides VeeValidate errors if set explicitly) */
  error?: string
  /** Marks the field as required (adds * indicator) */
  required?: boolean
  /** Disables all interaction */
  disabled?: boolean
  /** Makes the field read-only */
  readonly?: boolean
  /** Visual size */
  size?: AlienSize
}

// ── Locale ─────────────────────────────────────────────────────────────────

/** Supported RTL locales for automatic dir="rtl" injection */
export const RTL_LOCALES = ['ar', 'fa', 'he', 'ur'] as const
export type RtlLocale = typeof RTL_LOCALES[number]
