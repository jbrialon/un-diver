/*
* Section with only a Boutique picture inside
*/
import Section from '@/components/three/Section.js'
import THREE from '@/utils/ThreeWithPlugins'
import HtmlTextureManager from '@/utils/HtmlTextureManager.js'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import Utils from '@/utils/Utils'
import {TweenMax, Power4} from 'gsap'

export default class FinalSection extends Section {
  extraScale = 0.1 // ensure image is in screen event with camera wiggle
  mesh

  ctasDomElement
  ctasDomElement3D
  ctasDistanceToCamera
  ctasVisible = true

  constructor (sectionData) {
    super(sectionData)
    HtmlTextureManager.loadTextureById('final-section-text', this.onTextureLoaded)
  }

  onTextureLoaded = (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
    const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
    const textMesh = new THREE.Mesh(geometry, material)
    textMesh.matrixAutoUpdate = false
    textMesh.scale.set(0.5, 0.5, 0.5)
    textMesh.updateMatrix()
    super.add(textMesh)

    this.ctasDomElement = document.getElementById('final-section-ctas')
    if (this.ctasDomElement) {
      this.ctasDomElement3D = new THREE.CSS3DObject(this.ctasDomElement)
      this.add(this.ctasDomElement3D)
      this.ctasDomElement3D.position.y = -texture.image.height * 0.5
      this.size = this.ctasDomElement.getBoundingClientRect()
      this.setVisibility(false)
      AnimationLoopManager.addCallback(this.checkCTADisplay)
    } else {
      // eslint-disable-next-line
      console.warn('Could not find any element by id : \'final-section-ctas\'')
    }
  }

  checkCTADisplay = () => {
    this.ctasDistanceToCamera = Utils.getDistanceToCamera(this.ctasDomElement3D)
    if (this.ctasDistanceToCamera > 0 && this.ctasDistanceToCamera < 1500) {
      this.setVisibility(true)
    } else {
      this.setVisibility(false)
    }
  }

  setVisibility (visible) {
    if (this.ctasVisible !== visible) {
      this.ctasVisible = visible
      if (this.ctasDomElement) {
        TweenMax.to(this.ctasDomElement, 0.3, {autoAlpha: visible ? 1 : 0, ease: Power4.easeOut})
      }
    }
  }
}
