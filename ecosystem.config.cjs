/**
 * PM2 process file for Autoreal production.
 * Loads NUXT_* (and other) keys from .env into the process env —
 * PM2 env_file is unreliable across versions.
 */
const fs = require('node:fs')
const path = require('node:path')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const env = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const root = __dirname
const fileEnv = loadEnvFile(path.join(root, '.env'))

module.exports = {
  apps: [
    {
      name: 'autoreal',
      script: './.output/server/index.mjs',
      cwd: root,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '3000',
        ...fileEnv,
      },
    },
  ],
}
