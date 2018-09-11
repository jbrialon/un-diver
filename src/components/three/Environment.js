/*
* Creates the environment
* add to the scene fishes, rocks etc...
*/
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
import THREE from '@/utils/ThreeWithPlugins'
import GuiManager from '@/utils/GuiManager'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import FishManager from '@/components/three/fishes/FishManager.js'
import Animal from '@/components/three/models/Animal'
import Terrain from '@/components/three/models/Terrain'
import Plankton from '@/components/three/Plankton'
import { forEach } from 'lodash'

export default class Environment extends THREE.Object3D {
  clock = new THREE.Clock();
  scene

  terrainModel
  sharkModel
  turtleModel

  animalsArray = []

  ambientLight
  directionalLight

  surfaceColor = new THREE.Color(CONST.SeaSurfaceColorCode)
  bottomColor = new THREE.Color(CONST.SeaBottomColorCode)
  backgroundColor = new THREE.Color()
  backgroundDepthColorDarken = 1
  backgroundNightColorDarken = 1
  ambientLightFactor = 2
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
    this.addAnimals()
    this.addTerrain()
    this.addPlankton()
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
    guiLightFolder.add(this, 'ambientLightFactor', 0, 3).name('Ambient')
    guiLightFolder.add(this, 'directionnalLightFactor', 0, 2).name('Directionnal')
  }

  addTerrain () {
    this.terrainModel = new Terrain()
    /*
    this.terrainModel.addEventListener(CONST.SHARK_PATH_LOADED, event => {
      this.sharkModel.setAnimationPath(event.spline)
    })
    this.terrainModel.addEventListener(CONST.TURTLE_PATH_LOADED, event => {
      this.turtleModel.setAnimationPath(event.spline)
    })
    */
    this.add(this.terrainModel)
  }

  addAnimals () {
    this.sharkModel = new Animal()
    this.sharkModel.loadModel(CONST.SharkModelPath)
    this.sharkModel.loadDiffuseMap(CONST.SharkDiffuseMap)
    this.sharkModel.loadGlossinessMap(CONST.SharkGlossinessMap)
    this.sharkModel.position.y = 500
    this.sharkModel.position.x = 500
    this.sharkModel.position.z = -6300
    this.sharkModel.cruisingRadius = 2000
    this.sharkModel.speed = 1
    this.sharkModel.mesh.scale.multiplyScalar(1.8)
    this.sharkModel.setOrientation(new THREE.Euler(THREE.Math.degToRad(30), THREE.Math.degToRad(45), 0))
    this.sharkModel.setAnimationPath(null)
    this.add(this.sharkModel)
    this.animalsArray.push(this.sharkModel)

    this.turtleModel = new Animal()
    this.turtleModel.loadModel(CONST.TurtleModelPath)
    this.turtleModel.loadDiffuseMap(CONST.TurtleDiffuseMap)
    this.turtleModel.position.y = -300
    this.turtleModel.position.x = 0
    this.turtleModel.position.z = -13000
    this.turtleModel.speed = -1
    this.turtleModel.mesh.scale.multiplyScalar(2)
    this.turtleModel.setOrientation(new THREE.Euler(THREE.Math.degToRad(25), THREE.Math.degToRad(45), 0))
    this.turtleModel.setAnimationPath(null)
    this.add(this.turtleModel)
    this.animalsArray.push(this.turtleModel)

    let otherSharkModel = new Animal()
    otherSharkModel.loadModel(CONST.SharkModelPath)
    otherSharkModel.loadDiffuseMap(CONST.SharkDiffuseMap)
    otherSharkModel.loadGlossinessMap(CONST.SharkGlossinessMap)
    otherSharkModel.position.y = 400
    otherSharkModel.position.x = 400
    otherSharkModel.position.z = -CONST.SceneDepth * 0.8
    otherSharkModel.cruisingRadius = 2000
    otherSharkModel.speed = 1
    otherSharkModel.mesh.scale.multiplyScalar(1.8)
    otherSharkModel.setOrientation(new THREE.Euler(THREE.Math.degToRad(30), THREE.Math.degToRad(60), 0))
    otherSharkModel.setAnimationPath(null)
    this.add(otherSharkModel)
    this.animalsArray.push(otherSharkModel)
  }

  addEnvironmentMap () {
    const hdrUrls = this.genEnvironementMapCubeUrls(CONST.HdrEnvTexturePath, '.hdr')
    new THREE.HDRCubeTextureLoader(LoadingManager.instance).load(THREE.UnsignedByteType, hdrUrls, this.onEnvironmentLoaded)
  }

  addPlankton () {
    let plankton = new Plankton()
    this.add(plankton)
  }

  addFishes () {
    let fishManager = new FishManager(25, new THREE.Vector3(80, 80, 80))
    fishManager.position.set(200, 200, -2000)
    fishManager.updateMatrix()
    this.add(fishManager)

    let fishManagerDepth = new FishManager(60, new THREE.Vector3(200, 200, 400))
    fishManagerDepth.position.set(-600, 400, -12000)
    fishManagerDepth.updateMatrix()
    this.add(fishManagerDepth)
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
    this.dispatchEvent({type: CONST.ENVIRONMENT_MAP_LOADED, texture: pmremCubeUVPacker.CubeUVRenderTarget.texture})
    this.sharkModel.setEnvironmentMap(pmremCubeUVPacker.CubeUVRenderTarget.texture)
    cubeMap.dispose()
    pmremGenerator.dispose()
    pmremCubeUVPacker.dispose()
  }

  updateEnvironment = () => {
    let delta = this.clock.getDelta()
    forEach(this.animalsArray, animal => {
      animal.updateAnimation(delta)
    })

    this.backgroundNightColorDarken = 1 - window.AppNightIntensity * (1 - CONST.NightOpacity)
    this.backgroundDepthColorDarken = 1 - (window.AppScrollPercentage * 0.5)
    this.nightFactor = this.backgroundNightColorDarken * this.backgroundDepthColorDarken
    this.ambientLight.intensity = this.nightFactor * this.ambientLightFactor
    this.directionalLight.intensity = this.nightFactor * this.directionnalLightFactor
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage).multiplyScalar(this.nightFactor)
    this.ambientLight.color = this.backgroundColor
    // this.directionalLight.color = this.backgroundColor
    this.scene.background = this.backgroundColor
    this.scene.fog.color = this.backgroundColor
  }
}
