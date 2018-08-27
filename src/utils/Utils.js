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
}

export default Utils
