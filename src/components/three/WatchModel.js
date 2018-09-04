import * as CONST from '@/Constants'
import store from '@/store'
import {TweenMax, Power4, Sine, Linear} from 'gsap'
import THREE from '@/reflectance/ReflectanceImports'

export default class WatchModel extends THREE.Object3D {
  model
  modelLoader = new THREE.OBJLoader()
  textureLoader = new THREE.TextureLoader()
  material = new THREE.MeshStandardMaterial()

  rotationTween

  hoursHand
  minutesHand
  secondsHand

  constructor () {
    super()
    this.modelLoader.load(CONST.WatchModelPath, this.onModelLoaded)
  }

  onModelLoaded = (group) => {
    this.model = group
    this.textureLoader.setPath(CONST.WatchTexturesPath)

    this.material.roughness = 1
    this.material.metalness = 1
    this.material.map = this.textureLoader.load(CONST.WatchDiffuseMap)
    this.material.metalnessMap = this.material.roughnessMap = this.textureLoader.load(CONST.WatchMetalnessMap)
    this.material.emissive = new THREE.Color(0xffffff)
    this.material.emissiveIntensity = 0
    this.material.emissiveMap = this.textureLoader.load(CONST.WatchEmissiveMap)

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.material
      }
    })

    this.matrixAutoUpdate = false
    this.model.scale.set(3, 3, 3)
    super.add(this.model)
    this.model.updateMatrix()
    this.model.updateMatrixWorld()

    TweenMax.fromTo(this.model.position, 3, {x: -3}, {
      x: 3,
      yoyo: true,
      yoyoEase: true,
      ease: Sine.easeInOut,
      repeat: -1
    })
    TweenMax.fromTo(this.model.position, 5, {x: -3}, {
      y: 3,
      yoyo: true,
      yoyoEase: true,
      ease: Sine.easeInOut,
      repeat: -1
    })

    this.rotationTween = TweenMax.set(this.model.rotation, {y: 0})

    this.initHands()
    this.setNightMode(store.state.nightMode)
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

  orientWatch (watchOrientation, reset, direction) {
    if (this.model && this.rotationTween) {
      const duration = reset ? 1.5 : 0.8
      let xRot = -Math.PI * 0.1
      let yRot = 0
      let xPos = 0
      this.rotationTween.kill()
      switch (watchOrientation) {
        case 'left':
          yRot = Math.PI * 0.25
          break
        case 'right':
          yRot = -Math.PI * 0.25
          break
        case 'center':
          yRot = 0
          xRot = 0
          xPos = direction ? 0 : -50
          break
        default:
          break
      }
      this.rotationTween = TweenMax.to(this.model.rotation, duration, {
        y: reset ? 0 : yRot,
        x: reset ? 0 : xRot,
        ease: Power4.easeInOut
      })

      TweenMax.to(this.model.position, duration, {
        x: reset && direction ? 0 : xPos,
        ease: Power4.easeInOut
      })
    }
  }

  setNightMode (activated) {
    TweenMax.to(this.material, 0.5, {
      envMapIntensity: activated ? 0.2 : 2,
      ease: Power4.easeInOut
    })
    TweenMax.to(this.material, 0.5, {
      emissiveIntensity: activated ? 1 : 0,
      ease: Power4.easeInOut
    })
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
