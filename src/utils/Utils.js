import * as THREE from 'three'
import { forOwn, sum, map, isString } from 'lodash'

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

  /*
  * Loop through children of given Object3D
  * and applys given material to each
  */
  static applyMaterialToGroup (group, material) {
    group.traverse((child) => {
      if (child.isMesh) {
        child.material = material
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

  static hasWebGL () {
    var canvas = document.createElement('canvas')
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (gl && gl instanceof WebGLRenderingContext) {
      return true
    } else {
      return false
    }
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

  static getDistanceToCamera (object3D) {
    let worldPos = new THREE.Vector3()
    object3D.localToWorld(worldPos)
    var dx = window.AppCameraDummy.position.x - worldPos.x
    var dy = window.AppCameraDummy.position.y - worldPos.y
    var dz = window.AppCameraDummy.position.z - worldPos.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /*
  * Loops on every passed items and calculates
  * item depth depending on item weight property
  */
  static computeChildDepths (item, parentDepth) {
    let slotDepth = parentDepth / sum(map(item, 'weight'))
    forOwn(item, (child, name) => {
      if (child.weight !== undefined) {
        child.depth = slotDepth * child.weight
      }
      if (!isString(child)) Utils.computeChildDepths(child, child.depth || parentDepth)
    })
  }
}

export default Utils
