import THREE from '@/utils/ThreeWithPlugins'
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
import Utils from '@/utils/Utils'
import GuiManager from '@/utils/GuiManager'

export default class Terrain extends THREE.Object3D {
  material = new THREE.MeshLambertMaterial()
  mesh = new THREE.Mesh()

  objLoader = new THREE.OBJLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor () {
    super()
    this.objLoader.load(CONST.TerrainModelPath, this.onModelLoaded, () => {}, this.onError)
    this.material.map = this.textureLoader.load(CONST.TerrainDiffuseMap)
    this.material.map.wrapS = THREE.RepeatWrapping
    this.material.map.wrapT = THREE.RepeatWrapping
  }

  onModelLoaded = (object) => {
    this.mesh = object
    Utils.applyMaterialToGroup(this.mesh, this.material)
    // this.terrainModel.children[2].material.side = THREE.BackSide
    this.mesh.position.x = -386
    this.mesh.position.y = 1372
    this.mesh.position.z = -CONST.SceneDepth - 500
    this.mesh.rotateX(THREE.Math.degToRad(90))
    this.mesh.name = 'Terrain'
    super.add(this.mesh)

    let guiTerrainFolder = GuiManager.addFolder('Terrain position')
    guiTerrainFolder.add(this.mesh.position, 'x', -3000, 2000)
    guiTerrainFolder.add(this.mesh.position, 'y', 1000, 15000)
    guiTerrainFolder.add(this.mesh.position, 'z', 15000, 45000)
    guiTerrainFolder.add(this.mesh.rotation, 'x', 0, Math.PI).name('rotationX')
  }

  onError = (error) => {
    // eslint-disable-next-line
    console.error(error)
  }
}
