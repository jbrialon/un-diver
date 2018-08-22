import * as THREE from 'three'

export default class Section extends THREE.Object3D {
  sectionData
  sectionIdSent = false

  constructor (sectionData) {
    super()
    this.sectionData = sectionData
    this.render()
    Object.assign(this, THREE.EventDispatcher)
  }

  render = () => {
    requestAnimationFrame(this.render)
    let distance = window.AppCameraDummy.position.z - this.position.z
    let isClose = distance > 0 && distance < 2000
    if (!this.sectionIdSent && isClose) {
      this.dispatchEvent({type: 'setCurrentSectionId', message: this.sectionData.id})
      this.sectionIdSent = true
    } else if (this.sectionIdSent && !isClose) {
      this.sectionIdSent = false
    }
  }
}
