/*
* Handles the backgroudn color of the scene
* Fades between two colors when
* target is moving towards maxZPos
*/
import * as THREE from 'three'

export default class BackgroundColorManager {
  surfaceColor = new THREE.Color(0x4C707F)
  bottomColor = new THREE.Color(0x1C292F)
  backgroundColor = new THREE.Color()
  fadeFactor = 0
  renderer
  scene
  maxZPos
  target

  constructor (renderer, scene, target, maxZPos) {
    this.renderer = renderer
    this.scene = scene
    this.target = target
    this.maxZPos = maxZPos
  }

  init () {
    this.updateFade()
  }

  updateFade = () => {
    requestAnimationFrame(this.updateFade)
    this.fadeFactor = (-this.target.position.z / this.maxZPos)
    this.backgroundColor = this.surfaceColor.clone().lerp(this.bottomColor, this.fadeFactor)
    this.renderer.setClearColor(this.backgroundColor, 1)
    this.scene.fog = new THREE.FogExp2(this.backgroundColor.getHex(), 0.00045)
  }
}
