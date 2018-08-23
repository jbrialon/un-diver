/*
* Handles the background color of the scene
* Fades between two colors when
* camera is moving down to bottom of the scene
*/
import * as THREE from 'three'
import GuiManager from '../utils/GuiManager'
import AnimationLoopManager from '../utils/AnimationLoopManager'

export default class BackgroundColorManager {
  surfaceColor = new THREE.Color(0x298295)
  bottomColor = new THREE.Color(0x0e293c)
  backgroundColor = new THREE.Color()
  renderer
  scene
  light
  density = 0.0003

  constructor (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    GuiManager.add(this, 'density', 0.00001, 0.0005).name('Fog depth')
  }

  init () {
    AnimationLoopManager.addInLoop(() => this.updateBackground())
  }

  updateBackground () {
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage)
    this.renderer.setClearColor(this.backgroundColor, 1)
    this.scene.fog = new THREE.FogExp2(this.backgroundColor.getHex(), this.density)
  }
}
