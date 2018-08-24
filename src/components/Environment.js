/*
* Creates the environment
* add to the scene fishes, rocks etc...
*/
import * as THREE from 'three'
import FBXLoader from 'three-fbxloader-offical'
import GuiManager from '../utils/GuiManager'
import AnimationLoopManager from '../utils/AnimationLoopManager'
import Plankton from './Plankton.js'

export default class Environment {
  clock = new THREE.Clock();
  terrainModelPath = 'environment.fbx'
  sharkModelPath = 'shark.fbx'
  turtleModelPath = 'turtle.fbx'
  diverModelPath = 'diver.fbx'
  scene
  sceneFarDistance
  terrainModel
  sharkModel
  turtleModel
  diverModel
  modelMixers = []

  constructor (scene, sceneFarDistance) {
    this.scene = scene
    this.sceneFarDistance = sceneFarDistance
  }

  init () {
    this.light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8)
    this.light.position.set(0, 200, -1000)
    this.scene.add(this.light)

    let loader = new FBXLoader()
    loader.load(this.terrainModelPath, (object) => this.onTerrainLoaded(object))
    loader.load(this.sharkModelPath, (object) => this.onSharkLoaded(object))
    loader.load(this.turtleModelPath, (object) => this.onTurtleLoaded(object))
    loader.load(this.diverModelPath, (object) => this.onDiverLoaded(object))

    // set up plankton
    let plankton = new Plankton(this.sceneFarDistance)
    plankton.visible = false
    this.scene.add(plankton)
    GuiManager.add(plankton, 'visible').name('Plankton')

    AnimationLoopManager.addCallback(() => this.updateEnvironment())
  }

  onTerrainLoaded (object) {
    this.terrainModel = object
    this.terrainModel.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
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
    guiTerrainFolder.add(this.terrainModel.rotation, 'x', 0, Math.PI)
  }

  onSharkLoaded (object) {
    this.sharkModel = object
    this.initAnimal(this.sharkModel)
    this.sharkModel.position.y = 200
    this.sharkModel.position.x = 750
    this.sharkModel.position.z = -6000
    this.sharkModel.rotateX(THREE.Math.degToRad(45))
    this.scene.add(this.sharkModel)
  }

  onTurtleLoaded (object) {
    this.turtleModel = object
    this.initAnimal(this.turtleModel)
    this.turtleModel.position.y = 150
    this.turtleModel.position.x = -500
    this.turtleModel.position.z = -3000
    this.turtleModel.rotateX(THREE.Math.degToRad(45))
    this.turtleModel.rotateY(THREE.Math.degToRad(45))
    this.scene.add(this.turtleModel)
  }

  onDiverLoaded (object) {
    this.diverModel = object
    this.initAnimal(this.diverModel)
    this.diverModel.position.y = 0
    this.diverModel.position.x = -0
    this.diverModel.position.z = -1500
    this.diverModel.rotateZ(THREE.Math.degToRad(60))
    this.scene.add(this.diverModel)
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

  updateEnvironment () {
    let delta = this.clock.getDelta()
    this.light.intensity = 1 // - ((window.AppScrollPercentage * 0.5) + 0.25)
    if (this.sharkModel) this.sharkModel.position.x -= 1
    if (this.turtleModel) this.turtleModel.position.x += 0.5
    if (this.diverModel) this.diverModel.position.z += 0.7
    if (this.modelMixers.length > 0) {
      for (var i = 0; i < this.modelMixers.length; i++) {
        this.modelMixers[i].update(delta)
      }
    }
  }
}
