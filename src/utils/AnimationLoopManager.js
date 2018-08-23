/*
* Manages animation loop
* Adds render function in an pile
* Then used by renderer with 'setAnimationLoop' function
*/
class AnimationLoopManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static addFirstCallback (callback) {
    AnimationLoopManager.callbacks.unshift(callback)
  }

  static addCallback (callback) {
    AnimationLoopManager.callbacks.splice(Math.min(1, AnimationLoopManager.callbacks.length), 0, callback)
  }

  static addLastCallback (callback) {
    AnimationLoopManager.callbacks.push(callback)
  }

  static renderLoop () {
    AnimationLoopManager.callbacks.forEach(callback => callback())
  }

  static cleartLoop () {
    AnimationLoopManager.callbacks = []
  }
}

AnimationLoopManager.callbacks = []

export default AnimationLoopManager
