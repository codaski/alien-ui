import { computed, type ComputedRef } from 'vue'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

/** cva-compatible `class` prop on variant callbacks (not exported by cva in newer versions). */
type CvaClassProp = { class?: string }

/**
 * Alien UI — variant resolver composable.
 *
 * Bridges cva variant functions with Vue computed properties so that
 * class recalculation is reactive to prop changes.
 *
 * @example
 * import { inputVariants } from './Input.variants'
 *
 * const rootClass = useVariants(inputVariants, computed(() => ({
 *   size:     props.size,
 *   state:    props.error ? 'error' : 'default',
 *   disabled: props.disabled,
 * })), computed(() => props.class))
 */
export function useVariants<
  TVariantFn extends (props?: Record<string, unknown> & CvaClassProp) => string,
>(
  variantFn:    TVariantFn,
  variantProps: ComputedRef<VariantProps<TVariantFn>>,
  extraClass?:  ComputedRef<string | undefined>,
): ComputedRef<string> {
  return computed(() =>
    cn(
      variantFn(variantProps.value as Record<string, unknown> & CvaClassProp),
      extraClass?.value,
    )
  )
}
