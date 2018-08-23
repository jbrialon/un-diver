/*
* Manages animation loop
* Adds render function in an pile
* Then used by renderer with 'setAnimationLoop' function
*/
class AnimationLoopManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static addInLoop (callback) {
    return AnimationLoopManager.callbacks.push(callback)
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
