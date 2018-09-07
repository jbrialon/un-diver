import THREE from '@/utils/ThreeWithPlugins'
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
// import Utils from '@/utils/Utils'
import GuiManager from '@/utils/GuiManager'

export default class Terrain extends THREE.Object3D {
  rockTexture
  coralsTexture
  floorTexture
  mesh = null

  sharkPathSpline = null
  turtlePathSpline = null

  objLoader = new THREE.OBJLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor () {
    super()
    this.objLoader.load(CONST.TerrainModelPath, this.onModelLoaded, () => {}, this.onError)
    this.rockTexture = this.textureLoader.load(CONST.TerrainRockMap, this.onTextureLoaded)
    this.coralsTexture = this.textureLoader.load(CONST.TerrainCoralMap, this.onTextureLoaded)
    this.floorTexture = this.textureLoader.load(CONST.TerrainFloorMap, this.onTextureLoaded)

    this.rockTexture.wrapS = THREE.RepeatWrapping
    this.rockTexture.wrapT = THREE.RepeatWrapping
    this.rockTexture.repeat.set(25, 125)

    this.coralsTexture.wrapS = THREE.RepeatWrapping
    this.coralsTexture.wrapT = THREE.RepeatWrapping
    this.coralsTexture.repeat.set(7.5, 50)

    this.floorTexture.wrapS = THREE.RepeatWrapping
    this.floorTexture.wrapT = THREE.RepeatWrapping
    this.floorTexture.repeat.set(3, 3)

    Object.assign(this, THREE.EventDispatcher)
  }

  onModelLoaded = (object) => {
    this.mesh = object
    this.mesh.position.x = -700
    this.mesh.position.y = 2761
    this.mesh.position.z = -CONST.SceneDepth + 700
    this.mesh.rotateX(THREE.Math.degToRad(90))
    this.mesh.name = 'Terrain'
    super.add(this.mesh)

    this.searchAnimalPaths()
    this.updateMaterials()

    let guiTerrainFolder = GuiManager.addFolder('Terrain position')
    guiTerrainFolder.add(this.mesh.position, 'x', -3000, 2000)
    guiTerrainFolder.add(this.mesh.position, 'y', 1000, 4000)
    guiTerrainFolder.add(this.mesh.position, 'z', 0, -CONST.SceneDepth)
  }

  onTextureLoaded = (texture) => {
    this.updateMaterials()
  }

  updateMaterials () {
    if (this.mesh && this.rockTexture && this.coralsTexture && this.rockTexture.image && this.coralsTexture.image) {
      this.mesh.traverse(child => {
        if (child.name.indexOf('rock') > -1) {
          child.material.map = this.rockTexture
        } else if (child.name.indexOf('coral') > -1) {
          child.material.map = this.coralsTexture
        } else if (child.name.indexOf('sandfloor') > -1) {
          child.material.map = this.floorTexture
        }
      })
    }
  }

  searchAnimalPaths () {
    this.mesh.traverse(child => {
      switch (child.name) {
        case CONST.SharkPathName:
          this.sharkPathSpline = child
          break
        case CONST.TurtlePathName:
          this.turtlePathSpline = child
          break
        default:
          break
      }
    })

    if (this.sharkPathSpline) {
      this.mesh.remove(this.sharkPathSpline)
      this.dispatchEvent({type: CONST.SHARK_PATH_LOADED, spline: this.sharkPathSpline})
    }

    if (this.turtlePathSpline) {
      this.mesh.remove(this.turtlePathSpline)
      this.dispatchEvent({type: CONST.TURTLE_PATH_LOADED, spline: this.turtlePathSpline})
    }
  }

  onError = (error) => {
    // eslint-disable-next-line
    console.error(error)
  }
}
