/*
* Section with only a Boutique picture inside
*/
import Section from '@/components/three/Section.js'
import * as CONST from '@/Constants'
import * as THREE from 'three'

export default class BoutiqueSection extends Section {
  constructor (sectionData) {
    super(sectionData)
    new THREE.TextureLoader().load(CONST.BoutiqueImage, this.onTextureLoaded)
  }

  onTextureLoaded = (texture) => {
    let geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
    let material = new THREE.MeshBasicMaterial({map: texture, side: THREE.FrontSide})
    let plane = new THREE.Mesh(geometry, material)
    super.add(plane)
  }
}
