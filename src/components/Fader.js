export default class Fader {
  defaultOpacity = 1
  closeDistance = 0
  farDistance = 0
  referenceObject3D
  camera

  constructor (object) {
    this.referenceObject3D = object
    this.camera = window.ThreeCameraDummy
    this.closeDistance = 500
    this.farDistance = 2000
    this.updateFade()
  }
  updateFade = () => {
    requestAnimationFrame(this.updateFade)
    let distance = this.camera.position.z - this.referenceObject3D.position.z - 50
    this.referenceObject3D.visible = distance > 0 && distance < this.farDistance + this.closeDistance
    let closeOpacity = distance / this.closeDistance
    let farOpacity = 1 - (distance / (this.farDistance + this.closeDistance))
    if (this.referenceObject3D.visible) {
      this.referenceObject3D.material.opacity = Math.min(this.defaultOpacity, closeOpacity, farOpacity) // Math.min(this.defaultOpacity, 1 / (-distance + this.farDistance))
    } else {
      this.referenceObject3D.material.opacity = 0
    }
  }
}
