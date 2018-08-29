import * as CONST from '../Constants'
import GuiManager from '../utils/GuiManager'
import THREE from '../reflectance/ReflectanceImports'

export default class WatchModel extends THREE.Object3D {
  model
  modelLoader = new THREE.OBJLoader()
  textureLoader = new THREE.TextureLoader()
  material = new THREE.MeshStandardMaterial()

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
        child.material = this.material
      }
    })
    super.add(this.model)

    this.initHands()

    GuiManager.add(this.material, 'roughness', 0, 1)
    GuiManager.add(this.material, 'metalness', 0, 1)
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

  setHandsRotation = () => {
    let date = new Date()
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    let hours = date.getHours()

    this.hoursHand.rotation.z = THREE.Math.degToRad((hours * 30) + (minutes / 2))
    this.minutesHand.rotation.z = THREE.Math.degToRad(minutes * 6)
    this.secondsHand.rotation.z = THREE.Math.degToRad(seconds * 6)
  }

  setEnvironmentMap (envMap) {
    this.material.envMap = envMap
    this.material.needsUpdate = true
  }
}
