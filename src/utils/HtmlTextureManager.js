import * as THREE from 'three'

class HtmlTextureManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static loadTextureById (id, onLoad) {
    let textureItem = HtmlTextureManager.getTextureItem(id)
    textureItem.onLoad = onLoad
    HtmlTextureManager.handleOnLoad(textureItem)
    return textureItem.texture
  }

  static setCanvasPromise (id, promise) {
    promise.then(canvas => {
      let textureItem = HtmlTextureManager.getTextureItem(id)
      textureItem.texture.image = canvas
      textureItem.texture.format = THREE.RGBAFormat
      textureItem.texture.needsUpdate = true
      HtmlTextureManager.handleOnLoad(textureItem)
    })
  }

  static handleOnLoad (textureItem) {
    if (textureItem.texture.image && textureItem.onLoad) {
      textureItem.onLoad(textureItem.texture)
      textureItem.onLoad = null
    }
  }

  static getTextureItem (id) {
    if (!HtmlTextureManager.textures[id]) {
      const texture = new THREE.Texture()
      texture.minFilter = THREE.LinearFilter
      HtmlTextureManager.textures[id] = {texture: texture, onLoad: null}
    }
    return HtmlTextureManager.textures[id]
  }
}

HtmlTextureManager.textures = []

export default HtmlTextureManager
