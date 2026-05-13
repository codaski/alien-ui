import type { VNode } from 'vue'
import type { AlienFormFieldProps } from '@/types'

// ── Props ──────────────────────────────────────────────────────────────────

/**
 * Props for AlienInput.
 * Shared form field props (name, label, hint, error, required, disabled,
 * readonly, size, class) are inherited from AlienFormFieldProps.
 */
export interface InputProps extends AlienFormFieldProps {
  /** Two-way bound value */
  modelValue?: string

  /** Native input type */
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number'

  /** Placeholder text (falls back to i18n key if not provided) */
  placeholder?: string

  /** Show a clear (×) button when the field has a value */
  clearable?: boolean
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
