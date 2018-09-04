/*
* Section with only a Boutique picture inside
*/
import Section from '@/components/three/Section.js'
import * as THREE from 'three'
import HtmlTextureManager from '@/utils/HtmlTextureManager.js'

export default class FinalSection extends Section {
  extraScale = 0.1 // ensure image is in screen event with camera wiggle
  mesh

  constructor (sectionData) {
    super(sectionData)
    HtmlTextureManager.loadTextureById('final-section-text', this.onTextureLoaded)
  }

  onTextureLoaded = (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
    const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
    const textMesh = new THREE.Mesh(geometry, material)
    textMesh.matrixAutoUpdate = false
    textMesh.scale.set(0.125, 0.125, 0.125)
    textMesh.updateMatrix()
    super.add(textMesh)
  }
}
