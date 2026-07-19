import { readGeneratedRoutes } from '../scripts/generated-routes-manifest.js'

export function getPrerenderRoutes(): string[] {
  return readGeneratedRoutes('prerender')
}
