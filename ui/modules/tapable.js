// https://nuxtjs.org/guide/modules#run-tasks-on-specific-hooks
module.exports = function () {
  // Add hook for renderer
  this.nuxt.plugin('renderer', renderer => {
    // This will be called when renderer was created
  })

  // Add hook for build
  this.nuxt.plugin('build', async builder => {
    // This will be called once when builder created
    console.log('build')
  })

  // Add hook for generate
  this.nuxt.plugin('generator', async generator => {
    // This will be called when a Nuxt generate starts
    console.log('generator')
  })
}
