import AnimationLoopManager from '../utils/AnimationLoopManager'
import * as THREE from 'three'

export default class Fader {
  defaultOpacity = 1
  closeDistance = 0
  farDistance = 0
  referenceObject3D
  camera

  constructor (object) {
    this.referenceObject3D = object
    if (this.referenceObject3D.material) {
      this.camera = window.AppCameraDummy
      this.closeDistance = 500
      this.farDistance = 2e10
      AnimationLoopManager.addCallback(() => this.updateFade())
    }
  }
  updateFade () {
    let camVect = new THREE.Vector3()
    let objectVect = new THREE.Vector3()
    this.camera.getWorldPosition(camVect)
    this.referenceObject3D.getWorldPosition(objectVect)
    let distance = camVect.z - objectVect.z - 50
    this.referenceObject3D.visible = distance > 0 && distance < this.farDistance + this.closeDistance
    let closeOpacity = distance / this.closeDistance
    let farOpacity = 1 - (distance / (this.farDistance + this.closeDistance))
    if (this.referenceObject3D.visible) {
      this.referenceObject3D.material.opacity = Math.min(this.defaultOpacity, closeOpacity, farOpacity)
    } else {
      this.referenceObject3D.material.opacity = 0
    }
  }
}
