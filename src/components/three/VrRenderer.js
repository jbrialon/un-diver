/*
* Hanldes fake VR rendering
* Splits the screen in two and renders to cameras
*/
import * as THREE from 'three'

export default class VrRenderer {
  stereoCamera = new THREE.StereoCamera()
  renderer

  constructor (renderer) {
    this.renderer = renderer
    this.stereoCamera.aspect = 0.5
  }

  setEyeSeparation (eyeSep) {
    this.stereoCamera.eyeSep = eyeSep
  }

  setSize (width, height) {
    this.renderer.setSize(width, height)
  }

  render (scene, camera) {
    scene.updateMatrixWorld()
    if (camera.parent === null) camera.updateMatrixWorld()
    this.stereoCamera.update(camera)
    let size = this.renderer.getSize()
    if (this.renderer.autoClear) this.renderer.clear()
    this.renderer.setScissorTest(true)
    this.renderer.setScissor(0, 0, size.width / 2, size.height)
    this.renderer.setViewport(0, 0, size.width / 2, size.height)
    this.renderer.render(scene, this.stereoCamera.cameraL)
    this.renderer.setScissor(size.width / 2, 0, size.width / 2, size.height)
    this.renderer.setViewport(size.width / 2, 0, size.width / 2, size.height)
    this.renderer.render(scene, this.stereoCamera.cameraR)
    this.renderer.setScissorTest(false)
  }
}
