/*
* Adds Plankton-style particles to the scene
*/
import * as THREE from 'three'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import * as CONST from '@/Constants'
// import store from '@/store'

export default class Plankton extends THREE.Object3D {
  textureLoader = new THREE.TextureLoader()
  planktonVertices = []
  geometry = new THREE.BufferGeometry()
  parameters = []
  materials = []

  constructor () {
    super()
    for (let index = 0; index < CONST.PlanktonParticleMapCount; index++) {
      let sprite = this.textureLoader.load(CONST.PlanktonParticleMapPath + index + '.png')
      let param = []
      param.push(sprite) // sprite map
      param.push(Math.random() * 15) // particle size
      this.parameters.push(param)
    }

    let worldSize = new THREE.Vector3(2000, 2000, CONST.SceneDepth)
    for (let i = 0; i < CONST.PlanktonParticleCount; i++) {
      let x = Math.random() * worldSize.x - (worldSize.x * 0.5)
      let y = Math.random() * worldSize.y - (worldSize.y * 0.5)
      let z = Math.random() * -worldSize.z
      this.planktonVertices.push(x, y, z)
    }

    for (let i = 0; i < this.parameters.length; i++) {
      var sprite = this.parameters[i][0]
      var size = this.parameters[i][1]
      this.materials[i] = new THREE.PointsMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: true, transparent: true, fog: true, depthWrite: false })
      this.materials[i].color.setHex(0xffffff)
      this.materials[i].opacity = 0.1
      var particles = new THREE.Points(this.geometry, this.materials[i])
      particles.position.z = 0
      this.add(particles)
    }

    this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(this.planktonVertices, 3))

    AnimationLoopManager.addCallback(this.updatePlankton)
  }

  updatePlankton = () => {
    let time = Date.now() * 0.00001
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].rotation.z = time * (i < 4 ? i + 1 : -(i + 1))
    }
  }
}
