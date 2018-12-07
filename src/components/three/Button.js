import THREE from '@/utils/ThreeWithPlugins'
import Utils from '@/utils/Utils'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import { TweenMax, Power4 } from 'gsap'

export default class Button extends THREE.Object3D {
  domElementID
  domElement
  autoDisplayDistance
  distance
  size = new THREE.Vector2()

  constructor (domElementID) {
    super()
    // TODO : document.getElementById returns null when hot-reloading page in dev env
    this.domElement = document.getElementById(domElementID)
    if (this.domElement) {
      this.setVisibility(false)
      this.domElement3D = new THREE.CSS3DObject(this.domElement)
      this.add(this.domElement3D)
      this.size = this.domElement.getBoundingClientRect()
    } else {
      // eslint-disable-next-line
      console.warn('Could not find any element by id : \'' + domElementID + '\'')
    }
  }

  setAutoDisplayMode (distance) {
    this.autoDisplayDistance = distance
    AnimationLoopManager.addCallback(this.checkDisplay)
  }

  checkDisplay = () => {
    this.distance = Utils.getDistanceToCamera(this)
    if (this.distance > 0 && this.distance < this.autoDisplayDistance) {
      this.setVisibility(true)
    } else {
      this.setVisibility(false)
    }
  }

  addEventListener (eventName, callback) {
    if (this.domElement) {
      this.domElement.addEventListener(eventName, callback)
    }
  }

  removeEventListener (eventName, callback) {
    if (this.domElement) {
      this.domElement.removeEventListener(eventName, callback)
    }
  }

  setVisibility (visible) {
    if (this.visible !== visible) {
      this.visible = visible
      if (this.domElement) {
        TweenMax.to(this.domElement, 0.3, { autoAlpha: visible ? 1 : 0, ease: Power4.easeOut })
      }
    }
  }
}
