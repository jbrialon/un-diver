/*
* Manages Camera creation and positioning in space depending on scroll
* Handles all mobile events and orients camera accordingly
*/
import store from '@/store'
import * as CONST from '@/Constants'
import * as THREE from 'three'
import {TweenMax, Sine, Power4} from 'gsap'
import 'gsap/ScrollToPlugin'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import Utils from '@/utils/Utils'
import GuiManager from '@/utils/GuiManager'

export default class CameraManager extends THREE.Object3D {
  autonomous = false
  vrModeActivated = false
  scrollingElement
  stageSize
  camera
  cameraWiggleTweenX
  cameraWiggleTweenY

  cameraRotationQuaternion = new THREE.Quaternion()
  deviceOrientation = null
  screenOrientation = window.orientation || 0
  mousePosition = new THREE.Vector2()
  deviceOrientationInitialQuat = new THREE.Quaternion()

  vewportSizeAtCameraFocus = new THREE.Vector2()

  constructor (stageSize) {
    super()
    this.scrollingElement = (document.scrollingElement || document.documentElement)
    this.stageSize = stageSize
    this.camera = new THREE.PerspectiveCamera(CONST.CameraFOV, stageSize.width / stageSize.height, CONST.CameraNearPlane, CONST.CameraFarPlane)
    this.setVisibleViewPortSizeAtCameraFocus(CONST.CameraDistanceToSection, this.camera)
    this.updateCamera()
    this.position.z = CONST.InitialCameraDistance
    if (store.state.initDiving) this.initDiving()
    this.add(this.camera)

    this.handleEvents()

    this.setCameraWiggleX()
    this.setCameraWiggleY()

    GuiManager.add(this, 'resetOrientation').name('Reset Orientation')
  }

  setVisibleViewPortSizeAtCameraFocus (depth, camera) {
    const cameraOffset = camera.position.z
    if (depth < cameraOffset) depth -= cameraOffset
    else depth += cameraOffset
    const vFOV = camera.fov * Math.PI / 180
    this.vewportSizeAtCameraFocus.height = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
    this.vewportSizeAtCameraFocus.width = this.vewportSizeAtCameraFocus.height * camera.aspect

    store.commit('setViewportSizeAtCameraFocus', this.vewportSizeAtCameraFocus)
  }

  initDiving () {
    TweenMax.to(this.position, CONST.InitialCameraTweenDuration, {
      z: CONST.CameraDistanceToSection,
      ease: Power4.easeInOut,
      onComplete: () => {
        AnimationLoopManager.addFirstCallback(this.updateCamera)
      }
    })
  }

  set vrMode (vrModeActivated) {
    this.vrModeActivated = vrModeActivated
    if (this.vrModeActivated) {
      this.cameraWiggleTweenX.kill()
      this.cameraWiggleTweenY.kill()
      this.camera.position.set(0, 0, 0)
    } else {
      this.setCameraWiggleX()
      this.setCameraWiggleY()
    }
  }

  get vrMode () {
    return this.vrModeActivated
  }

  updateCamera = () => {
    this.position.z += (((-this.scrollingElement.scrollTop * CONST.PageHeightMultiplyer) + CONST.CameraDistanceToSection) - this.position.z) * 0.1
    this.updateCameraRotation()
    window.AppScrollPercentage = Utils.clamp((-(this.position.z - CONST.CameraDistanceToSection) / CONST.SceneDepth), 0, 1)
    if (this.vrModeActivated) {
      this.camera.quaternion.copy(this.cameraRotationQuaternion)
    } else {
      this.camera.quaternion.slerp(this.cameraRotationQuaternion, CONST.CameraRotationEaseFactor)
    }
  }

  updateCameraRotation () {
    if (this.deviceOrientation) {
      this.deviceOrientationToQuaternion(this.cameraRotationQuaternion, this.deviceOrientation)
      this.cameraRotationQuaternion.premultiply(this.deviceOrientationInitialQuat)
    } else {
      this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-this.mousePosition.y, -this.mousePosition.x, 0))
    }
  }

  handleEvents () {
    window.addEventListener('mousemove', this.onMouseMove, false)
    window.addEventListener('mouseout', this.onMouseOut, false)
    window.addEventListener('deviceorientation', this.onDeviceOrientationInit, false)
    window.addEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
  }

  removeListeners () {
    window.removeEventListener('mousemove', this.onMouseMove, false)
    window.removeEventListener('mouseout', this.onMouseOut, false)
    window.removeEventListener('deviceorientation', this.onDeviceOrientationChange, false)
    window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
    window.removeEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
  }

  restrictFOV (vec2) {
    let maxWidth = this.stageSize.width >> 1
    let maxHeight = this.stageSize.height >> 1
    vec2.x = (vec2.x - maxWidth) / maxWidth
    vec2.y = (vec2.y - maxHeight) / maxHeight
    vec2.multiplyScalar(CONST.CameraRotationRestrictFactor)
  }

  onMouseOut = (e) => {
    this.resetOrientation()
  }

  onMouseMove = (e) => {
    // TODO : handle this for mobile devices
    if (e.target.nodeName === 'CANVAS') {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
      this.restrictFOV(this.mousePosition)
    }
  }

  onDeviceOrientationInit = (e) => {
    this.deviceOrientationToQuaternion(this.deviceOrientationInitialQuat, e)
    this.deviceOrientationInitialQuat = this.deviceOrientationInitialQuat.clone().conjugate()
    window.addEventListener('deviceorientation', this.onDeviceOrientationChange, false)
    window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
  }

  onDeviceOrientationChange = (e) => {
    this.deviceOrientation = e
  }

  onCompassNeedsCalibration = (e) => {
    e.preventDefault()
  }

  deviceOrientationToQuaternion (quaternion, deviceOrientation) {
    let zee = new THREE.Vector3(0, 0, 1)
    let q0 = new THREE.Quaternion()
    let q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)) // - PI/2 around the x-axis

    let alpha = deviceOrientation.alpha ? THREE.Math.degToRad(deviceOrientation.alpha) + 0 : 0 // Z
    let beta = deviceOrientation.beta ? THREE.Math.degToRad(deviceOrientation.beta) : 0 // X'
    let gamma = deviceOrientation.gamma ? THREE.Math.degToRad(deviceOrientation.gamma) : 0 // Y''
    let orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0 // O
    let euler = new THREE.Euler()
    euler.set(beta, alpha, -gamma, 'YXZ') // 'ZXY' for the device, but 'YXZ' for us
    quaternion.setFromEuler(euler) // orient the device
    quaternion.multiply(q1) // camera looks out the back of the device, not the top
    quaternion.multiply(q0.setFromAxisAngle(zee, -orient)) // adjust for screen orientation
  }

  resetOrientation () {
    this.mousePosition.x = this.stageSize.width * 0.5
    this.mousePosition.y = this.stageSize.height * 0.5
    this.restrictFOV(this.mousePosition)
  }

  setCameraWiggleX () {
    this.cameraWiggleTweenX = TweenMax.to(this.camera.position, (Math.random() * 5) + 2.5, {
      x: (Math.random() * 30) - 15,
      ease: Sine.easeInOut,
      onComplete: () => this.setCameraWiggleX()
    })
  }

  setCameraWiggleY () {
    this.cameraWiggleTweenY = TweenMax.to(this.camera.position, (Math.random() * 5) + 2.5, {
      y: (Math.random() * 30) - 15,
      ease: Sine.easeInOut,
      onComplete: () => this.setCameraWiggleY()
    })
  }

  scrollTo (depth, callback) {
    TweenMax.to(this.scrollingElement, 1, {
      scrollTo: depth,
      onComplete: callback
    })
  }

  setSize (stageSize) {
    this.stageSize = stageSize
    this.camera.aspect = this.stageSize.width / this.stageSize.height
    this.camera.updateProjectionMatrix()
    this.setVisibleViewPortSizeAtCameraFocus(CONST.CameraDistanceToSection, this.camera)
  }
}
