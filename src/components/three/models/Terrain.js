import THREE from '@/utils/ThreeWithPlugins'
import FBXLoader from 'three-fbxloader-offical'
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
import GuiManager from '@/utils/GuiManager'

export default class Terrain extends THREE.Object3D {
  rockTexture
  coralsTexture
  mesh = null

  sharkPathSpline = null
  turtlePathSpline = null

  objLoader = new FBXLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor () {
    super()
    this.objLoader.load(CONST.TerrainModelPath, this.onModelLoaded, () => {}, this.onError)
    // ROCK
    this.rockTexture = this.textureLoader.load(CONST.TerrainRockMap, this.onTextureLoaded)
    // CORAL ONE
    this.coralsTextureOne = this.textureLoader.load(CONST.TerrainCoralMapOne, this.onTextureLoaded)
    this.coralsAlphaTextureOne = this.textureLoader.load(CONST.TerrainCoralAlphaOne, this.onTextureLoaded)
    // CORAL TWO
    this.coralsTextureTwo = this.textureLoader.load(CONST.TerrainCoralMapTwo, this.onTextureLoaded)
    this.coralsAlphaTextureTwo = this.textureLoader.load(CONST.TerrainCoralAlphaTwo, this.onTextureLoaded)
    // CORAL THREE
    this.coralsTextureThree = this.textureLoader.load(CONST.TerrainCoralMapThree, this.onTextureLoaded)
    this.coralsAlphaTextureThree = this.textureLoader.load(CONST.TerrainCoralAlphaThree, this.onTextureLoaded)
    // SAND
    this.sandTexture = this.textureLoader.load(CONST.SandCoralMap, this.onTextureLoaded)

    this.rockTexture.wrapS = THREE.RepeatWrapping
    this.rockTexture.wrapT = THREE.RepeatWrapping
    this.rockTexture.repeat.set(25, 125)

    // this.coralsTexture.wrapS = THREE.RepeatWrapping
    // this.coralsTexture.wrapT = THREE.RepeatWrapping
    // this.coralsTexture.repeat.set(7.5, 50)

    Object.assign(this, THREE.EventDispatcher)
  }

  onModelLoaded = (object) => {
    this.mesh = object
    this.mesh.position.x = -700
    this.mesh.position.y = 2761
    this.mesh.position.z = -CONST.SceneDepth - 500
    this.mesh.rotateX(THREE.Math.degToRad(90))
    this.mesh.name = 'Terrain'
    super.add(this.mesh)

    this.searchAnimalPaths()
    this.updateMaterials()

    let guiTerrainFolder = GuiManager.addFolder('Terrain position')
    guiTerrainFolder.add(this.mesh.position, 'x', -3000, 2000)
    guiTerrainFolder.add(this.mesh.position, 'y', 1000, 4000)
    guiTerrainFolder.add(this.mesh.position, 'z', 15000, 45000)
  }

  onTextureLoaded = (texture) => {
    this.updateMaterials()
  }

  updateMaterials () {
    if (
      this.mesh && this.rockTexture && this.rockTexture.image &&
      this.sandTexture && this.sandTexture.image &&
      this.coralsTextureOne && this.coralsTextureOne.image &&
      this.coralsAlphaTextureOne && this.coralsAlphaTextureOne.image &&
      this.coralsTextureTwo && this.coralsTextureTwo.image &&
      this.coralsAlphaTextureTwo && this.coralsAlphaTextureTwo.image &&
      this.coralsTextureThree && this.coralsTextureThree.image &&
      this.coralsAlphaTextureThree && this.coralsAlphaTextureThree.image
    ) {
      this.mesh.traverse(child => {
        switch (child.name) {
          case 'rocks':
            child.material.map = this.rockTexture
            break
          case 'rocks2':
            child.material.map = this.rockTexture
            break
          case 'coral1':
            child.material.map = this.coralsTextureOne
            child.material.transparent = true
            child.material.alphaMap = this.coralsAlphaTextureOne
            break
          case 'coral2':
            child.material.map = this.coralsTextureTwo
            child.material.transparent = true
            child.material.alphaMap = this.coralsAlphaTextureTwo
            break
          case 'coral3':
            child.material.map = this.coralsTextureThree
            child.material.transparent = true
            child.material.alphaMap = this.coralsAlphaTextureThree
            break
          case 'sand':
            child.material.map = this.sandTexture
            break
          default:
            break
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
      this.dispatchEvent({ type: CONST.SHARK_PATH_LOADED, spline: this.sharkPathSpline })
    }

    if (this.turtlePathSpline) {
      this.mesh.remove(this.turtlePathSpline)
      this.dispatchEvent({ type: CONST.TURTLE_PATH_LOADED, spline: this.turtlePathSpline })
    }
  }

  onError = (error) => {
    // eslint-disable-next-line
    console.error(error)
  }
}
