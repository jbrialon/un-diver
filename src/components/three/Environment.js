/*
* Creates the environment
* add to the scene fishes, rocks etc...
*/
import {TweenMax, Power4} from 'gsap'
import * as CONST from '@/Constants'
import LoadingManager from '@/utils/LoadingManager'
import THREE from '@/utils/ThreeWithPlugins'
import GuiManager from '@/utils/GuiManager'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import FishManager from '@/components/three/fishes/FishManager.js'
import Animal from '@/components/three/models/Animal'
import Terrain from '@/components/three/models/Terrain'

export default class Environment extends THREE.Object3D {
  clock = new THREE.Clock();
  scene

  terrainModel
  sharkModel
  turtleModel

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
    this.addAnimals()
    this.addTerrain()
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

  addTerrain () {
    this.terrainModel = new Terrain()
    this.terrainModel.addEventListener(CONST.SHARK_PATH_LOADED, event => {
      this.sharkModel.setAnimationPath(event.spline)
    })
    this.terrainModel.addEventListener(CONST.TURTLE_PATH_LOADED, event => {
      this.turtleModel.setAnimationPath(event.spline)
    })
    this.add(this.terrainModel)
  }

  addAnimals () {
    this.sharkModel = new Animal(CONST.SharkModelPath)
    this.sharkModel.loadDiffuseMap(CONST.SharkDiffuseMap)
    this.sharkModel.loadGlossinessMap(CONST.SharkGlossinessMap)
    this.sharkModel.position.y = 200
    this.sharkModel.position.x = 500
    this.sharkModel.position.z = -5500
    this.sharkModel.rotateX(THREE.Math.degToRad(30))
    this.add(this.sharkModel)

    this.turtleModel = new Animal(CONST.TurtleModelPath)
    this.turtleModel.loadDiffuseMap(CONST.TurtleDiffuseMap)
    this.turtleModel.position.y = -350
    this.turtleModel.position.x = -300
    this.turtleModel.position.z = -12000
    this.turtleModel.rotateX(THREE.Math.degToRad(45))
    this.turtleModel.rotateY(THREE.Math.degToRad(45))
    this.add(this.turtleModel)
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

  toggleNight (activated) {
    TweenMax.to(this, 0.5, {ease: Power4.easeOut, backgroundNightColorDarken: activated ? CONST.NightOpacity : 1})
  }

  updateEnvironment = () => {
    let delta = this.clock.getDelta()
    this.sharkModel.updateAnimation(delta)
    this.turtleModel.updateAnimation(delta)

    this.backgroundDepthColorDarken = 1 - (window.AppScrollPercentage * 0.5)
    this.nightFactor = this.backgroundNightColorDarken * this.backgroundDepthColorDarken
    this.ambientLight.intensity = this.nightFactor * this.ambientLightFactor
    this.directionalLight.intensity = this.nightFactor * this.directionnalLightFactor
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage).multiplyScalar(this.nightFactor)
    this.ambientLight.color = this.backgroundColor
    this.directionalLight.color = this.backgroundColor
    this.scene.background = this.backgroundColor
    this.scene.fog.color = this.backgroundColor
    this.fishManager.updateFishes()
  }
}
