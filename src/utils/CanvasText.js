
import * as THREE from 'three'

export default class CanvasText {
  static getText (text, fontSize, fontFamily, color, align, baseline) {
    let canvas = document.createElement('canvas')
    // document.body.appendChild(canvas)
    canvas.width = THREE.Math.ceilPowerOfTwo(
      window.AppStageSize.width
    )
    canvas.height = THREE.Math.ceilPowerOfTwo(
      window.AppStageSize.height
    )
    let ctx = canvas.getContext('2d')
    ctx.font = fontSize + ' ' + fontFamily
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    return canvas
  }
}
