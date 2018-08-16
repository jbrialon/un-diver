import * as THREE from 'three'
import CanvasText from '../utils/CanvasText.js'
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

      this.addTitle()

      this.infoButton = new Button('More information', 'toto.com')
      this.infoButton.position.x = window.AppStageSize.width * 0.15
      this.infoButton.position.y = -window.AppStageSize.height * 0.1
      // super.add(this.infoButton)

      this.buyButton = new Button('Buy', 'toto.com')
      this.buyButton.position.x = window.AppStageSize.width * 0.15
      this.buyButton.position.y = -window.AppStageSize.height * 0.2
      // super.add(this.buyButton)

      return Object.assign(
        this,
        new Fader(this)
      )
    }

    addTitle () {
      let texture = new THREE.Texture(
        CanvasText.getText(this.title, '35pt', 'Arial', 'rgba(255,255,255,1)', 'left', 'middle')
      )
      texture.needsUpdate = true
      let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
      let geometry = new THREE.PlaneGeometry(THREE.Math.ceilPowerOfTwo(window.AppStageSize.width), THREE.Math.ceilPowerOfTwo(window.AppStageSize.height))
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = 10
      mesh.position.x = window.AppStageSize.width * 0.1
      mesh.rotation.y = THREE.Math.degToRad(-25)
      super.add(mesh)
    }
}
