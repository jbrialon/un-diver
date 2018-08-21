
import * as THREE from 'three'

export default class CanvasText {
  static getText (text, fontSize, fontFamily, color, align, baseline) {
    let canvas = document.createElement('canvas')
    let ratio = window.AppStageSize.height / window.AppStageSize.width
    // document.body.appendChild(canvas)
    canvas.width = THREE.Math.ceilPowerOfTwo(
      (ratio < 1) ? window.AppStageSize.width * 2 : window.AppStageSize.height * 2
    )
    canvas.height = THREE.Math.ceilPowerOfTwo(
      window.AppStageSize.height * 2
    )
    let ctx = canvas.getContext('2d')
    ctx.font = fontSize + 'px ' + fontFamily
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.5)
    let textSize = ctx.measureText(text)
    canvas = null

    // TODO : OPTIMIZE THIS !!!
    // reset canvas size to fit created text
    let canvas2 = document.createElement('canvas')
    canvas2.width = textSize.width
    canvas2.height = fontSize
    let ctx2 = canvas2.getContext('2d')
    ctx2.font = fontSize + 'px ' + fontFamily
    ctx2.fillStyle = color
    ctx2.textAlign = align
    ctx2.textBaseline = baseline
    ctx2.fillText(text, canvas2.width * 0.5, canvas2.height * 0.5)
    return canvas2
  }
}
