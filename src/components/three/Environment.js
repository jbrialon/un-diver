/*
* Creates the environment
* add to the scene fishes, rocks etc...
*/
import {TweenMax, Power4} from 'gsap'
import * as CONST from '@/Constants'
// TODO : fix those imports, its ugly
import THREE from '@/reflectance/ReflectanceImports'
import FBXLoader from 'three-fbxloader-offical'
import GuiManager from '@/utils/GuiManager'
import Utils from '@/utils/Utils'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
// import Plankton from '@/components/three/Plankton.js'

export default class Environment extends THREE.Object3D {
  clock = new THREE.Clock();
  scene
  sceneFarDistance
  terrainModel
  sharkModel
  turtleModel
  diverModel
  modelMixers = []
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

  constructor (scene, renderer, sceneFarDistance) {
    super()
    this.scene = scene
    this.renderer = renderer
    this.sceneFarDistance = sceneFarDistance
    Object.assign(this, THREE.EventDispatcher)
    this.init()
  }

  init () {
    this.scene.fog = new THREE.FogExp2(this.backgroundColor, CONST.FogDensity)

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
    guiLightFolder.add(this, 'ambientLightFactor', 0, 2).name('Ambient Light')
    guiLightFolder.add(this, 'directionnalLightFactor', 0, 2).name('Directionnal Light')

    let loader = new FBXLoader()
    loader.load(CONST.TerrainModelPath, this.onTerrainLoaded)
    loader.load(CONST.SharkModelPath, this.onSharkLoaded)
    loader.load(CONST.TurtleModelPath, this.onTurtleLoaded)
    loader.load(CONST.DiverModelPath, this.onDiverLoaded)

    // this.scene.add(new THREE.HemisphereLight(0x443333, 0x222233, 4))
    // Set up environment map
    const hdrUrls = this.genEnvironementMapCubeUrls(CONST.HdrEnvTexturePath, '.hdr')
    new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, this.onEnvironmentLoaded)

    // set up plankton
    // let plankton = new Plankton(this.sceneFarDistance)
    // plankton.visible = false
    // super.add(plankton)
    // GuiManager.add(plankton, 'visible').name('Plankton')

    AnimationLoopManager.addCallback(this.updateEnvironment)
  }

  genEnvironementMapCubeUrls (prefix, postfix) {
    return [
      prefix + 'px' + postfix, prefix + 'nx' + postfix,
      prefix + 'py' + postfix, prefix + 'ny' + postfix,
      prefix + 'pz' + postfix, prefix + 'nz' + postfix
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
    this.terrainModel.children[2].material.side = THREE.BackSide
    this.terrainModel.position.x = -2922
    this.terrainModel.position.y = 9246
    this.terrainModel.position.z = 19676
    this.terrainModel.scale.x = object.scale.y = object.scale.z = 10
    this.terrainModel.rotateX(THREE.Math.degToRad(85))
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
    this.initAnimal(this.sharkModel)
    this.sharkModel.position.y = 200
    this.sharkModel.position.x = 750
    this.sharkModel.position.z = -6000
    this.sharkModel.rotateX(THREE.Math.degToRad(45))
    Utils.removeObjectShininess(this.sharkModel)
    super.add(this.sharkModel)
  }

  onTurtleLoaded = (object) => {
    this.turtleModel = object
    this.initAnimal(this.turtleModel)
    this.turtleModel.position.y = 150
    this.turtleModel.position.x = -500
    this.turtleModel.position.z = -3000
    this.turtleModel.rotateX(THREE.Math.degToRad(45))
    this.turtleModel.rotateY(THREE.Math.degToRad(45))
    Utils.removeObjectShininess(this.turtleModel)
    super.add(this.turtleModel)
  }

  onDiverLoaded = (object) => {
    this.diverModel = object
    this.initAnimal(this.diverModel)
    this.diverModel.position.y = 0
    this.diverModel.position.x = -0
    this.diverModel.lookAt(-100, 100, -250)
    Utils.removeObjectShininess(this.diverModel)
    super.add(this.diverModel)
  }

  initAnimal (animalModel) {
    this.initModelAnimation(animalModel)
    animalModel.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }

  initModelAnimation (model) {
    model.mixer = new THREE.AnimationMixer(model)
    this.modelMixers.push(model.mixer)
    model.mixer.clipAction(model.animations[ 0 ]).setDuration(5).play()
  }

  toggleNight (activated) {
    TweenMax.to(this, 0.5, {ease: Power4.easeOut, backgroundNightColorDarken: activated ? CONST.NightOpacity : 1})
  }

  updateEnvironment = () => {
    let delta = this.clock.getDelta()
    if (this.sharkModel) this.sharkModel.position.x -= 1
    if (this.turtleModel) this.turtleModel.position.x += 0.5
    if (this.diverModel) {
      // TODO : keep model axis when moving
      this.diverModel.position.x -= 0.1
      this.diverModel.position.y += 0.1
      this.diverModel.position.z -= 0.7
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
    this.scene.background = this.backgroundColor
    this.scene.fog.color = this.backgroundColor
  }
}
