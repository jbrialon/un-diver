<template>
  <div id="app" :class="{vr: vrModeActivated, portrait: portraitOrientation}">
      <div id="stage" ref="stage"></div>
      <div id="logo">
        <a href="/">
          <!--<img src="./assets/logo.png" alt="Ulysse Nardin">-->
        </a>
      </div>
      <SectionsAnchors :items="samples"></SectionsAnchors>
      <Menu></Menu>
      <div id="rotate-device-message">
        Please rotate your device to landscape
      </div>
  </div>
</template>

<script>
import * as CONST from './Constants'
import GuiManager from './utils/GuiManager'
import AnimationLoopManager from './utils/AnimationLoopManager'
import {TweenLite} from 'gsap/TweenMax'
// eslint-disable-next-line
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import * as THREE from 'three'
import { mapGetters } from 'vuex'
import Menu from './components/vue/Menu.vue'
import SectionsAnchors from './components/vue/SectionsAnchors.vue'
import PostProcessingManager from './components/PostProcessingManager.js'
import Environment from './components/Environment.js'
import BackgroundColorManager from './components/BackgroundColorManager.js'
import VrRenderer from './components/VrRenderer.js'
import TitleSection from './components/sections/TitleSection.js'
import WatchSection from './components/sections/WatchSection.js'

export default {
  components: {
    Menu,
    SectionsAnchors
  },
  data () {
    return {
      scrollingElement: null,
      sceneIsScrolling: false,
      pageHeight: 0,
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      scene: null,
      cameraDummy: new THREE.Group(),
      camera: null,
      renderer: null,
      cameraRotationQuaternion: null,
      pageHeightMultiplyer: 5,
      deviceOrientation: null,
      screenOrientation: window.orientation || 0,
      mousePosition: new THREE.Vector2(),
      deviceOrientationInitialQuat: new THREE.Quaternion(),
      startZPos: 0,
      endZPos: 0,
      postProcessingManager: null,
      scrollTween: null,
      samples: [
        {
          id: 0,
          title: 'Diver',
          text: 'DIVER',
          sectionWeight: 0
        },
        {
          id: 1,
          title: 'Discover the collection',
          text: 'DISCOVER THE COLLECTION',
          sectionWeight: 0
        },
        {
          id: 2,
          title: 'Deep dive',
          text: 'DEEP DIVE',
          sectionWeight: 0
        },
        {
          id: 3,
          type: 'watch',
          title: 'Chronograph',
          texturePath: require('./assets/watches/3203.png'),
          infoLink: 'toto.com',
          buyLink: 'toto.com',
          price: '12,000 CHF',
          sectionWeight: 4,
          subTexts: [
            'Blue Dial',
            'Diameter 44mm',
            'UN-118 Caliber',
            'Glowing technology',
            'Waterproof up to 300m',
            'Blue Shark stamped on the Case-Back',
            '5\'800 CHF'
          ]
        },
        {
          id: 4,
          title: 'Stain case',
          text: 'STAIN CASE',
          sectionWeight: 0
        },
        {
          id: 5,
          title: 'Phosphorescent needles & numbers',
          text: 'PHOSPHORESCENT NEEDLES & NUMBERS',
          sectionWeight: 0
        }
      ]
    }
  },
  computed: {
    landscapeOrientation () {
      return this.screenOrientation === 90
    },
    portraitOrientation () {
      return this.screenOrientation === 0
    },
    ...mapGetters([
      'vrModeActivated',
      'goToSectionId'
    ])
  },
  mounted () {
    this.scrollingElement = (document.scrollingElement || document.documentElement)
    this.stageDOMElement = this.$refs.stage
    this.initScene()
    this.buildSections()
    this.initEnvironment()
    this.initPostProcessing()
    this.handleEvents()
    this.onResize()
    AnimationLoopManager.addFirstCallback(this.updateCamera)
    AnimationLoopManager.addLastCallback(this.render3D)
    this.renderer.setAnimationLoop(AnimationLoopManager.renderLoop)

    GuiManager.add(this, 'resetOrientation').name('Reset Orientation')
  },
  methods: {
    initScene () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.cameraRotationQuaternion = new THREE.Quaternion()
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.stageSize.width / this.stageSize.height,
        1,
        2e5
      )
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.renderer.autoClear = false
      this.renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      )
      this.vrRenderer = new VrRenderer(this.renderer)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setEyeSeparation(1.3)
      this.stageDOMElement.appendChild(this.renderer.domElement)

      this.cameraDummy.add(this.camera)
      this.scene.add(this.cameraDummy)
      this.$store.commit('setCameraDummy', this.cameraDummy)
      this.$store.commit('setStageSize', this.stageSize)
      window.AppCameraDummy = this.cameraDummy
      window.AppStageSize = this.stageSize
      window.AppRenderer = this.renderer
      window.AppScene = this.scene
    },
    initEnvironment () {
      let bgManager = new BackgroundColorManager(this.renderer, this.scene)
      bgManager.init()

      let envManager = new Environment(this.scene, this.endZPos)
      envManager.init()
    },
    initPostProcessing () {
      this.postProcessingManager = new PostProcessingManager(this.renderer, this.scene, this.camera, this.stageSize)
    },
    buildSections () {
      let currentZPos = 0
      let sectionsSlotsCount = this.samples.length
      this.samples.forEach(item => {
        sectionsSlotsCount += item.sectionWeight
      })
      let sectionSlotDepth = CONST.SceneDepth / sectionsSlotsCount
      for (let index = 0; index < this.samples.length; index++) {
        let item = this.samples[index]
        let section
        item.sectionDepth = sectionSlotDepth * item.sectionWeight
        switch (item.type) {
          case 'watch':
            section = new WatchSection(item)
            break
          default:
            section = new TitleSection(item)
            break
        }
        section.addEventListener('setCurrentSectionId', this.onCurrentSectionIdChange)
        section.position.z = -currentZPos
        item.zpos = -section.position.z
        currentZPos += item.sectionDepth + sectionSlotDepth
        this.scene.add(section)
      }
      this.startZPos = this.samples[0].zpos
      this.endZPos = this.samples[this.samples.length - 1].zpos

      this.setPageHeight()
    },
    onCurrentSectionIdChange (event) {
      if (!this.sceneIsScrolling) this.$store.commit('setCurrentSectionId', event.message)
    },
    setPageHeight () {
      this.pageHeight = (this.endZPos - this.startZPos) / this.pageHeightMultiplyer + this.stageSize.height
      document.body.style.height = this.pageHeight + 'px'
    },
    handleEvents () {
      window.addEventListener('resize', this.onResize, false)
      window.addEventListener('mousemove', this.onMouseMove, false)
      window.addEventListener('mouseout', this.onMouseOut, false)
      window.addEventListener('orientationchange', this.onScreenOrientationChange, false)
      window.addEventListener('deviceorientation', this.onDeviceOrientationInit, false)
      window.addEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
    },
    removeListeners () {
      window.removeEventListener('resize', this.onResize, false)
      window.removeEventListener('mousemove', this.onMouseMove, false)
      window.removeEventListener('mouseout', this.onMouseOut, false)
      window.removeEventListener('orientationchange', this.onScreenOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
      window.removeEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
    },
    restrictFOV (vec2) {
      let maxWidth = this.stageSize.width >> 1
      let maxHeight = this.stageSize.height >> 1
      vec2.x = (vec2.x - maxWidth) / maxWidth
      vec2.y = (vec2.y - maxHeight) / maxHeight
    },
    onMouseOut (e) {
      this.resetOrientation()
    },
    onMouseMove (e) {
      // TODO : handle this for mobile devices
      if (e.target.nodeName === 'CANVAS') {
        this.mousePosition.x = e.clientX
        this.mousePosition.y = e.clientY
        this.restrictFOV(this.mousePosition)
      }
    },
    onDeviceOrientationInit (e) {
      this.deviceOrientationToQuaternion(this.deviceOrientationInitialQuat, e)
      this.deviceOrientationInitialQuat = this.deviceOrientationInitialQuat.clone().conjugate()
      window.addEventListener('deviceorientation', this.onDeviceOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
    },
    onDeviceOrientationChange (e) {
      this.deviceOrientation = e
    },
    onScreenOrientationChange (e) {
      this.screenOrientation = window.orientation || 0
    },
    onCompassNeedsCalibration (e) {
      e.preventDefault()
    },
    deviceOrientationToQuaternion (quaternion, deviceOrientation) {
      let zee = new THREE.Vector3(0, 0, 1)
      let q0 = new THREE.Quaternion()
      let q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)) // - PI/2 around the x-axis

      let alpha = deviceOrientation.alpha ? THREE.Math.degToRad(deviceOrientation.alpha) + 0 : 0 // Z
      let beta = deviceOrientation.beta ? THREE.Math.degToRad(deviceOrientation.beta) : 0 // X'
      let gamma = deviceOrientation.gamma ? THREE.Math.degToRad(deviceOrientation.gamma) : 0 // Y''
      let orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0 // O
      let euler = new THREE.Euler()
      euler.set(beta, alpha, -gamma, 'YXZ') // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler) // orient the device
      quaternion.multiply(q1) // camera looks out the back of the device, not the top
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)) // adjust for screen orientation
    },
    resetOrientation () {
      this.mousePosition.x = this.stageSize.width * 0.5
      this.mousePosition.y = this.stageSize.height * 0.5
      this.restrictFOV(this.mousePosition)
    },
    onResize () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.camera.aspect = this.stageSize.width / this.stageSize.height
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.camera.updateProjectionMatrix()
      this.postProcessingManager.resize()
      this.setPageHeight()
    },
    zPosToScrollTop (zPos) {
      return (zPos / this.endZPos) * (this.pageHeight - this.stageSize.height)
    },
    updateCamera () {
      this.cameraDummy.position.z += (((-this.scrollingElement.scrollTop * this.pageHeightMultiplyer) + CONST.CameraDistanceToSection) - this.cameraDummy.position.z) * 0.1
      this.updateCameraRotation()
      window.AppScrollPercentage = (-this.cameraDummy.position.z / this.endZPos)
      if (this.vrModeActivated) {
        this.camera.quaternion.copy(this.cameraRotationQuaternion)
      } else {
        this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1)
      }
    },
    updateCameraRotation () {
      if (this.deviceOrientation) {
        this.deviceOrientationToQuaternion(this.cameraRotationQuaternion, this.deviceOrientation)
        this.cameraRotationQuaternion.premultiply(this.deviceOrientationInitialQuat)
      } else {
        this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-this.mousePosition.y, -this.mousePosition.x, 0))
      }
    },
    render3D () {
      this.renderer.clear()
      if (this.vrModeActivated) {
        this.vrRenderer.render(this.scene, this.camera)
      } else {
        this.renderer.render(this.scene, this.camera)
        this.postProcessingManager.render()
      }
    },
    clearThree (obj) {
      if (obj !== null) {
        for (var i = 0; i < obj.children.length; i++) {
          this.clearThree(obj.children[i])
        }
        if (obj.geometry) {
          obj.geometry.dispose()
          obj.geometry = undefined
        }
        if (obj.material) {
          if (obj.material.map) {
            obj.material.map.dispose()
            obj.material.map = undefined
          }
          obj.material.dispose()
          obj.material = undefined
        }
      }
      obj = undefined
    },
    disposeScene () {
      this.removeListeners()
      AnimationLoopManager.cleartLoop()
      this.renderer.setAnimationLoop(() => {})
      this.clearThree(this.scene)
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.context = undefined
      this.renderer.domElement = undefined
    }
  },
  watch: {
    'vrModeActivated' (activated) {
      this.onResize()
      this.postProcessingManager.toggleVisibility()
      document.body.className = activated ? 'vr' : ''
    },
    'goToSectionId' (id) {
      let scrollVal = Math.floor(this.zPosToScrollTop((this.samples[id].zpos - CONST.CameraDistanceToSection)))
      this.sceneIsScrolling = true
      this.$store.commit('setCurrentSectionId', id)
      TweenLite.to(this.scrollingElement, 1, {
        scrollTo: scrollVal,
        onComplete: () => {
          this.sceneIsScrolling = false
        }
      })
    }
  },
  beforeDestroy () {
    this.disposeScene()
  }
}
</script>

<style lang="scss">
  @import './scss/main.scss';

  body {
    min-height: 200vh;
    background: black;

    &.vr {
      .stats, .gui {
        display: none;
      }
    }
  }

  #app {
    height: 100vh;

    &.vr {
      #logo, #menu-about, #menu-help, #sections {
        display: none;
      }

      &.portrait {
        #rotate-device-message {
          display: block;
        }
      }

      #menu-vr {
        opacity: 1;
      }
    }

    #stage {
      height: 100vh;
      overflow: hidden;
      canvas {
        z-index: 0;
        position: fixed;
        top: 0;
        left: 0;
      }
    }

    #logo {
      position: fixed;
      top: 3vh;
      left: 50%;
      transform: translateX(-50%);
      width: 35vw;

      img {
        width: 100%;
      }
    }

    #rotate-device-message {
      display: none;
      position: fixed;
      padding: 2em;
      background: rgba(0,0,0,0.7);
      color: $white;
      top: 50%;
      left: 50%;
      text-align: center;
      transform :translate3d(-50%, -50%, 0);
    }
  }
</style>
