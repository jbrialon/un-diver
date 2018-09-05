/*
* Section with the main Watch 3D model
* and all features
*/
import store from '@/store'
import * as THREE from 'three'
import Section from '@/components/three/Section.js'
import Fader from '@/components/three/behaviors/Fader.js'
import WatchModel from '@/components/three/models/WatchModel.js'
import StickToCamera from '@/components/three/behaviors/StickToCamera.js'
import HtmlTextureManager from '@/utils/HtmlTextureManager.js'

export default class WatchSection extends Section {
    featuresStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    watchGlowMesh
    watch3DModelSize = new THREE.Vector3()
    watchRotation = new THREE.Vector3()
    watchRotationTween
    currentZPosition = 0

    constructor (sectionData) {
      super(sectionData)

      this.addIntroTexts()
      this.addWatchModel()
      this.addFeatures()
      this.addDetails()

      return Object.assign(
        this,
        new Fader(this)
      )
    }

    /*
    * Add the main title for the watch section
    */
    addIntroTexts () {
      let introIndex = 0
      this.sectionData.intro.items.forEach(introText => {
        const textZPos = this.currentZPosition
        HtmlTextureManager.loadTextureById('watch-section-intro-' + introIndex, texture => {
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
          const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
          const introMesh = new THREE.Mesh(geometry, material)
          introMesh.matrixAutoUpdate = false
          introMesh.position.z = textZPos
          introMesh.scale.set(0.125, 0.125, 0.125)
          introMesh.updateMatrix()
          super.add(introMesh)
          Object.assign(
            introMesh,
            new Fader(introMesh, 200)
          )
        })
        this.currentZPosition -= introText.depth
        introIndex++
      })
    }

    /*
    * Add the watch 3D model
     */
    addWatchModel () {
      this.watch3DModel = new WatchModel()
      this.watch3DModel.position.z = this.currentZPosition
      this.add(this.watch3DModel)
      Object.assign(
        this.watch3DModel,
        new StickToCamera(this.watch3DModel, this.depth + this.watch3DModel.position.z)
      )
      this.currentZPosition -= this.sectionData.watchModel.depth
    }

    /*
    * When a features is getting sticked / unsticked to camera
    */
    onFeatureSticked = (feature, unsticked) => {
      this.watch3DModel.orientWatch(feature.watchOrientation, unsticked)

      if (feature.textId === 'glowing') {
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
    * Adds all the features
    * Populated all along the z axis
    */
    addFeatures () {
      let featureIndex = 0
      this.sectionData.features.items.forEach(featureObject => {
        const watchOrientation = (featureIndex % 2 !== 0) ? 'left' : 'right'
        const textZPos = this.currentZPosition - (featureObject.depth * 0.5)
        HtmlTextureManager.loadTextureById('watch-section-feature-' + featureObject.id, texture => {
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
          const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
          const textMesh = new THREE.Mesh(geometry, material)
          textMesh.matrixAutoUpdate = false
          textMesh.textId = featureObject.id
          textMesh.watchOrientation = watchOrientation
          let translate = texture.image.width * 0.5
          if (watchOrientation === 'right') translate *= -1
          textMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
          textMesh.position.z = textZPos
          textMesh.position.x = (watchOrientation === 'left') ? 85 : -85
          textMesh.scale.set(0.5, 0.5, 0.5)
          textMesh.updateMatrix()
          textMesh.updateMatrixWorld()
          super.add(textMesh)
          Object.assign(
            textMesh,
            new Fader(textMesh, 750),
            new StickToCamera(textMesh, (featureObject.depth * 0.375), this.onFeatureSticked)
          )
        })
        this.currentZPosition -= featureObject.depth
        featureIndex++
      })
    }

    addDetails () {
      HtmlTextureManager.loadTextureById('watch-section-details', texture => {
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
        const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
        const detailsMesh = new THREE.Mesh(geometry, material)
        detailsMesh.matrixAutoUpdate = false
        detailsMesh.textId = 'details'
        detailsMesh.watchOrientation = 'center'
        let translate = texture.image.width * 0.5
        detailsMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
        detailsMesh.position.z = this.currentZPosition - (this.sectionData.details.depth * 0.5)
        detailsMesh.position.x = 50
        detailsMesh.scale.set(0.5, 0.5, 0.5)
        detailsMesh.updateMatrix()
        detailsMesh.updateMatrixWorld()
        super.add(detailsMesh)
        Object.assign(
          detailsMesh,
          new Fader(detailsMesh, 750),
          new StickToCamera(detailsMesh, this.sectionData.details.depth * 0.5, this.onFeatureSticked)
        )
      })
    }

    setEnvironmentMap (texture) {
      this.watch3DModel.setEnvironmentMap(texture)
    }
}
