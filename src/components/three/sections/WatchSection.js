/*
* Section with the main Watch 3D model
* and all subtexts
*/
import store from '@/store'
import * as THREE from 'three'
import Section from '@/components/three/Section.js'
import Fader from '@/components/three/behaviors/Fader.js'
import WatchModel from '@/components/three/WatchModel.js'
import StickToCamera from '@/components/three/behaviors/StickToCamera.js'
import HtmlTextureManager from '@/utils/HtmlTextureManager.js'

export default class WatchSection extends Section {
    stepsDistance
    subTextsStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    watchGlowMesh
    watch3DModelSize = new THREE.Vector3()
    watchRotation = new THREE.Vector3()
    watchRotationTween

    constructor (sectionData) {
      super(sectionData)
      this.stepsDistance = this.sectionDepth / this.sectionData.subTexts.length
      this.subTextsStickToCameraDistance = this.stepsDistance * 0.5
      this.stepsDistance = (this.sectionDepth - this.subTextsStickToCameraDistance) / this.sectionData.subTexts.length // recalculate stepsDistance in order to let last subText to unstick at sectionDepth and not after

      this.addTitle()

      this.watch3DModel = new WatchModel()
      this.watch3DModel.position.z = -this.stepsDistance
      this.add(this.watch3DModel)
      Object.assign(
        this.watch3DModel,
        new StickToCamera(this.watch3DModel, this.sectionDepth + this.watch3DModel.position.z)
      )

      this.addSubTexts()

      return Object.assign(
        this,
        new Fader(this)
      )
    }

    /*
    * Add the main title for the watch section
    */
    addTitle () {
      HtmlTextureManager.loadTextureById('watch-section-title', texture => {
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
        const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
        const titleMesh = new THREE.Mesh(geometry, material)
        titleMesh.matrixAutoUpdate = false
        titleMesh.scale.set(0.125, 0.125, 0.125)
        titleMesh.updateMatrix()
        super.add(titleMesh)
        Object.assign(
          titleMesh,
          new Fader(titleMesh, 200)
        )
      })
    }

    /*
    * When a subtexts is getting sticked / unsticked to camera
    */
    onSubtextSticked = (subtext, unsticked) => {
      this.watch3DModel.setSubtextRotation(subtext.leftText, unsticked)

      if (subtext.textId === 'glowing') {
        this.setNightMode(!unsticked)
      }
    }

    /*
    * Store glow mode in state and turn on phosphorescent components
    */
    setNightMode (activated) {
      store.commit('setNightMode', activated)
      this.watch3DModel.setNightMode(activated)
    }

    /*
    * Adds all the subtexts
    * Populated all along the z axis
    */
    addSubTexts () {
      let textIndex = 0
      let subTextZpos = -this.stepsDistance
      this.sectionData.subTexts.forEach(textObject => {
        const leftText = textIndex % 2 !== 0
        const textZPos = subTextZpos
        HtmlTextureManager.loadTextureById('watch-subtext-' + textObject.id, texture => {
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
          const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
          const textMesh = new THREE.Mesh(geometry, material)
          textMesh.matrixAutoUpdate = false
          textMesh.textId = textObject.id
          textMesh.leftText = leftText
          let translate = texture.image.width * 0.5
          if (!leftText) translate *= -1
          textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
          textMesh.position.z = textZPos
          textMesh.position.x = leftText ? 85 : -85
          textMesh.scale.set(0.5, 0.5, 0.5)
          textMesh.updateMatrix()
          textMesh.updateMatrixWorld()
          super.add(textMesh)
          Object.assign(
            textMesh,
            new Fader(textMesh, 750),
            new StickToCamera(textMesh, this.subTextsStickToCameraDistance, this.onSubtextSticked)
          )
        })
        subTextZpos -= this.stepsDistance
        textIndex++
      })
    }

    setEnvironmentMap (texture) {
      this.watch3DModel.setEnvironmentMap(texture)
    }
}
