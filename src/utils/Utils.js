import * as THREE from 'three'
import _ from 'lodash'

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

  static isMobile () {
    return window.matchMedia('(max-width: 768px)').matches
  }

  static removeObjectShininess (object) {
    object.traverse((child) => {
      if (child.material && child.material.type === 'MeshPhongMaterial') {
        child.material.shininess = 0
      }
    })
  }

  static clamp (number, min, max) {
    return Math.max(min, Math.min(number, max))
  }

  /*
  * Loops on every passed items and calculates
  * item depth depending on item weight property
  */
  static computeChildDepths (item, parentDepth) {
    let slotDepth = parentDepth / _.sum(_.map(item, 'weight'))
    _.forOwn(item, (child, name) => {
      if (child.weight !== undefined) {
        child.depth = slotDepth * child.weight
      }
      if (!_.isString(child)) Utils.computeChildDepths(child, child.depth || parentDepth)
    })
  }
}

export default Utils
