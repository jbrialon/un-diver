/*
* Section with the main Watch 3D model
* and all subtexts
*/
import store from '@/store'
import * as THREE from 'three'
import Section from '../Section.js'
import CanvasText from '../../../utils/CanvasText'
import WatchModel from '@/components/three/WatchModel.js'
import Fader from '../behaviors/Fader.js'
import StickToCamera from '../behaviors/StickToCamera.js'

export default class WatchSection extends Section {
    stepsDistance
    subTextsStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    watchGlowMesh
    watch3DModelSize = new THREE.Vector3()
    watchRotation = new THREE.Vector3()
    watchRotationTween
    infoButton
    buyButton

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
      const titleMesh = CanvasText.getTextMesh(this.sectionData.title, {
        fontSize: 80,
        font: '80px Arial, sans-serif',
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'rgba(255,255,255,1)',
        allowNewLine: true,
        lineHeight: 1
      })
      titleMesh.scale.set(0.5, 0.5, 0.5)
      super.add(titleMesh)

      Object.assign(
        titleMesh,
        new Fader(titleMesh)
      )
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
        let textMesh = CanvasText.getTextMesh(textObject.text, {
          fontSize: 50,
          font: '50px Arial, sans-serif',
          textAlign: 'left',
          verticalAlign: 'middle',
          color: 'rgba(255,255,255,1)',
          allowNewLine: true,
          lineHeight: 1
        })
        textMesh.matrixAutoUpdate = false
        textMesh.textId = textObject.id
        textMesh.leftText = leftText
        const boxSize = new THREE.Vector3()
        textMesh.geometry.computeBoundingBox()
        textMesh.geometry.boundingBox.getSize(boxSize)
        let translate = boxSize.x * 0.5
        if (!leftText) translate *= -1
        textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
        textMesh.position.z = subTextZpos
        textMesh.position.x = leftText ? 85 : -85
        textMesh.scale.set(0.5, 0.5, 0.5)
        textMesh.updateMatrix()
        textMesh.updateMatrixWorld()
        super.add(textMesh)
        textIndex++
        Object.assign(
          textMesh,
          new StickToCamera(textMesh, this.subTextsStickToCameraDistance, this.onSubtextSticked)
        )
        if (textIndex === 0) {
          Object.assign(
            textMesh,
            new Fader(textMesh, 750)
          )
        }
        subTextZpos -= this.stepsDistance
      })
    }

    setEnvironmentMap (texture) {
      this.watch3DModel.setEnvironmentMap(texture)
    }
}
