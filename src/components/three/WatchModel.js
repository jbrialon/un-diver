import * as CONST from '@/Constants'
import store from '@/store'
import {TweenMax, Power4, Sine} from 'gsap'
import THREE from '@/reflectance/ReflectanceImports'

export default class WatchModel extends THREE.Object3D {
  model
  modelLoader = new THREE.OBJLoader()
  textureLoader = new THREE.TextureLoader()
  material = new THREE.MeshStandardMaterial()

  rotationTween
  watchGlowMesh

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

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === 'case') {
          this.watchGlowMesh = child.clone()
          this.watchGlowMesh.material = new THREE.MeshBasicMaterial({color: 0xbbff00})
          this.watchGlowMesh.material.transparent = true
          this.watchGlowMesh.material.opacity = (store.state.nightMode) ? 1 : 0
          child.parent.add(this.watchGlowMesh)
        }
        child.material = this.material
      }
    })

    this.matrixAutoUpdate = false
    this.model.scale.set(3, 3, 3)
    super.add(this.model)
    this.matrix.makeRotationY(-Math.PI)
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
  }

  setSubtextRotation (odd, reset) {
    const duration = reset ? 1.5 : 0.8
    if (this.model && this.rotationTween) {
      this.rotationTween.kill()
      this.rotationTween = TweenMax.to(this.model.rotation, duration, {
        y: reset ? 0 : (odd ? Math.PI * 0.25 : -Math.PI * 0.25),
        x: reset ? 0 : Math.PI * 0.1,
        ease: Power4.easeInOut
      })
    }
  }

  setNightMode (activated) {
    if (this.watchGlowMesh) {
      TweenMax.to(this.watchGlowMesh.material, 0.5, {
        opacity: activated ? 1 : 0,
        ease: Power4.easeInOut
      })
    }
  }

  setHandsRotation = () => {
    let date = new Date()
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    let hours = date.getHours()

    this.hoursHand.rotation.z = THREE.Math.degToRad((hours * 30) + (minutes / 2))
    this.minutesHand.rotation.z = THREE.Math.degToRad(minutes * 6)
    this.secondsHand.rotation.z = THREE.Math.degToRad(seconds * 6)
  }

  setEnvironmentMap (texture) {
    this.material.envMap = texture
    // this.material.envMapIntensity = 4
    this.material.needsUpdate = true
  }
}
