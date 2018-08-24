import {TweenMax, Power2} from 'gsap'
import * as THREE from 'three'
import Section from '../Section.js'
import FBXLoader from 'three-fbxloader-offical'
import CanvasText from '../../utils/CanvasText'
import Button from '../Button'
import Fader from '../Fader'
import StickToCamera from '../StickToCamera'

export default class WatchSection extends Section {
    stepsDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    watch3DModelSize = new THREE.Vector3()
    infoButton
    buyButton

    constructor (sectionData) {
      super(sectionData)
      this.stepsDistance = this.sectionDepth / this.sectionData.subTexts.length

      this.addTitle()

      let loader = new FBXLoader()
      loader.load(this.watch3DModelPath, (object) => this.onWatchModelLoaded(object))

      this.addSubTexts()

      this.infoButton = new Button('More information', 'toto.com')
      this.infoButton.position.x = window.AppStageSize.width * 0.15
      this.infoButton.position.y = -window.AppStageSize.height * 0.1
      // super.add(this.infoButton)

      this.buyButton = new Button('Buy', 'toto.com')
      this.buyButton.position.x = window.AppStageSize.width * 0.15
      this.buyButton.position.y = -window.AppStageSize.height * 0.2
      // super.add(this.buyButton)

      return Object.assign(
        this,
        new Fader(this)
      )
    }

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
      let modelScale = 2 // - (1000 / window.AppStageSize.width)
      this.watch3DModel.scale.set(modelScale, modelScale, modelScale)
      this.watch3DModel.position.z = -this.stepsDistance
      this.watch3DModel.rotation.y = -Math.PI * 0.3
      super.add(this.watch3DModel)

      TweenMax.to(this.watch3DModel.rotation, 3, {y: Math.PI * 0.3, yoyo: true, yoyoEase: true, ease: Power2.easeInOut, repeat: -1})
      Object.assign(
        this.watch3DModel,
        new StickToCamera(this.watch3DModel, this.sectionDepth + this.watch3DModel.position.z, true)
      )
    }

    addSubTexts () {
      let textIndex = 0
      let subTextZpos = -this.stepsDistance
      this.sectionData.subTexts.forEach(text => {
        const leftText = textIndex % 2 === 0
        let textMesh = CanvasText.getTextMesh(text, {
          fontSize: 50,
          font: '50px Arial, sans-serif',
          textAlign: 'left',
          verticalAlign: 'middle',
          color: 'rgba(255,255,255,1)',
          allowNewLine: true,
          lineHeight: 1
        })
        const boxSize = new THREE.Vector3()
        textMesh.geometry.computeBoundingBox()
        textMesh.geometry.boundingBox.getSize(boxSize)
        let translate = boxSize.x * 0.5
        if (!leftText) translate *= -1
        textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
        textMesh.position.z = subTextZpos
        textMesh.position.x = leftText ? 75 : -75
        textMesh.scale.set(0.5, 0.5, 0.5)
        super.add(textMesh)
        textIndex++
        Object.assign(
          textMesh,
          new StickToCamera(textMesh, this.stepsDistance * 0.5)
        )
        Object.assign(
          textMesh,
          new Fader(textMesh, 750)
        )
        subTextZpos -= this.stepsDistance
      })
    }
}
