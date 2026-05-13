import type { ZodSchema } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

/**
 * Convert a Zod schema to a VeeValidate-compatible typed schema.
 *
 * This is the standard bridge between Zod (schema definition)
 * and VeeValidate (form state management) in Alien UI.
 *
 * @example
 * const schema = z.object({ email: z.string().email() })
 * const { handleSubmit } = useForm({ validationSchema: toAlienSchema(schema) })
 */
export function toAlienSchema<T>(schema: ZodSchema<T>) {
  return toTypedSchema(schema)
}

/**
 * Extract a readable error message from a VeeValidate error.
 * Returns undefined if there is no error.
 */
export function resolveFieldError(error: string | string[] | undefined): string | undefined {
  if (!error) return undefined
  return Array.isArray(error) ? error[0] : error
}
