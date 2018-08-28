import * as CONST from '../Constants'
import GuiManager from '../utils/GuiManager'
import THREE from '../reflectance/ReflectanceImports'

export default class WatchModel extends THREE.Object3D {
  modelLoader = new THREE.OBJLoader()
  textureLoader = new THREE.TextureLoader()
  material = new THREE.MeshStandardMaterial()

  constructor () {
    super()
    // eslint-disable-next-line
    console.log('----', CONST.WatchModelPath)
    this.modelLoader.load(CONST.WatchModelPath, (model) => this.onModelLoaded(model))

    // GuiManager.add(params, 'envMap', [ 'LDR', 'HDR', 'RGBM16'])
    GuiManager.add(this.material, 'roughness', 0, 1)
    GuiManager.add(this.material, 'metalness', 0, 1)
  }

  onModelLoaded (group) {
    this.textureLoader.setPath(CONST.WatchTexturesPath)
    this.material.roughness = 1
    this.material.metalness = 1
    this.material.map = this.textureLoader.load(CONST.WatchDiffuseMap)
    // roughness is in G channel, metalness is in B channel
    this.material.metalnessMap = this.material.roughnessMap = this.textureLoader.load(CONST.WatchMetalnessMap)
    this.material.normalMap = this.textureLoader.load(CONST.WatchNormalsMap)
    this.material.map.wrapS = THREE.RepeatWrapping
    this.material.roughnessMap.wrapS = THREE.RepeatWrapping
    this.material.metalnessMap.wrapS = THREE.RepeatWrapping
    this.material.normalMap.wrapS = THREE.RepeatWrapping
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = this.material
      }
    })
    super.add(group)
  }

  setEnvironmentMap (envMap) {
    this.material.envMap = envMap
    this.material.needsUpdate = true
  }
}
