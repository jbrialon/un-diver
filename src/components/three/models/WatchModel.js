import * as CONST from '@/Constants'
import store from '@/store'
import Utils from '@/utils/Utils'
import LoadingManager from '@/utils/LoadingManager'
import { TweenMax, Sine, Linear } from 'gsap'
import THREE from '@/utils/ThreeWithPlugins'

export default class WatchModel extends THREE.Object3D {
  model = new THREE.Object3D()
  modelScale = 3

  modelLoader = new THREE.OBJLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)
  material = new THREE.MeshStandardMaterial()

  rotationTween

  hoursHand
  minutesHand
  secondsHand

  dayDisc

  meshWidth = 0
  meshHalfWidth = 0

  marginWatch

  constructor () {
    super()
    this.matrixAutoUpdate = false
    this.textureLoader.setPath(CONST.WatchTexturesPath)
    this.modelLoader.load(CONST.WatchModelPath, this.onModelLoaded)
    this.material.map = this.textureLoader.load(CONST.WatchDiffuseMap)
    this.material.metalnessMap = this.material.roughnessMap = this.textureLoader.load(CONST.WatchMetalnessMap)
    this.material.emissiveMap = this.textureLoader.load(CONST.WatchEmissiveMap)
    this.material.roughness = 1
    this.material.metalness = 1
    this.material.emissive = new THREE.Color(0xffffff)
    this.material.emissiveIntensity = 0
    this.marginWatch = CONST.MarginBetweenWatchAndText * store.state.viewportSizeAtCameraFocus.width
  }

  onModelLoaded = (group) => {
    this.model = group

    Utils.applyMaterialToGroup(this.model, this.material)

    this.model.scale.set(this.modelScale, this.modelScale, this.modelScale)
    super.add(this.model)

    this.model.traverse(child => {
      if (child.geometry) {
        child.geometry.computeBoundingBox()
        let boxSize = new THREE.Vector3()
        child.geometry.boundingBox.getSize(boxSize)
        if (this.meshWidth < boxSize.x) {
          this.meshWidth = boxSize.x
        }
      }
    })
    this.meshWidth *= this.modelScale
    this.meshHalfWidth = this.meshWidth * 0.5

    TweenMax.fromTo(this.model.position, 3, { x: -3 }, {
      x: 3,
      yoyo: true,
      yoyoEase: true,
      ease: Sine.easeInOut,
      repeat: -1
    })
    TweenMax.fromTo(this.model.position, 5, { x: -3 }, {
      y: 3,
      yoyo: true,
      yoyoEase: true,
      ease: Sine.easeInOut,
      repeat: -1
    })

    this.initHands()
    this.initDays()
  }

  initHands () {
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        switch (child.name) {
          case 'hours':
            this.hoursHand = child
            break
          case 'minutes':
            this.minutesHand = child
            break
          case 'seconds':
            this.secondsHand = child
            break
          default:
            break
        }
      }
    })
    let secondsOffset = 8.2
    this.secondsHand.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, secondsOffset, 0))
    this.secondsHand.translateY(-secondsOffset)
    this.setHandsRotation()
    setInterval(this.setHandsRotation, 1000)
    TweenMax.to(this.secondsHand.rotation, 60, {
      z: -Math.PI * 2,
      repeat: -1,
      ease: Linear.easeNone
    })
  }

  initDays () {
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === 'Disc_DATE') {
          this.dayDisc = child
        }
      }
    })
    let date = new Date()
    let day = date.getUTCDate()
    this.dayDisc.rotation.z = -THREE.Math.degToRad(11.25 * (day - 1))
  }

  orientWatch (factor) {
    let yRot = -factor * (Math.PI * 0.2)
    this.model.rotation.y += (yRot - this.model.rotation.y) * 0.2 // add a bit of easing
    let xPos = factor * (this.meshHalfWidth + this.marginWatch) // equivalent to this.position.x but with Object3D.matrixAutoUpdate === false (its faster)
    this.matrix.elements[12] += (xPos - this.matrix.elements[12]) * 0.2 // add a bit of easing
  }

  setNightIntensity (intensity) {
    this.material.envMapIntensity = ((1 - intensity) * 1.8) + 0.2
    this.material.emissiveIntensity = intensity
  }

  setHandsRotation = () => {
    let date = new Date()
    let minutes = date.getMinutes()
    let hours = date.getHours()

    this.hoursHand.rotation.z = -THREE.Math.degToRad((hours * 30) + (minutes / 2))
    this.minutesHand.rotation.z = -THREE.Math.degToRad(minutes * 6)
  }

  setEnvironmentMap (texture) {
    this.material.envMap = texture
    this.material.envMapIntensity = 2
    this.material.needsUpdate = true
  }
}
