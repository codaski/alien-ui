#!/usr/bin/env tsx
/**
 * alien-ui eject — copy a component from the package into your project.
 *
 * Usage: npx alien-ui eject Input
 *        npx alien-ui eject Input --dest src/components/alien
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

/**
 * Entry for `argv` AFTER the `eject` sub-command.
 * Example: argv = ['Input', '--dest', 'src/components/alien']
 */
export function runEject(argv: readonly string[]): void {
  const component = argv.find(a => !a.startsWith('--'))
  const destIdx = argv.indexOf('--dest')
  const destArg = destIdx !== -1 ? argv[destIdx + 1] : undefined

  if (!component) {
    console.error('Usage: npx alien-ui eject <ComponentName> [--dest <output-dir>]')
    process.exit(1)
    return
  }

  const packageRoot = resolve(import.meta.dirname, '..')
  const categories = ['forms', 'blocks', 'layout', 'feedback']

  let sourcePath: string | undefined

  for (const cat of categories) {
    const candidate = join(packageRoot, 'src', 'components', cat, component)
    if (existsSync(candidate))
      sourcePath = candidate
  }

  if (!sourcePath) {
    console.error(`Component "${component}" not found in any category (${categories.join(', ')}).`)
    console.error('Available components: check published src/components/ for implemented folders.')
    process.exit(1)
    return
  }

  const destBase = destArg
    ? resolve(process.cwd(), destArg)
    : resolve(process.cwd(), 'src', 'components', 'alien')

  const destPath = join(destBase, component)

  if (existsSync(destPath)) {
    console.error(`Destination already exists: ${destPath}`)
    console.error('Remove it first or choose a different --dest.')
    process.exit(1)
    return
  }

  mkdirSync(destBase, { recursive: true })
  cpSync(sourcePath, destPath, { recursive: true })

  console.log(`\nEjected ${component} → ${destPath}`)
  console.log('The component is now fully yours. Edit it freely.')
  console.log('\nIf using the Nuxt module, point alienUI.ejectDir at the folder that wraps')
  console.log(`  this component\'s sibling components (typically: ~/components/alien).\n`)
  console.log('  Example: alienUI: { ejectDir: \'~/components/alien\' }\n')
}
