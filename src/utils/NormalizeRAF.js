// Normalize requestAnimationFrame
let fps = 30
let customRAF = (callback) => {
  return setTimeout(callback, 1000 / fps)
}
let customCAF = (timer) => {
  return clearTimeout(timer)
}
let requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    customRAF
let cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    customCAF

window.requestAnimationFrame = requestAnimationFrame
window.cancelAnimationFrame = cancelAnimationFrame
