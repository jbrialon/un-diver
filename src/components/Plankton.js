import * as THREE from 'three'

export default class Plankton extends THREE.Object3D {
  spheres = []

  constructor (text) {
    super()
    var spriteMap = new THREE.TextureLoader().load(require('../assets/dust.png'))
    var material = new THREE.SpriteMaterial({map: spriteMap, fog: true})
    material.blending = THREE.AdditiveBlending
    for (let i = 0; i < 1000; i++) {
      let mesh = new THREE.Sprite(material)
      mesh.position.x = Math.random() * 10000 - 5000
      mesh.position.y = Math.random() * 10000 - 5000
      mesh.position.z = -Math.random() * 10000
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 30
      material.opacity = Math.random() * 0.4 + 0.1
      this.add(mesh)
      this.spheres.push(mesh)
    }

    this.updatePlankton()
  }

  updatePlankton = () => {
    requestAnimationFrame(this.updatePlankton)
    let timer = 0.00001 * Date.now()
    for (var i = 0, il = this.spheres.length; i < il; i++) {
      var sphere = this.spheres[i]
      sphere.position.x = 5000 * Math.cos(timer + i)
      sphere.position.y = 5000 * Math.sin(timer + i * 1.1)
      sphere.material.rotation = 100 * Math.cos(timer + i)
    }
  }
}
