/*
* Section with the main Watch 3D model
* and all features
*/
import store from '@/store'
import * as THREE from 'three'
import InterpolatingPolynomial from 'interpolating-polynomial'
import Section from '@/components/three/Section.js'
import Fader from '@/components/three/behaviors/Fader.js'
import WatchModel from '@/components/three/models/WatchModel.js'
import StickToCamera from '@/components/three/behaviors/StickToCamera.js'
import Button from '@/components/three/Button'
import * as CONST from '@/Constants'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import { forEach } from 'lodash'
import LoadingManager from '@/utils/LoadingManager'

export default class WatchSection extends Section {
    showDebugLines
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

    watchOrientationStartPoint = 0
    watchOrientationEndPoint = 0
    watchRotationSteps = []
    watchRotationInterpolation

    textureLoader = new THREE.TextureLoader(LoadingManager.instance)

    constructor (sectionData) {
      super(sectionData)

      this.addIntroTexts()
      this.addWatchModel()
      this.addFeatures()
      this.addDetails()

      this.watchOrientationStartPoint = this.watchRotationSteps[0][0]
      this.watchOrientationEndPoint = this.watchRotationSteps[this.watchRotationSteps.length - 1][0]
      this.watchRotationInterpolation = InterpolatingPolynomial(this.watchRotationSteps)

      var geometry = new THREE.Geometry()
      forEach(this.watchRotationSteps, item => {
        geometry.vertices.push(new THREE.Vector3(item[1] * 100, 0, item[0]))
      })
      this.addDebugLine(geometry)
      var geometryStraight = new THREE.Geometry()
      geometryStraight.vertices = [new THREE.Vector3(0, 0, this.watchOrientationStartPoint), new THREE.Vector3(0, 0, this.watchOrientationEndPoint)]
      this.addDebugLine(geometryStraight)

      AnimationLoopManager.addCallback(this.checkGlowing)
    }

    addDebugLine (geometry) {
      if (this.showDebugLines) {
        var material = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff })
        var line = new THREE.Line(geometry, material)
        line.position.y -= 100
        line.position.z = -this.position.z
        this.add(line)
      }
    }

    /*
    * Add the main title for the watch section
    */
    addIntroTexts () {
      this.introTextsZPosition = this.currentZPosition
      this.sectionData.intro.items.forEach(introText => {
        const textZPos = this.currentZPosition
        this.textureLoader.load(introText.texture, texture => {
          texture.minFilter = THREE.LinearFilter
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
      })
    }

    /*
    * Add the watch 3D model
     */
    addWatchModel () {
      this.watchZPosition = this.currentZPosition
      this.watch3DModel = new WatchModel()
      this.watch3DModel.position.z = this.currentZPosition
      this.watchRotationSteps.push([this.currentZPosition - this.sectionData.watchModel.depth, 0])
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

        this.textureLoader.load(featureObject.texture, texture => {
          texture.minFilter = THREE.LinearFilter
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
          textMesh.position.x = CONST.MarginBetweenWatchAndText * store.state.viewportSizeAtCameraFocus.width
          textMesh.position.x *= (watchOrientation === 'left') ? 1 : -1
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
            moreBtn.position.y = -texture.image.height
            textMesh.add(moreBtn)
          } else if (featureObject.id === 'glowing') {
            this.glowStartPosition = textContainerPos
            this.glowEndPosition = textContainerPos - featureObject.depth
          }
          this.featuresPositions.push({ distance: 0, index: textIndex, depth: featureObject.depth, position: this.position.z - textZPos })
          this.featuresRotations.push({ position: this.position.z - textZPos, rotation: (watchOrientation === 'left') ? Math.PI * 0.25 : -Math.PI * 0.25 })
        })
        this.watchRotationSteps.push([textZPos, (watchOrientation === 'left') ? -1 : 1])
        this.currentZPosition -= featureObject.depth
        featureIndex++
      })
    }

    addDetails () {
      this.detailsZPosition = this.currentZPosition - (this.sectionData.details.depth * 0.5)
      this.watchRotationSteps.push([this.currentZPosition, -1])
      this.watchRotationSteps.push([this.currentZPosition - this.sectionData.details.depth - CONST.CameraDistanceToSection, -1])

      this.textureLoader.load(this.sectionData.details.texture, texture => {
        texture.minFilter = THREE.LinearFilter
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
        otherModelsBtn.setAutoDisplayMode(1450)
        otherModelsBtn.addEventListener('click', event => {
          event.preventDefault()
          event.stopPropagation()
          store.commit('goToSectionId', { id: store.state.currentSectionId + 1, time: Date.now() })
        })
        detailsMesh.add(otherModelsBtn)
        detailsMesh.button = otherModelsBtn
      })
    }

    setEnvironmentMap (texture) {
      this.watch3DModel.setEnvironmentMap(texture)
    }

    checkGlowing = () => {
      let cameraPosition = window.AppCameraDummy.position.z + this.position.z
      let interpolationFactor = 0
      if (cameraPosition < this.watchOrientationStartPoint && cameraPosition > this.watchOrientationEndPoint) {
        interpolationFactor = this.watchRotationInterpolation(cameraPosition)
        interpolationFactor = THREE.Math.smootherstep(interpolationFactor, -1, 1) * 2 - 1
      }
      this.watch3DModel.orientWatch(interpolationFactor)
      if (cameraPosition < this.glowStartPosition && cameraPosition > this.glowEndPosition) {
        this.nightIntensity = 1 - Math.abs((cameraPosition - this.glowStartPosition) / (this.glowEndPosition - this.glowStartPosition) * 2 - 1)
      } else {
        this.nightIntensity = 0
      }
      window.AppNightIntensity = this.nightIntensity
      this.watch3DModel.setNightIntensity(this.nightIntensity)
    }
}
