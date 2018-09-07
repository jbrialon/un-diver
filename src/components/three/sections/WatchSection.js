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
import Button from '@/components/three/Button'
// import * as CONST from '@/Constants'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
// import _ from 'lodash'

export default class WatchSection extends Section {
    featuresStickToCameraDistance
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    watchGlowMesh
    watch3DModelSize = new THREE.Vector3()
    watchRotation = new THREE.Vector3()
    watchRotationTween
    currentZPosition = 0

    introTextsZPosition = new THREE.Vector3()
    watchZPosition = new THREE.Vector3()
    featuresZPosition = new THREE.Vector3()
    detailsZPosition = new THREE.Vector3()

    featuresPositions = []
    featuresRotations = []
    featuresDistance = []

    glowStartPosition = 0
    glowEndPosition = 0
    nightIntensity = 0

    constructor (sectionData) {
      super(sectionData)

      this.addIntroTexts()
      this.addWatchModel()
      this.addFeatures()
      this.addDetails()

      AnimationLoopManager.addCallback(this.checkGlowing)
      // AnimationLoopManager.addCallback(this.testRotation)
    }

    /*
    test = () => {
      if (this.watch3DModel.model && this.featuresPositions.length > 0 && this.featuresPositions.length > 0) {
        _.forEach(this.featuresPositions, (item, index) => {
          item.distance = Math.floor(window.AppCameraDummy.position.z + item.position - CONST.CameraDistanceToSection)
        })
        this.featuresPositions = _.sortBy(this.featuresPositions, ['distance'])
        let pc = (this.featuresPositions[0].distance / this.featuresPositions[0].depth * 0.5)
        let rotation = pc * (Math.PI * 0.25)
        this.watch3DModel.model.rotation.y = (this.featuresPositions[0].index % 2 === 0) ? rotation : -rotation
      }
    }
    */

    /*
    * Add the main title for the watch section
    */
    addIntroTexts () {
      let introIndex = 0
      this.introTextsZPosition = this.currentZPosition
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
      this.watchZPosition = this.currentZPosition
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

      if (feature.textId === 'details' && feature.button) {
        feature.button.setVisibility(!unsticked)
      }
    }

    /*
    * Adds all the features
    * Populated all along the z axis
    */
    addFeatures () {
      let featureIndex = 0
      this.featuresZPosition = this.currentZPosition
      this.sectionData.features.items.forEach(featureObject => {
        const watchOrientation = (featureIndex % 2 !== 0) ? 'left' : 'right'
        const textZPos = this.currentZPosition - (featureObject.depth * 0.5)
        const textContainerPos = this.currentZPosition
        const textIndex = featureIndex
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

          if (featureObject.id === 'diameter') {
            let moreBtn = new Button('watch-section-more-button')
            moreBtn.setAutoDisplayMode(900)
            moreBtn.position.x = moreBtn.size.width
            moreBtn.position.y = -texture.image.height - moreBtn.size.height * 0.5
            textMesh.add(moreBtn)
          } else if (featureObject.id === 'glowing') {
            this.glowStartPosition = textContainerPos + this.position.z
            this.glowEndPosition = textContainerPos - featureObject.depth + this.position.z
          }

          this.featuresPositions.push({distance: 0, index: textIndex, depth: featureObject.depth, position: this.position.z - textZPos})
          this.featuresRotations.push({position: this.position.z - textZPos, rotation: (watchOrientation === 'left') ? Math.PI * 0.25 : -Math.PI * 0.25})
        })
        this.currentZPosition -= featureObject.depth
        featureIndex++
      })
    }

    addDetails () {
      this.detailsZPosition = this.currentZPosition - (this.sectionData.details.depth * 0.5)
      HtmlTextureManager.loadTextureById('watch-section-details', texture => {
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
        const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
        const detailsMesh = new THREE.Mesh(geometry, material)
        detailsMesh.matrixAutoUpdate = false
        detailsMesh.textId = 'details'
        detailsMesh.watchOrientation = 'center'
        let translate = texture.image.width * 0.5
        detailsMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(translate, 0, 0))
        detailsMesh.position.z = this.detailsZPosition
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

        let otherModelsBtn = new Button('watch-section-details-button')
        otherModelsBtn.position.x = otherModelsBtn.size.width * 0.5
        otherModelsBtn.position.y = -texture.image.height * 0.6
        otherModelsBtn.addEventListener('click', event => {
          event.preventDefault()
          event.stopPropagation()
          store.commit('goToSectionId', {id: store.state.currentSectionId + 1, time: Date.now()})
        })
        detailsMesh.add(otherModelsBtn)
        detailsMesh.button = otherModelsBtn
      })
    }

    setEnvironmentMap (texture) {
      this.watch3DModel.setEnvironmentMap(texture)
    }

    checkGlowing = () => {
      let cameraPosition = window.AppCameraDummy.position.z
      if (cameraPosition < this.glowStartPosition && cameraPosition > this.glowEndPosition) {
        this.nightIntensity = 1 - Math.abs((cameraPosition - this.glowStartPosition) / (this.glowEndPosition - this.glowStartPosition) * 2 - 1)
      } else {
        this.nightIntensity = 0
      }
      window.AppNightIntensity = this.nightIntensity
      this.watch3DModel.setNightIntensity(this.nightIntensity)
    }
}
