import * as THREE from 'three'
import Fader from './Fader.js'
import CanvasText from '../utils/CanvasText.js'

export default class Title extends THREE.Object3D {
    text = ''
    texture
    material
    geometry
    mesh

    constructor (text) {
      super()
      this.text = text

      this.texture = new THREE.Texture(
        CanvasText.getText(this.text, 80, 'Arial', 'rgba(255,255,255,1)', 'center', 'middle')
      )
      this.texture.needsUpdate = true
      this.texture.minFilter = THREE.LinearFilter
      this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, visible: true })
      this.geometry = new THREE.PlaneGeometry(this.texture.image.width, this.texture.image.height)
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.mesh.scale.set(0.5, 0.5, 0.5)
      super.add(this.mesh)
      return Object.assign(
        this,
        new Fader(this)
      )
    }
}
