import type { ZodType, output } from 'zod'

/**
 * Alien UI — Validation utilities.
 *
 * Stack: Zod v4 + VeeValidate v5
 *
 * Zod v4 natively implements the Standard Schema spec (`~standard` symbol).
 * VeeValidate v5 consumes Standard Schema directly — no adapter, no wrapper,
 * no `toTypedSchema()` needed anywhere in this library.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * USAGE IN CONSUMER CODE
 * ─────────────────────────────────────────────────────────────────────────
 * import { z } from 'zod'
 * import { useForm } from 'vee-validate'
 *
 * const schema = z.object({
 *   email:    z.string().email(),
 *   password: z.string().min(8),
 * })
 *
 * // Pass Zod schema directly — no toTypedSchema() call:
 * const { handleSubmit, errors } = useForm({ validationSchema: schema })
 *
 * // Field names must match schema keys:
 * <AlienInput name="email" label="Email" />
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Infer the TypeScript output type from a Zod v4 schema.
 * Use this instead of `z.infer<typeof schema>` for consistency.
 *
 * @example
 * const schema = z.object({ email: z.string() })
 * type FormData = InferSchema<typeof schema>
 * // → { email: string }
 */
export type InferSchema<T extends ZodType> = output<T>

/**
 * Narrow a VeeValidate field error to a single string.
 * VeeValidate v5 returns `string | undefined` per field;
 * this handles legacy arrays from custom rule functions too.
 */
export function resolveFieldError(error: string | string[] | undefined): string | undefined {
  if (!error) return undefined
  return Array.isArray(error) ? error[0] : error
}
