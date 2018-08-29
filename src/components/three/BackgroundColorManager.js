/*
* Handles the background color of the scene
* Fades between two colors when
* camera is moving down to bottom of the scene
*/
import * as CONST from '../../Constants'
import * as THREE from 'three'
import GuiManager from '../../utils/GuiManager'
import AnimationLoopManager from '../../utils/AnimationLoopManager'

export default class BackgroundColorManager {
  surfaceColor = new THREE.Color(CONST.SeaSurfaceColorCode)
  bottomColor = new THREE.Color(CONST.SeaBottomColorCode)
  backgroundColor = new THREE.Color()
  renderer
  scene
  light
  density = CONST.FogDensity

  constructor (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    GuiManager.add(this, 'density', 0.00001, 0.0007).name('Fog depth')
  }

  init () {
    AnimationLoopManager.addCallback(this.updateBackground)
  }

  updateBackground = () => {
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage)
    this.renderer.setClearColor(this.backgroundColor, 1)
    this.scene.fog = new THREE.FogExp2(this.backgroundColor.getHex(), this.density)
  }
}
