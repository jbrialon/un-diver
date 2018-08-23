import * as CONST from '../Constants'
import AnimationLoopManager from '../utils/AnimationLoopManager'
import * as THREE from 'three'

export default class StickToCamera {
  initialObject3D = new THREE.Object3D()
  initialObjectPosition = new THREE.Vector3()
  maxObjectPosition = new THREE.Vector3()
  cameraPosition = new THREE.Vector3()
  stick = false
  referenceObject3D
  camera
  distanceToCamera
  maxDistance

  constructor (object, maxDistance) {
    this.maxDistance = maxDistance
    this.camera = window.AppCameraDummy
    this.referenceObject3D = object
    this.initialObjectPosition.copy(this.referenceObject3D.position)
    this.maxObjectPosition.copy(this.initialObjectPosition)
    this.maxObjectPosition.z -= this.maxDistance

    this.referenceObject3D.parent.add(this.initialObject3D)
    this.initialObject3D.position.copy(this.initialObjectPosition)

    this.initialObjectPosition.z += CONST.CameraDistanceToSection
    this.maxObjectPosition.z += CONST.CameraDistanceToSection
    AnimationLoopManager.addCallback(() => this.updatePosition())
  }
  updatePosition () {
    let vect = new THREE.Vector3()
    let vectFinal = new THREE.Vector3()
    this.camera.getWorldPosition(vect)
    this.initialObject3D.worldToLocal(vect)
    vectFinal.copy(vect).clamp(this.maxObjectPosition, this.initialObjectPosition)
    vectFinal.z -= CONST.CameraDistanceToSection
    this.referenceObject3D.position.copy(vectFinal)
  }
}
