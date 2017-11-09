import Velocity from 'velocity-animate'
if (!process.server || process.static) {
  window.Velocity = window.velocity = Velocity
}
