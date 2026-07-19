import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const sourcePath = resolve('.output/public/404/index.html')
const targetPath = resolve('.output/public/404.html')

async function syncStatic404() {
  const page404 = await readFile(sourcePath, 'utf8')
  await writeFile(targetPath, page404, 'utf8')
  console.log(`Synced static 404: ${targetPath}`)
}

syncStatic404().catch((error) => {
  console.error('Failed to sync static 404 from pages/404.vue output')
  console.error(error)
  process.exitCode = 1
})
