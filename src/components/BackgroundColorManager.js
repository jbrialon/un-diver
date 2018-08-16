/*
* Handles the backgroudn color of the scene
* Fades between two colors when
* camera is moving down to bottom of the scene
*/
import * as THREE from 'three'

export default class BackgroundColorManager {
  surfaceColor = new THREE.Color(0x4C707F)
  bottomColor = new THREE.Color(0x1C292F)
  backgroundColor = new THREE.Color()
  renderer
  scene
  light

  constructor (renderer, scene) {
    this.renderer = renderer
    this.scene = scene
  }

  init () {
    this.renderer.setClearColor(0xffffff, 1)
    this.updateFade()
  }

  updateFade = () => {
    requestAnimationFrame(this.updateFade)
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, window.AppScrollPercentage)
    this.renderer.setClearColor(this.backgroundColor, 1)
    this.scene.fog = new THREE.FogExp2(this.backgroundColor.getHex(), 0.00025)
  }
}
