/*
* Creates the environment
* add to the scene fishes, rocks etc...
*/
import {TweenMax, Power4} from 'gsap'
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
// TODO : fix those imports, its ugly
import THREE from '@/reflectance/ReflectanceImports'
import FBXLoader from 'three-fbxloader-offical'
import GuiManager from '@/utils/GuiManager'
import Utils from '@/utils/Utils'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import FishManager from '@/components/three/fishes/FishManager.js'

export default class Environment extends THREE.Object3D {
  clock = new THREE.Clock();
  scene

  terrainModel
  sharkModel
  turtleModel

  terrainMaterial
  sharkMaterial
  turtleMaterial

  modelMixers = []
  fishManager
  ambientLight
  directionalLight

  surfaceColor = new THREE.Color(CONST.SeaSurfaceColorCode)
  bottomColor = new THREE.Color(CONST.SeaBottomColorCode)
  backgroundColor = new THREE.Color()
  backgroundDepthColorDarken = 1
  backgroundNightColorDarken = 1
  ambientLightFactor = 1
  directionnalLightFactor = 1
  nightFactor = 1

  constructor (scene, renderer) {
    super()
    this.scene = scene
    this.renderer = renderer
    Object.assign(this, THREE.EventDispatcher)
    this.init()
  }

  init () {
    this.scene.fog = new THREE.FogExp2(this.backgroundColor, CONST.FogDensity)

    this.addLights()

    let fbxLoader = new FBXLoader(LoadingManager.instance)
    // let objLoader = new THREE.OBJLoader(LoadingManager.instance)
    let textureLoader = new THREE.TextureLoader(LoadingManager.instance)
    // objLoader.load(CONST.TerrainModelPath, this.onTerrainLoaded)
    fbxLoader.load(CONST.SharkModelPath, this.onSharkLoaded)
    // modelLoader.load(CONST.TurtleModelPath, this.onTurtleLoaded)

    // this.terrainMaterial = new THREE.MeshLambertMaterial()
    this.sharkMaterial = new THREE.MeshLambertMaterial()
    this.sharkMaterial.skinning = true
    this.sharkMaterial.shininess = 0
    // this.turtleMaterial = new THREE.MeshLambertMaterial()

    // this.terrainMaterial.map = textureLoader.load(CONST.TerrainDiffusePath)
    this.sharkMaterial.map = textureLoader.load(CONST.SharkDiffuseMap)
    // this.turtleMaterial.map = textureLoader.load(CONST.TurtleDiffusePath)

    this.addEnvironmentMap()
    this.addFishes()

    AnimationLoopManager.addCallback(this.updateEnvironment)
  }

  addLights () {
    this.ambientLight = new THREE.AmbientLight(0xffffff)
    super.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(0xffffff)
    this.directionalLight.position.x = 10
    this.directionalLight.position.y = 5
    this.directionalLight.position.z = 2
    this.directionalLight.position.normalize()
    this.directionalLight.intensity = 1
    super.add(this.directionalLight)

    let guiLightFolder = GuiManager.addFolder('Lights')
    guiLightFolder.add(this, 'ambientLightFactor', 0, 2).name('Ambient')
    guiLightFolder.add(this, 'directionnalLightFactor', 0, 2).name('Directionnal')
  }

  addEnvironmentMap () {
    const hdrUrls = this.genEnvironementMapCubeUrls(CONST.HdrEnvTexturePath, '.hdr')
    new THREE.HDRCubeTextureLoader(LoadingManager.instance).load(THREE.UnsignedByteType, hdrUrls, this.onEnvironmentLoaded)
  }

  addFishes () {
    this.fishManager = new FishManager()
    this.add(this.fishManager)
  }

  genEnvironementMapCubeUrls (prefix, postfix) {
    return [
      prefix + 'px' + postfix, prefix + 'nx' + postfix,
      prefix + 'pz' + postfix, prefix + 'ny' + postfix,
      prefix + 'py' + postfix, prefix + 'nz' + postfix
    ]
  }

  onEnvironmentLoaded = (cubeMap) => {
    let pmremGenerator = new THREE.PMREMGenerator(cubeMap)
    pmremGenerator.update(this.renderer)
    let pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods)
    pmremCubeUVPacker.update(this.renderer)
    this.dispatchEvent({type: 'environmentmaploaded', texture: pmremCubeUVPacker.CubeUVRenderTarget.texture})
    cubeMap.dispose()
    pmremGenerator.dispose()
    pmremCubeUVPacker.dispose()
  }

  onTerrainLoaded = (object) => {
    this.terrainModel = object
    Utils.applyMaterialToGroup(this.terrainModel, this.terrainMaterial)
    // this.terrainModel.children[2].material.side = THREE.BackSide
    this.terrainModel.position.x = -386
    this.terrainModel.position.y = 1372
    this.terrainModel.position.z = -CONST.SceneDepth - 500
    this.terrainModel.rotateX(THREE.Math.degToRad(90))
    this.terrainModel.name = 'Terrain'
    this.scene.add(this.terrainModel)

    let guiTerrainFolder = GuiManager.addFolder('Terrain position')
    guiTerrainFolder.add(this.terrainModel.position, 'x', -3000, 2000)
    guiTerrainFolder.add(this.terrainModel.position, 'y', 1000, 15000)
    guiTerrainFolder.add(this.terrainModel.position, 'z', 15000, 45000)
    guiTerrainFolder.add(this.terrainModel.rotation, 'x', 0, Math.PI).name('rotationX')
  }

  onSharkLoaded = (object) => {
    this.sharkModel = object
    this.sharkMaterial.shininess = 0
    Utils.applyMaterialToGroup(this.sharkModel, this.sharkMaterial)
    this.initAnimal(this.sharkModel)
    this.sharkModel.position.y = 200
    this.sharkModel.position.x = 500
    this.sharkModel.position.z = -5500
    this.sharkModel.rotateX(THREE.Math.degToRad(30))
    this.sharkModel.rotateY(THREE.Math.degToRad(45))
    super.add(this.sharkModel)
  }

  onTurtleLoaded = (object) => {
    this.turtleModel = object
    this.turtleMaterial.shininess = 0
    Utils.applyMaterialToGroup(this.turtleModel, this.turtleMaterial)
    this.initAnimal(this.turtleModel)
    this.turtleModel.position.y = -350
    this.turtleModel.position.x = -300
    this.turtleModel.position.z = -12000
    this.turtleModel.rotateX(THREE.Math.degToRad(45))
    this.turtleModel.rotateY(THREE.Math.degToRad(45))
    super.add(this.turtleModel)
  }

  initAnimal (animalModel) {
    this.initModelAnimation(animalModel)
    animalModel.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true
      }
    })
  }

  initModelAnimation (model) {
    model.mixer = new THREE.AnimationMixer(model)
    this.modelMixers.push(model.mixer)
    model.mixer.clipAction(model.animations[0]).setDuration(5).play()
  }

  toggleNight (activated) {
    TweenMax.to(this, 0.5, {ease: Power4.easeOut, backgroundNightColorDarken: activated ? CONST.NightOpacity : 1})
  }

  updateEnvironment = () => {
    let delta = this.clock.getDelta()
    if (this.sharkModel) {
      this.sharkModel.position.x -= 0.65
      this.sharkModel.position.z += 1
      this.sharkModel.position.y -= 0.15
    }
    if (this.turtleModel) {
      this.turtleModel.position.x += 0.2
      this.turtleModel.position.z -= 0.2
      this.turtleModel.position.y += 0.1
    }
    if (this.modelMixers.length > 0) {
      for (var i = 0; i < this.modelMixers.length; i++) {
        this.modelMixers[i].update(delta)
      }
    }

    this.backgroundDepthColorDarken = 1 - (window.AppScrollPercentage * 0.5)
    this.nightFactor = this.backgroundNightColorDarken * this.backgroundDepthColorDarken
    this.ambientLight.intensity = this.nightFactor * this.ambientLightFactor
    this.directionalLight.intensity = this.nightFactor * this.directionnalLightFactor
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage).multiplyScalar(this.nightFactor)
    this.ambientLight.color = this.backgroundColor
    // this.directionalLight.color = this.backgroundColor
    this.scene.background = this.backgroundColor
    this.scene.fog.color = this.backgroundColor
    this.fishManager.updateFishes()
  }
}
