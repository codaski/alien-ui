#!/usr/bin/env node
/**
 * Build this package and reinstall it into a local Nuxt (or any) consumer via `npm install <path>`.
 *
 * Usage:
 *   npm run link:test-app
 *   npm run link:test-app -- "C:\path\to\alien-ui-nuxt"
 *   ALIEN_UI_TEST_APP=C:\path\to\app npm run link:test-app
 *
 *   npm run link:test-app:quick          # skip build; only reinstall from dist/
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const libRoot = resolve(__dirname, '..')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const runNpm = (cwd, args) =>
  spawnSync(npmCmd, args, {
    cwd,
    stdio: 'inherit',
    // Avoid cmd word-splitting on paths that contain spaces (e.g. ".../Alien UI")
    shell: false,
  })

let noBuild = false
let appArg
for (const a of process.argv.slice(2)) {
  if (a === '--no-build')
    noBuild = true
  else if (!a.startsWith('-'))
    appArg = a
}

// Default: two dirs up from repo, then local-testing/alien-ui-nuxt (common Windows layout)
const defaultApp = join(libRoot, '..', '..', 'local-testing', 'alien-ui-nuxt')
const testApp = resolve(appArg ?? process.env.ALIEN_UI_TEST_APP ?? defaultApp)

if (!existsSync(join(testApp, 'package.json'))) {
  console.error(`[link-test-app] No package.json in:\n  ${testApp}`)
  console.error('Pass the consumer app directory, or set ALIEN_UI_TEST_APP, for example:')
  console.error('  npm run link:test-app -- C:\\\\Projects\\\\local-testing\\\\alien-ui-nuxt')
  process.exit(1)
}

if (!noBuild) {
  console.log('[link-test-app] npm run build (library)…')
  const b = runNpm(libRoot, ['run', 'build'])
  if (b.status !== 0)
    process.exit(b.status ?? 1)
}

console.log('[link-test-app] npm install from library into consumer…')
console.log(`  library   ${libRoot}`)
console.log(`  consumer  ${testApp}`)
// Windows + paths with spaces: npm must receive a file:// URL (or unquoted path breaks on "Alien UI")
const installTarget = pathToFileURL(libRoot).href
const link = runNpm(testApp, ['install', installTarget])
process.exit(link.status ?? 0)
