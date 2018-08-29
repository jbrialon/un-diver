/*
* Section with the main Watch 3D model
* and all subtexts
*/
import store from '@/store'
import {TweenMax, Power4, Sine} from 'gsap'
import * as THREE from 'three'
import Section from '../Section.js'
import FBXLoader from 'three-fbxloader-offical'
import CanvasText from '../../../utils/CanvasText'
import Fader from '../behaviors/Fader.js'
import StickToCamera from '../behaviors/StickToCamera.js'

export default class WatchSection extends Section {
    stepsDistance
    subTextsStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModelContainer
    watch3DModel
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

      let loader = new FBXLoader()
      loader.load(this.watch3DModelPath, (object) => this.onWatchModelLoaded(object))

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

    onWatchModelLoaded (object) {
      // TODO : handle correctly sizing and positioning
      this.watch3DModel = object
      this.watch3DModelContainer = new THREE.Object3D()
      this.watch3DModelContainer.matrixAutoUpdate = false
      this.watch3DModelContainer.add(this.watch3DModel)
      let modelScale = 3
      this.watch3DModel.scale.set(modelScale, modelScale, modelScale)
      this.watch3DModelContainer.position.z = -this.stepsDistance
      this.watch3DModel.updateMatrix()
      this.watch3DModel.updateMatrixWorld()
      super.add(this.watch3DModelContainer)

      TweenMax.fromTo(this.watch3DModel.position, 3, {x: -3}, {
        x: 3,
        yoyo: true,
        yoyoEase: true,
        ease: Sine.easeInOut,
        repeat: -1
      })
      TweenMax.fromTo(this.watch3DModel.position, 5, {x: -3}, {
        y: 3,
        yoyo: true,
        yoyoEase: true,
        ease: Sine.easeInOut,
        repeat: -1
      })

      this.watchRotationTween = TweenMax.to({}, 0.1, {y: 0})

      Object.assign(
        this.watch3DModel,
        new StickToCamera(this.watch3DModelContainer, this.sectionDepth + this.watch3DModelContainer.position.z)
      )
    }

    /*
    * When a subtexts is getting sticked / unsticked to camera
    */
    onSubtextSticked = (subtext, unsticked) => {
      if (this.watch3DModel) {
        const duration = unsticked ? 1.5 : 0.8
        this.watchRotationTween.kill()
        this.watchRotationTween = TweenMax.to(this.watch3DModel.rotation, duration, {
          y: unsticked ? 0 : (subtext.leftText ? Math.PI * 0.25 : -Math.PI * 0.25),
          x: unsticked ? 0 : -Math.PI * 0.1,
          ease: Power4.easeInOut
        })
      }

      if (subtext.textId === 'glowing') {
        store.commit('setNightMode', !unsticked)
      }
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
        textMesh.position.x = leftText ? 75 : -75
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
}
