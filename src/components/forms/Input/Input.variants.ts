import { cva, type VariantProps } from 'class-variance-authority'

// ── Root wrapper (the visible "box") ───────────────────────────────────────

export const inputWrapperVariants = cva(
  // Base — always applied
  [
    'inline-flex items-center w-full',
    'rounded border bg-surface',
    'text-foreground',
    'transition-colors duration-150',
    // Focus ring is on the wrapper so prefix/suffix get it too
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface',
    'focus-within:border-primary',
  ],
  {
    variants: {
      size: {
        xs: 'h-7  gap-1 px-2    text-xs',
        sm: 'h-8  gap-1 px-2.5  text-sm',
        md: 'h-10 gap-2 px-3    text-sm',
        lg: 'h-11 gap-2 px-3.5  text-base',
        xl: 'h-12 gap-2 px-4    text-base',
      },
      state: {
        default: 'border-border hover:border-muted-foreground',
        error:   'border-destructive hover:border-destructive focus-within:ring-destructive focus-within:border-destructive',
        success: 'border-success   hover:border-success   focus-within:ring-success   focus-within:border-success',
      },
      disabled: {
        true:  'cursor-not-allowed opacity-50 pointer-events-none',
        false: '',
      },
      readonly: {
        true:  'bg-muted cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      size:     'md',
      state:    'default',
      disabled: false,
      readonly: false,
    },
  },
)

// ── Native <input> element ─────────────────────────────────────────────────

export const inputFieldVariants = cva(
  [
    'flex-1 min-w-0',
    'bg-transparent outline-none',
    'placeholder:text-muted-foreground',
    'text-inherit',
    // Remove browser default number spinners
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    // Remove browser default password reveal (Edge)
    '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden',
  ],
)

// ── Clear button ───────────────────────────────────────────────────────────

export const inputClearVariants = cva(
  [
    'shrink-0 -mr-0.5',
    'rounded-sm',
    'text-muted-foreground',
    'hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
    'transition-colors duration-100',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-4',
        xl: 'size-4.5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// ── Label ──────────────────────────────────────────────────────────────────

export const inputLabelVariants = cva(
  'block font-medium text-foreground select-none',
  {
    variants: {
      size: {
        xs: 'mb-0.5 text-xs',
        sm: 'mb-1   text-xs',
        md: 'mb-1   text-sm',
        lg: 'mb-1.5 text-sm',
        xl: 'mb-1.5 text-base',
      },
      disabled: {
        true:  'opacity-50',
        false: '',
      },
    },
    defaultVariants: { size: 'md', disabled: false },
  },
)

// ── Hint / error text ──────────────────────────────────────────────────────

export const inputHintVariants = cva(
  'mt-1 text-xs',
  {
    variants: {
      state: {
        hint:    'text-muted-foreground',
        error:   'text-destructive',
        success: 'text-success',
      },
    },
    defaultVariants: { state: 'hint' },
  },
)

// ── Exported variant prop types ────────────────────────────────────────────

export type InputWrapperVariants = VariantProps<typeof inputWrapperVariants>
export type InputClearVariants   = VariantProps<typeof inputClearVariants>
export type InputLabelVariants   = VariantProps<typeof inputLabelVariants>
export type InputHintVariants    = VariantProps<typeof inputHintVariants>
