export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error) => {
    console.error('[PRERENDER ERROR]', error)
  })
})
