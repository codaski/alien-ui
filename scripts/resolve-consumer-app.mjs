#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const libRoot = resolve(__dirname, '..')

/** Default layout: repo at …/alien-ui/Alien UI → consumer at …/local-testing/alien-ui-nuxt */
const defaultConsumer = join(libRoot, '..', '..', 'local-testing', 'alien-ui-nuxt')

/**
 * @param {string[]} argv
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
export function resolveConsumerAppDir(argv, env = process.env) {
  let appArg
  for (const a of argv) {
    if (!a.startsWith('-')) {
      appArg = a
      break
    }
  }
  return resolve(appArg ?? env.ALIEN_UI_TEST_APP ?? defaultConsumer)
}

/**
 * @param {string} testApp
 * @returns {void}
 */
export function assertConsumerPackageJson(testApp) {
  if (!existsSync(join(testApp, 'package.json'))) {
    console.error(`No package.json in consumer app:\n  ${testApp}`)
    console.error('Pass the directory as first argument or set ALIEN_UI_TEST_APP, e.g.:')
    console.error('  npm run dev:test-app -- C:\\\\Projects\\\\local-testing\\\\alien-ui-nuxt')
    process.exit(1)
  }
}
