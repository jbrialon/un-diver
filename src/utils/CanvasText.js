
import * as THREE from 'three'
import * as TEXTUTIL from 'canvas-text-wrapper'

export default class CanvasText {
  static getTextMesh (text, options) {
    const canvas = document.createElement('canvas')
    const ratio = window.AppStageSize.height / window.AppStageSize.width
    canvas.width = THREE.Math.ceilPowerOfTwo(
      (ratio < 1) ? window.AppStageSize.width * 2 : window.AppStageSize.height * 2
    )
    canvas.height = THREE.Math.ceilPowerOfTwo(
      window.AppStageSize.height * 2
    )
    const ctx = canvas.getContext('2d')
    ctx.font = options.font
    ctx.fillStyle = options.color
    const textLineArray = text.split('\n')
    const lineCounts = textLineArray.length
    const longestLineInText = CanvasText.getLongestLineInText(textLineArray)
    const textSize = ctx.measureText(longestLineInText)
    textSize.height = lineCounts * options.fontSize
    canvas.width = textSize.width * 1.1
    canvas.height = textSize.height * 1.1
    ctx.font = options.font
    ctx.fillStyle = options.color
    TEXTUTIL.CanvasTextWrapper(canvas, text, options)

    return CanvasText.getMesh(canvas)
  }

  static getLongestLineInText (textLineArray) {
    const longestLine = textLineArray.reduce((a, b) => {
      return (b.length > a.length) ? b : a
    })
    return longestLine
  }

  static getMesh (canvas) {
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    texture.minFilter = THREE.LinearFilter
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
    const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }
}
