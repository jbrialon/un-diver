import * as THREE from 'three'

export default class VrRenderer {
  originalRenderer // THREE.WebGLRenderer
  eyeSeparation = 3
  focalLength = 15
  rendererWidth = 0
  rendererHeight = 0

  fov = 0
  left = 0
  right = 0
  top = 0
  bottom = 0
  focus = 0
  diagonal = 0
  distance = 0
  center = 0
  cameraPosition = new THREE.Vector3()
  quat = new THREE.Quaternion()
  vect = new THREE.Vector3()
  cameraLeft = new THREE.PerspectiveCamera()
  cameraRight = new THREE.PerspectiveCamera()

  constructor (renderer) {
    this.originalRenderer = renderer
  }

  get separation () {
    return this.eyeSeparation
  }

  set separation (value) {
    if (value) {
      this.eyeSeparation = value
    }
  }

  get targetDistance () {
    return this.focalLength
  }

  set targetDistance (e) {
    this.focalLength = e
  }

  setSize (width, height) {
    this.rendererWidth = width * 0.5
    this.rendererHeight = height
    this.originalRenderer.setSize(width, this.rendererHeight)
  }

  render (scene, camera) {
    scene.updateMatrixWorld()
    if (camera.parent) {
      camera.updateMatrixWorld()
    }
    camera.matrixWorld.decompose(this.cameraPosition, this.quat, this.vect)
    this.fov = THREE.Math.radToDeg(2 * Math.atan(Math.tan(0.5 * THREE.Math.degToRad(camera.fov)) / camera.zoom))
    this.focus = camera.near / this.focalLength
    this.distance = Math.tan(0.5 * THREE.Math.degToRad(this.fov)) * this.focalLength
    this.diagonal = 0.5 * this.distance * camera.aspect
    this.bottom = -(this.top = this.distance * this.focus)
    this.center = (this.diagonal + this.eyeSeparation * 0.5) / (2 * this.diagonal)
    this.left = 2 * this.diagonal * this.focus * (1 - this.center)
    this.right = 2 * this.diagonal * this.focus * this.center
    this.cameraLeft.projectionMatrix.makePerspective(-this.left, this.right, this.top, this.bottom, camera.near, camera.far)
    this.cameraLeft.position.copy(this.cameraPosition)
    this.cameraLeft.quaternion.copy(this.quat)
    this.cameraLeft.translateX(-this.eyeSeparation * 0.5)
    this.cameraRight.projectionMatrix.makePerspective(-this.right, this.left, this.top, this.bottom, camera.near, camera.far)
    this.cameraRight.position.copy(this.cameraPosition)
    this.cameraRight.quaternion.copy(this.quat)
    this.cameraRight.translateX(this.eyeSeparation * 0.5)
    this.originalRenderer.clear()
    this.originalRenderer.setScissorTest(!0)
    this.originalRenderer.setScissor(0, 0, this.rendererWidth, this.rendererHeight)
    this.originalRenderer.setViewport(0, 0, this.rendererWidth, this.rendererHeight)
    this.originalRenderer.render(scene, this.cameraLeft)
    this.originalRenderer.setScissor(this.rendererWidth, 0, this.rendererWidth, this.rendererHeight)
    this.originalRenderer.setViewport(this.rendererWidth, 0, this.rendererWidth, this.rendererHeight)
    this.originalRenderer.render(scene, this.cameraRight)
    this.originalRenderer.setScissorTest(!1)
  }
}
