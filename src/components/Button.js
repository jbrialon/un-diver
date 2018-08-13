import * as THREE from 'three'

export default class Button extends THREE.Object3D {
    text = ''
    link = ''

    constructor (text, link) {
      super()
      this.text = text
      this.link = link

      this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })
      this.geometry = new THREE.PlaneGeometry(window.ThreeStageSize.width * 0.2, window.ThreeStageSize.height * 0.05)
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      super.add(this.mesh)
    }
}
