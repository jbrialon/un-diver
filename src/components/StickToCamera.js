import * as CONST from '../Constants'
import AnimationLoopManager from '../utils/AnimationLoopManager'
import * as THREE from 'three'

export default class StickToCamera {
  zeroVect = new THREE.Vector3(0, 0, 0)
  initialObject3D = new THREE.Object3D()
  initialObjectPosition = new THREE.Vector3()
  maxObjectPosition = new THREE.Vector3()
  cameraPosition = new THREE.Vector3()
  referenceObject3D
  camera
  maxDistance
  debug

  constructor (object, maxDistance, debug) {
    this.debug = debug
    this.maxDistance = maxDistance
    this.camera = window.AppCameraDummy
    this.referenceObject3D = object
    this.initialObjectPosition.copy(this.referenceObject3D.position)
    this.maxObjectPosition.z = -this.maxDistance

    this.referenceObject3D.parent.add(this.initialObject3D)
    this.initialObject3D.position.copy(this.initialObjectPosition)

    AnimationLoopManager.addCallback(() => this.updatePosition())
  }
  updatePosition () {
    let vect = new THREE.Vector3()
    let vectFinal = new THREE.Vector3()
    this.camera.getWorldPosition(vect)
    this.initialObject3D.worldToLocal(vect)
    vect.z -= CONST.CameraDistanceToSection
    vectFinal.z = Math.max(vect.z, this.maxObjectPosition.z)
    vectFinal.z = Math.min(vectFinal.z, 0)
    vectFinal.z += this.initialObjectPosition.z

    this.referenceObject3D.position.z += (vectFinal.z - this.referenceObject3D.position.z) * 0.2
  }
}
