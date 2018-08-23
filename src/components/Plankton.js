import * as THREE from 'three'
import AnimationLoopManager from '../utils/AnimationLoopManager'

export default class Plankton extends THREE.Object3D {
  spheres = []
  maxZPos

  constructor (maxZPos) {
    super()
    var spriteMap = new THREE.TextureLoader().load(require('../assets/dust.png'))
    var material = new THREE.SpriteMaterial({map: spriteMap, fog: true})
    material.blending = THREE.AdditiveBlending
    for (let i = 0; i < 1000; i++) {
      let mesh = new THREE.Sprite(material)
      mesh.position.x = Math.random() * 2500 - 1250
      mesh.position.y = Math.random() * 2500 - 1250
      mesh.position.z = -Math.random() * (maxZPos + 500)
      mesh.scale.x = Math.random() * 20
      mesh.scale.y = Math.random() * 20
      mesh.scale.z = Math.random() * 20
      material.opacity = Math.random() * 0.4 + 0.1
      this.add(mesh)
      this.spheres.push(mesh)
    }
    AnimationLoopManager.addInLoop(() => this.updatePlankton())
  }

  updatePlankton () {
    let timer = 0.00001 * Date.now()
    for (var i = 0, il = this.spheres.length; i < il; i++) {
      var sphere = this.spheres[i]
      sphere.position.x = 1250 * Math.cos(timer + i)
      sphere.position.y = 1250 * Math.sin(timer + i * 1.1)
      sphere.material.rotation = 20 * Math.cos(timer + i)
    }
  }
}
