/*
* Mother Class for all Sections
*/
import * as THREE from 'three'

export default class Section extends THREE.Object3D {
  sectionData
  sectionDepth
  sectionIdSent = false

  constructor (sectionData) {
    super()
    this.matrixAutoUpdate = false
    this.sectionData = sectionData
    this.sectionDepth = this.sectionData.sectionDepth
    Object.assign(this, THREE.EventDispatcher)
    // this.addDebugCube()
  }

  resize () {
    // handled in childs
  }

  addDebugCube () {
    const material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})
    const geometry = new THREE.CubeGeometry(100, 100, this.sectionDepth, material)
    material.transparent = true
    material.opacity = 0.5
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = -this.sectionDepth * 0.5
    mesh.position.x = -100
    mesh.position.y = -100
    super.add(mesh)
  }
}
