/*
* Manages animation loop
* Adds render function in an pile
* Then used by renderer with 'setAnimationLoop' function
*/
import * as Stats from 'stats.js'

class AnimationLoopManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static addFirstCallback (callback) {
    AnimationLoopManager.callbacks.unshift(callback)
  }

  static replaceFirstCallback (callback) {
    AnimationLoopManager.callbacks[0] = callback
  }

  static addCallback (callback) {
    AnimationLoopManager.callbacks.splice(Math.min(1, AnimationLoopManager.callbacks.length), 0, callback)
  }

  static addLastCallback (callback) {
    AnimationLoopManager.callbacks.push(callback)
  }

  static renderLoop () {
    AnimationLoopManager.callbacks.forEach(callback => callback())
    AnimationLoopManager.stats.update()
  }

  static cleartLoop () {
    AnimationLoopManager.callbacks = []
  }
}

AnimationLoopManager.callbacks = []
AnimationLoopManager.stats = { update: () => {} }
if (process.env.NODE_ENV === 'development' && !process.env.VUE_APP_SCREENSHOT) {
  AnimationLoopManager.stats = new Stats()
  AnimationLoopManager.stats.domElement.className = 'stats'
  document.body.appendChild(AnimationLoopManager.stats.dom)
}

export default AnimationLoopManager
