<script setup lang="ts">
/**
 * AlienInput — single-line text input.
 *
 * Behaviour  : native <input> (no Reka UI primitive needed for basic text input)
 * Styling    : cva variants from Input.variants.ts
 * Validation : VeeValidate v5 + Zod v4 (Standard Schema — no toTypedSchema needed)
 * i18n       : placeholder falls back to t('alien-ui.input.placeholder')
 *
 * Validation wiring:
 *   Pass `name` prop matching a key in the parent useForm() Zod schema.
 *   VeeValidate v5 reads the Standard Schema directly — no adapter required.
 */

import { computed, useTemplateRef } from 'vue'
import { useField as useVeeField }  from 'vee-validate'
import { useLocale }                from '@/composables/useLocale'
import { useAlienId }               from '@/utils/id'
import { cn }                       from '@/utils/cn'
import {
  inputWrapperVariants,
  inputFieldVariants,
  inputClearVariants,
  inputLabelVariants,
  inputHintVariants,
} from './Input.variants'
import type {
  InputProps,
  InputEmits,
  InputSlots,
  InputExpose,
} from './Input.types'

// ── Props & emits ──────────────────────────────────────────────────────────

const props = withDefaults(defineProps<InputProps>(), {
  type:      'text',
  size:      'md',
  clearable: false,
  required:  false,
  disabled:  false,
  readonly:  false,
})

const emit = defineEmits<InputEmits>()
defineSlots<InputSlots>()

// ── i18n ───────────────────────────────────────────────────────────────────

const { t } = useLocale()

// ── IDs for a11y label association ─────────────────────────────────────────

const inputId = useAlienId('input')
const hintId  = useAlienId('input-hint')

// ── Two-way model ──────────────────────────────────────────────────────────

const model = defineModel<string>({ default: '' })

// ── VeeValidate v5 integration (optional — only active when `name` is set) ─
//
// VeeValidate v5 + Zod v4: no toTypedSchema() or adapter needed.
// The parent form calls: useForm({ validationSchema: myZodSchema })
// This component hooks in via matching `name` prop to a schema key.
// We do NOT use syncVModel here — defineModel above owns the value binding.

const {
  errorMessage: veeError,
  handleBlur:   veeBlur,
  handleChange: veeChange,
} = props.name
  ? useVeeField<string>(props.name)
  : { errorMessage: undefined, handleBlur: undefined, handleChange: undefined }

// ── Resolved state ─────────────────────────────────────────────────────────

/** Error shown to the user: explicit prop beats VeeValidate */
const resolvedError = computed(() => props.error ?? veeError?.value)

const state = computed<'default' | 'error' | 'success'>(() =>
  resolvedError.value ? 'error' : 'default',
)

const showClear = computed(() =>
  props.clearable && !props.disabled && !props.readonly && !!model.value,
)

const resolvedPlaceholder = computed(() =>
  props.placeholder ?? t('alien-ui.input.placeholder'),
)

// ── Class bindings ─────────────────────────────────────────────────────────

const wrapperClass = computed(() =>
  cn(
    inputWrapperVariants({
      size:     props.size,
      state:    state.value,
      disabled: props.disabled,
      readonly: props.readonly,
    }),
    props.class,
  ),
)

const fieldClass  = computed(() => inputFieldVariants())
const clearClass  = computed(() => inputClearVariants({ size: props.size }))
const labelClass  = computed(() => inputLabelVariants({ size: props.size, disabled: props.disabled }))
const hintClass   = computed(() => inputHintVariants({ state: resolvedError.value ? 'error' : 'hint' }))

// ── Event handlers ─────────────────────────────────────────────────────────

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  model.value = value
  emit('update:modelValue', value)
  veeChange?.(value)
}

function onChange(event: Event) {
  emit('change', (event.target as HTMLInputElement).value)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  veeBlur?.(event)
  emit('blur', event)
}

function onClear() {
  model.value = ''
  emit('update:modelValue', '')
  emit('clear')
  veeChange?.('')
  // Return focus to the input after clearing
  inputRef.value?.focus()
}

// ── Expose (imperative API) ────────────────────────────────────────────────

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

defineExpose<InputExpose>({
  focus: () => inputRef.value?.focus(),
  blur:  () => inputRef.value?.blur(),
  clear: onClear,
})
</script>

<template>
  <div :class="cn('w-full', props.class)">

    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="labelClass"
    >
      {{ label }}
      <span
        v-if="required"
        aria-hidden="true"
        class="ml-0.5 text-destructive"
      >*</span>
    </label>

    <!-- Input wrapper (the visible "box") -->
    <div :class="wrapperClass">

      <!-- Prefix slot -->
      <span
        v-if="$slots.prefix"
        class="shrink-0 text-muted-foreground"
        aria-hidden="true"
      >
        <slot name="prefix" />
      </span>

      <!-- Native input -->
      <input
        :id="inputId"
        ref="inputRef"
        v-bind="$attrs"
        :class="fieldClass"
        :type="type"
        :value="model"
        :placeholder="resolvedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="!!resolvedError"
        :aria-describedby="hint || resolvedError ? hintId : undefined"
        :aria-required="required ? 'true' : undefined"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Suffix slot -->
      <span
        v-if="$slots.suffix"
        class="shrink-0 text-muted-foreground"
        aria-hidden="true"
      >
        <slot name="suffix" />
      </span>

      <!-- Clear button -->
      <button
        v-if="showClear"
        :class="clearClass"
        type="button"
        :aria-label="t('alien-ui.input.clear')"
        tabindex="-1"
        @click.prevent="onClear"
      >
        <!-- × icon (inline SVG — no external dependency) -->
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          class="size-full"
        >
          <path d="M12 4 4 12M4 4l8 8" />
        </svg>
      </button>

    </div>

    <!-- Hint / error -->
    <p
      v-if="resolvedError || hint"
      :id="hintId"
      :class="hintClass"
      :role="resolvedError ? 'alert' : undefined"
    >
      {{ resolvedError ?? hint }}
    </p>

  </div>
</template>
