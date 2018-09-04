/*
* Mother Class for all Sections
*/
import * as THREE from 'three'

export default class Section extends THREE.Object3D {
  sectionData
  depth
  sectionIdSent = false

  constructor (sectionData) {
    super()
    this.matrixAutoUpdate = false
    this.sectionData = sectionData
    this.depth = this.sectionData.depth
    Object.assign(this, THREE.EventDispatcher)
    // this.addDebugCube()
  }

  resize () {
    // handled in childs
  }

  addDebugCube () {
    const material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, side: THREE.DoubleSide})
    const geometry = new THREE.CubeGeometry(100, 100, this.depth, material)
    material.transparent = true
    material.opacity = 0.5
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = -this.depth * 0.5
    mesh.position.x = -100
    mesh.position.y = -100
    super.add(mesh)
  }
}
