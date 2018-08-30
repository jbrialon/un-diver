/*
* Section with the main Watch 3D model
* and all subtexts
*/
import store from '@/store'
import {TweenMax, Power4, Sine} from 'gsap'
import * as THREE from 'three'
import Section from '@/components/three/Section.js'
import FBXLoader from 'three-fbxloader-offical'
import Fader from '@/components/three/behaviors/Fader.js'
import StickToCamera from '@/components/three/behaviors/StickToCamera.js'
import HtmlTextureManager from '@/utils/HtmlTextureManager.js'

export default class WatchSection extends Section {
    stepsDistance
    subTextsStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModelContainer
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

    onWatchModelLoaded (object) {
      // TODO : handle correctly sizing and positioning
      this.watch3DModel = object
      this.watch3DModel.traverse((child) => {
        if (child.name === 'case') {
          this.watchGlowMesh = child.clone()
          this.watchGlowMesh.material = new THREE.MeshBasicMaterial({color: 0xbbff00})
          this.watchGlowMesh.material.transparent = true
          this.watchGlowMesh.material.opacity = (store.state.nightMode) ? 1 : 0
          child.parent.add(this.watchGlowMesh)
        }
      })
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

      this.watchRotationTween = TweenMax.set(this.watch3DModel.rotation, {y: 0})

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
        this.setNightMode(!unsticked)
      }
    }

    /*
    * Store glow mode in state and turn on phosphorescent components
    */
    setNightMode (activated) {
      store.commit('setNightMode', activated)
      if (this.watchGlowMesh) {
        TweenMax.to(this.watchGlowMesh.material, 0.5, {
          opacity: activated ? 1 : 0,
          ease: Power4.easeInOut
        })
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

    onSubTextTextureLoaded = (texture) => {

    }
}
