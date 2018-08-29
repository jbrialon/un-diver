import * as THREE from 'three'

class Utils {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  /*
  * Replace Lambert material in default loaded FBX object
  */
  static fixFBXMaterials (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        const oldMat = child.material
        child.material = new THREE.MeshLambertMaterial({
          color: oldMat.color,
          map: oldMat.map
        })
      }
    })
  }
  static pad (n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }
}

export default Utils
