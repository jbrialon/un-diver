/*
* Stick the given object to Camera
* when object is closer than CONST.CameraDistanceToSection
* and release it in space when given maxDistance is reached by camera
*/
import * as CONST from '../../../Constants'
import AnimationLoopManager from '../../../utils/AnimationLoopManager'
import * as THREE from 'three'

export default class StickToCamera {
  zeroVect = new THREE.Vector3(0, 0, 0)
  initialObject3D = new THREE.Object3D()
  initialObjectPosition = new THREE.Vector3()
  finalObjectMatrix = new THREE.Matrix4()
  maxObjectPosition = new THREE.Vector3()
  cameraPosition = new THREE.Vector3()
  referenceObject3D
  camera
  maxDistance
  wasSticked = false
  sticked = false
  stickedCallback

  constructor (object, maxDistance, callbackSticked) {
    this.stickedCallback = callbackSticked
    this.maxDistance = maxDistance
    this.camera = window.AppCameraDummy
    this.referenceObject3D = object
    this.initialObjectPosition.copy(this.referenceObject3D.position)
    this.finalObjectMatrix.copy(this.referenceObject3D.matrix)
    this.maxObjectPosition.z = -this.maxDistance

    this.referenceObject3D.parent.add(this.initialObject3D)
    this.initialObject3D.position.copy(this.initialObjectPosition)

    AnimationLoopManager.addCallback(() => this.updatePosition())
  }

  updatePosition () {
    // TODO : performance optimization
    let vect = new THREE.Vector3()
    let vectFinal = 0
    this.camera.getWorldPosition(vect)
    this.initialObject3D.worldToLocal(vect)
    vect.z -= CONST.CameraDistanceToSection
    vectFinal = Math.max(vect.z, this.maxObjectPosition.z)
    vectFinal = Math.min(vectFinal, 0)
    this.sticked = vectFinal > this.maxObjectPosition.z && vectFinal < 0
    if (this.stickedCallback && this.sticked && this.sticked !== this.wasSticked) {
      this.stickedCallback(this.referenceObject3D)
    } else if (this.stickedCallback && !this.sticked && this.sticked !== this.wasSticked) {
      this.stickedCallback()
    }
    this.wasSticked = this.sticked
    vectFinal += this.initialObjectPosition.z

    // This is ugly but is faster than item.setPosition. See Object3D.matrixAutoUpdate property
    this.referenceObject3D.matrix.elements[14] += (vectFinal - this.referenceObject3D.matrix.elements[14]) * 0.2
  }
}
