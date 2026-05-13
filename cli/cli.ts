#!/usr/bin/env node
/**
 * alien-ui CLI — entry for published `bin` (`dist/cli.mjs`) and dev (`tsx`).
 */
import process from 'node:process'

import { runEject } from './eject.js'
import { runNewComponent } from './new-component.js'

export function printHelp(): void {
  console.error(`
usage: alien-ui <command>

commands:
  eject <ComponentName> [--dest <dir>]    Copy component source into your app
  new-component --name X [--category …]    Scaffold component (maintainers only)

Examples:
  npx alien-ui eject Input --dest src/components/alien
  npm run new:component -- --name Foo --category forms
`)
}

function main(): void {
  const argv = process.argv.slice(2)
  const cmd  = argv[0]

  if (cmd === '-h' || cmd === '--help') {
    printHelp()
    process.exit(0)
  }

  if (!cmd) {
    printHelp()
    process.exit(1)
  }

  const rest = argv.slice(1)

  if (cmd === 'eject') {
    runEject(rest)
    return
  }

  if (cmd === 'new-component' || cmd === 'new:component') {
    runNewComponent(rest)
    return
  }

  console.error(`Unknown command: ${cmd}\n`)
  printHelp()
  process.exit(1)
}

main()
