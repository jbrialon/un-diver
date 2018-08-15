import * as THREE from 'three'
import Button from './Button.js'
import Fader from './Fader.js'

export default class Watch extends THREE.Object3D {
    title = ''
    price = ''
    infoLink = ''
    buyLink = ''
    texture
    material
    geometry
    mesh
    infoButton
    buyButton

    constructor (title, price, infoLink, buyLink, texturePath) {
      super()
      this.title = title
      this.price = price
      this.infoLink = infoLink
      this.buyLink = buyLink

      this.texture = new THREE.TextureLoader().load(texturePath)
      this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, visible: true })
      this.geometry = new THREE.PlaneGeometry(window.AppStageSize.width, window.AppStageSize.width * 0.533333)
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.mesh.position.x = -window.AppStageSize.width * 0.15
      this.mesh.position.z = -5
      super.add(this.mesh)

      this.infoButton = new Button('More information', 'toto.com')
      this.infoButton.position.x = window.AppStageSize.width * 0.15
      this.infoButton.position.y = -window.AppStageSize.height * 0.1
      super.add(this.infoButton)

      this.buyButton = new Button('Buy', 'toto.com')
      this.buyButton.position.x = window.AppStageSize.width * 0.15
      this.buyButton.position.y = -window.AppStageSize.height * 0.2
      super.add(this.buyButton)

      return Object.assign(
        this,
        new Fader(this)
      )
    }
}
