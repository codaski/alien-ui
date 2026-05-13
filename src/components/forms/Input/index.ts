// ── Component ──────────────────────────────────────────────────────────────
export { default as AlienInput } from './Input.vue'

// ── Types (consumers can import for typed usage) ───────────────────────────
export type {
  InputProps,
  InputEmits,
  InputSlots,
  InputExpose,
} from './Input.types'

// ── Variants (consumers can extend or override) ────────────────────────────
export {
  inputWrapperVariants,
  inputFieldVariants,
  inputClearVariants,
  inputLabelVariants,
  inputHintVariants,
} from './Input.variants'
export type {
  InputWrapperVariants,
  InputClearVariants,
  InputLabelVariants,
  InputHintVariants,
} from './Input.variants'
