import * as THREE from 'three'
import Fader from './Fader.js'

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
        this.createCanvasText(this.text)
      )
      this.texture.needsUpdate = true
      this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, visible: true })
      this.geometry = new THREE.PlaneGeometry(THREE.Math.ceilPowerOfTwo(window.ThreeStageSize.width), THREE.Math.ceilPowerOfTwo(window.ThreeStageSize.height))
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      super.add(this.mesh)
      return Object.assign(
        this,
        new Fader(this)
      )
    }

    createCanvasText (text) {
      let canvas = document.createElement('canvas')
      // document.body.appendChild(canvas)
      canvas.width = THREE.Math.ceilPowerOfTwo(
        window.ThreeStageSize.width
      )
      canvas.height = THREE.Math.ceilPowerOfTwo(
        window.ThreeStageSize.height
      )
      let ctx = canvas.getContext('2d')
      ctx.font = '35pt Arial'
      ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)
      return canvas
    }
}
