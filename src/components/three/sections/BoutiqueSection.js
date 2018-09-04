/*
* Section with only a Boutique picture inside
*/
import store from '@/store'
import Section from '@/components/three/Section.js'
import * as CONST from '@/Constants'
import * as THREE from 'three'

export default class BoutiqueSection extends Section {
  extraScale = 0.1 // ensure image is in screen event with camera wiggle
  texture
  mesh

  constructor (sectionData) {
    super(sectionData)
    new THREE.TextureLoader().load(CONST.BoutiqueImage, this.onTextureLoaded)
  }

  onTextureLoaded = (texture) => {
    this.texture = texture
    let geometry = new THREE.PlaneGeometry(this.texture.image.width, this.texture.image.height)
    let material = new THREE.MeshBasicMaterial({map: this.texture, side: THREE.FrontSide})
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.matrixAutoUpdate = false
    super.add(this.mesh)
    this.resize()
  }

  resize () {
    if (this.texture) {
      const viewportSize = store.state.viewportSizeAtCameraFocus
      const screenRatio = viewportSize.height / viewportSize.width
      const textureRatio = this.texture.image.height / this.texture.image.width
      let scaleDiff = 0
      if (screenRatio < textureRatio) { // stick on viewport width
        scaleDiff = this.texture.image.width / viewportSize.width
      } else { // stick on viewport height
        scaleDiff = this.texture.image.height / viewportSize.height
      }
      scaleDiff = 1 / scaleDiff
      scaleDiff += this.extraScale
      this.mesh.scale.set(scaleDiff, scaleDiff, scaleDiff)
      this.mesh.position.set(0, 0, -this.depth)
      this.mesh.updateMatrix()
    }
  }
}
