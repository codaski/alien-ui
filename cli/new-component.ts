#!/usr/bin/env tsx
/**
 * alien-ui new:component — scaffold a new component from template.
 *
 * Usage: alien-ui new-component --name MyComponent --category forms
 *        npm run new:component -- --name Foo --category forms
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

const validCategories = ['forms', 'blocks', 'layout', 'feedback'] as const
type ComponentCategory = (typeof validCategories)[number]

function isComponentCategory(s: string): s is ComponentCategory {
  return (validCategories as readonly string[]).includes(s)
}

/** Args after sub-command (`--name X ...`) */
export function runNewComponent(argv: readonly string[]): void {
  const args = [...argv]

  const nameIdx = args.indexOf('--name')
  const catIdx = args.indexOf('--category')

  const name = nameIdx !== -1 ? args[nameIdx + 1] : undefined
  const categoryArg = catIdx !== -1 ? args[catIdx + 1] : undefined
  const categoryResolved = categoryArg ?? 'forms'

  if (!name) {
    console.error('Usage: alien-ui new-component --name <ComponentName> [--category forms|blocks|layout|feedback]')
    process.exit(1)
    return
  }

  if (!isComponentCategory(categoryResolved)) {
    console.error(`Invalid category "${categoryResolved}". Must be one of: ${validCategories.join(', ')}`)
    process.exit(1)
    return
  }

  const category: ComponentCategory = categoryResolved

  const root = resolve(import.meta.dirname, '..')
  const dir = join(root, 'src', 'components', category, name)
  const testsDir = join(dir, '__tests__')

  if (existsSync(dir)) {
    console.error(`Component "${name}" already exists at ${dir}`)
    process.exit(1)
    return
  }

  mkdirSync(testsDir, { recursive: true })

  const vn = `${name.charAt(0).toLowerCase()}${name.slice(1)}`

  writeFileSync(join(dir, `${name}.types.ts`), `import type { AlienFormFieldProps } from '@/types'

export interface ${name}Props extends AlienFormFieldProps {
  modelValue?: string
}

export interface ${name}Emits {
  'update:modelValue': [value: string]
}

import type { VNode } from 'vue'
export interface ${name}Slots {
  default?: () => VNode[]
}

export interface ${name}Expose {
  focus: () => void
}
`)

  writeFileSync(join(dir, `${name}.variants.ts`), `import { cva, type VariantProps } from 'class-variance-authority'

export const ${vn}Variants = cva(
  ['inline-flex items-center'],
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type ${name}Variants = VariantProps<typeof ${vn}Variants>
`)

  writeFileSync(join(dir, `${name}.vue`), `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { cn } from '@/utils/cn'
import { ${vn}Variants } from './${name}.variants'
import type { ${name}Props, ${name}Emits, ${name}Slots, ${name}Expose } from './${name}.types'

const props = withDefaults(defineProps<${name}Props>(), {
  size: 'md',
})
const emit = defineEmits<${name}Emits>()
defineSlots<${name}Slots>()

const { t } = useLocale()
const model = defineModel<string>({ default: '' })

const rootClass = computed(() =>
  cn(${vn}Variants({ size: props.size }), props.class),
)
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>
`)

  writeFileSync(join(dir, 'index.ts'), `export { default as Alien${name} } from './${name}.vue'
export type { ${name}Props, ${name}Emits, ${name}Slots, ${name}Expose } from './${name}.types'
export { ${vn}Variants } from './${name}.variants'
export type { ${name}Variants } from './${name}.variants'
`)

  writeFileSync(join(testsDir, `${name}.spec.ts`), `import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import { Alien${name} } from '../index'

describe('Alien${name}', () => {
  it('renders without error', () => {
    const { baseElement } = render(Alien${name})
    expect(baseElement).toBeDefined()
  })
})
`)

  console.log(`\nCreated Alien${name} in src/components/${category}/${name}/`)
  console.log(`  ${name}.vue`)
  console.log(`  ${name}.types.ts`)
  console.log(`  ${name}.variants.ts`)
  console.log(`  index.ts`)
  console.log(`  __tests__/${name}.spec.ts`)
  console.log(`\nRemember to add the export to src/components/${category}/index.ts`)
}
