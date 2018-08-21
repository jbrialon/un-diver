/*
* Handles the background color of the scene
* Fades between two colors when
* camera is moving down to bottom of the scene
*/
import * as THREE from 'three'
import GuiManager from '../utils/GuiManager'

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

    let guiFogFoler = GuiManager.addFolder('Fog')
    guiFogFoler.add(this, 'density')
  }

  init () {
    this.updateFade()
  }

  updateFade = () => {
    requestAnimationFrame(this.updateFade)
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage)
    this.renderer.setClearColor(this.backgroundColor, 1)
    this.scene.fog = new THREE.FogExp2(this.backgroundColor.getHex(), this.density)
  }
}
