import type { VNode } from 'vue'
import type { AlienSize } from '@/types'

// ── Props ──────────────────────────────────────────────────────────────────

export interface InputProps {
  /** Two-way bound value */
  modelValue?: string

  /** Native input type */
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number'

  /** Placeholder text (falls back to i18n key if not provided) */
  placeholder?: string

  /** Visible label rendered above the input */
  label?: string

  /** Helper text rendered below the input */
  hint?: string

  /** Validation error message — shown instead of hint when set */
  error?: string

  /** Visual size variant */
  size?: AlienSize

  /** Show a clear (×) button when the field has a value */
  clearable?: boolean

  /** Marks the field visually and semantically as required */
  required?: boolean

  /** Disables the input */
  disabled?: boolean

  /** Makes the input read-only */
  readonly?: boolean

  /** VeeValidate field name — must match the Zod schema key */
  name?: string

  /** Additional CSS classes merged onto the root wrapper */
  class?: string
}

// ── Emits ──────────────────────────────────────────────────────────────────

export interface InputEmits {
  'update:modelValue': [value: string]
  'change':  [value: string]
  'focus':   [event: FocusEvent]
  'blur':    [event: FocusEvent]
  'clear':   []
}

// ── Slots ──────────────────────────────────────────────────────────────────

export interface InputSlots {
  /** Icon or text rendered inside the left edge of the input */
  prefix?: () => VNode[]
  /** Icon or text rendered inside the right edge of the input (before the clear button) */
  suffix?: () => VNode[]
}

// ── Expose ─────────────────────────────────────────────────────────────────

export interface InputExpose {
  /** Focus the native input element */
  focus: () => void
  /** Blur the native input element */
  blur:  () => void
  /** Clear the value and emit 'clear' */
  clear: () => void
}
