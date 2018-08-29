<template>
  <div id="app" :class="{vr: vrModeActivated, portrait: portraitOrientation}">
      <div id="stage" ref="stage"></div>
      <c-header></c-header>
      <c-sections :items="samples"></c-sections>
      <c-meter></c-meter>
      <div id="rotate-device-message">
        Please rotate your device to landscape
      </div>
  </div>
</template>

<script>
// Three JS
import * as CONST from '@/Constants'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import PostProcessingManager from '@/components/three/PostProcessingManager.js'
import Environment from '@/components/three/Environment.js'
import VrRenderer from '@/components/three/VrRenderer.js'
import TitleSection from '@/components/three/sections/TitleSection.js'
import WatchSection from '@/components/three/sections/WatchSection.js'
import BoutiqueSection from '@/components/three/sections/BoutiqueSection.js'
import CameraManager from '@/components/three/CameraManager.js'

// vue
import { mapGetters } from 'vuex'
import Meter from '@/components/vue/Meter.vue'
import Header from '@/components/vue/Header.vue'
import SectionsAnchors from '@/components/vue/SectionsAnchors.vue'

// libs
// import {TweenMax, Power4} from 'gsap'
import * as THREE from 'three'

export default {
  name: 'Ulysse-Nardin-App',
  components: {
    'c-header': Header,
    'c-meter': Meter,
    'c-sections': SectionsAnchors
  },
  data () {
    return {
      envManager: null,
      scrollingElement: null,
      sceneIsAutoScrolling: false,
      pageHeight: 0,
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      scene: null,
      cameraManager: null,
      renderer: null,
      firstSectionZPosition: 0,
      lastSectionZPosition: 0,
      postProcessingManager: null,
      screenOrientation: window.orientation || 0,
      scrollTween: null,
      sectionsDepthList: [],
      ThreeClock: new THREE.Clock(),
      samples: [
        {
          id: 0,
          type: 'watch',
          title: 'The New Diver',
          texturePath: require('./assets/watches/3203.png'),
          infoLink: 'toto.com',
          buyLink: 'toto.com',
          price: '12,000 CHF',
          sectionWeight: 4,
          subTexts: [
            {id: 'bluedial', title: 'model', text: 'Blue Dial'},
            {id: 'diameter', title: 'Diameter', text: '44mm'},
            {id: 'caliber', title: 'New', text: 'UN-118'},
            {id: 'glowing', title: 'Feature', text: 'Glowing'},
            {id: 'waterproof', title: 'Feature', text: 'Waterproof\nup to 300m'}
          ]
        },
        {
          id: 1,
          type: 'collection',
          title: 'Other models',
          text: 'Other models',
          sectionWeight: 0
        },
        {
          id: 2,
          type: 'boutique',
          title: 'Boutique',
          text: 'Boutique',
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
      'nightModeActivated',
      'currentSectionId',
      'goToSectionId'
    ])
  },
  mounted () {
    this.stageDOMElement = this.$refs.stage
    this.initScene()
    this.buildSections()
    this.initEnvironment()
    this.initPostProcessing()
    this.handelEvents()
    this.onResize()
    AnimationLoopManager.addCallback(this.checkCurrentSection)
    AnimationLoopManager.addLastCallback(this.render3D)
    this.renderer.setAnimationLoop(AnimationLoopManager.renderLoop)
  },
  methods: {
    handelEvents () {
      window.addEventListener('resize', this.onResize, false)
      window.addEventListener('orientationchange', this.onScreenOrientationChange, false)
    },
    removeListeners () {
      window.removeEventListener('resize', this.onResize, false)
      window.removeEventListener('orientationchange', this.onScreenOrientationChange, false)
    },
    initScene () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.$store.commit('setStageSize', this.stageSize)
      // eslint-disable-next-line
      console.log('setStageSize!!')
      this.scene = new THREE.Scene()
      this.cameraManager = new CameraManager(this.stageSize)
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

      this.scene.add(this.cameraManager)
      window.AppCameraDummy = this.cameraManager
      window.AppStageSize = this.stageSize
      window.AppRenderer = this.renderer
      window.AppScene = this.scene
    },
    initEnvironment () {
      this.envManager = new Environment(this.scene, this.renderer, this.lastSectionZPosition)
      this.envManager.init()
    },
    initPostProcessing () {
      this.postProcessingManager = new PostProcessingManager(this.renderer, this.scene, this.cameraManager.camera, this.stageSize)
    },
    buildSections () {
      let currentZPos = 0
      let sectionsSlotsCount = this.samples.length
      this.samples.forEach(item => {
        sectionsSlotsCount += item.sectionWeight
      })
      let sectionSlotDepth = CONST.SceneDepth / sectionsSlotsCount
      this.samples.forEach(item => {
        item.sectionDepth = sectionSlotDepth * item.sectionWeight
        let section
        switch (item.type) {
          case 'watch':
            section = new WatchSection(item)
            break
          case 'collection':
            section = new TitleSection(item)
            break
          case 'boutique':
            section = new BoutiqueSection(item)
            break
        }
        section.matrix.makeTranslation(0, 0, -currentZPos)
        item.zpos = currentZPos
        currentZPos += item.sectionDepth + sectionSlotDepth
        this.sectionsDepthList.push({id: item.id, start: -item.zpos + sectionSlotDepth, end: -currentZPos})
        this.scene.add(section)
        this.lastSectionZPosition = item.zpos
      })
      this.firstSectionZPosition = this.samples[0].zpos

      this.cameraManager.lastSectionZPosition = this.lastSectionZPosition
      this.setPageHeight()
    },
    onCurrentSectionIdChange (event) {
      if (!this.sceneIsAutoScrolling) this.$store.commit('setCurrentSectionId', event.message)
    },
    setPageHeight () {
      this.pageHeight = (this.lastSectionZPosition - this.firstSectionZPosition) / CONST.PageHeightMultiplyer + this.stageSize.height
      document.body.style.height = this.pageHeight + 'px'
    },
    onResize () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.cameraManager.setSize(this.stageSize)
      this.postProcessingManager.setSize(this.stageSize)
      this.setPageHeight()
    },
    onScreenOrientationChange (e) {
      this.screenOrientation = window.orientation || 0
      this.cameraManager.screenOrientation = this.screenOrientation
    },
    checkCurrentSection () {
      if (!this.sceneIsAutoScrolling) {
        this.sectionsDepthList.forEach(sectionDepth => {
          if (this.cameraManager.position.z < sectionDepth.start &&
          this.cameraManager.position.z > sectionDepth.end &&
          this.currentSectionId !== sectionDepth.id) {
            this.$store.commit('setCurrentSectionId', sectionDepth.id)
          }
        })
      }
    },
    zPosToScrollTop (zPos) {
      return (zPos / this.lastSectionZPosition) * (this.pageHeight - this.stageSize.height)
    },
    render3D () {
      this.renderer.clear()
      if (this.vrModeActivated) {
        this.vrRenderer.render(this.scene, this.cameraManager.camera)
      } else {
        this.renderer.render(this.scene, this.cameraManager.camera)
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
      this.cameraManager.removeListeners()
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
    'nightModeActivated' (activated) {
      this.envManager.toggleNight(activated)
    },
    'vrModeActivated' (activated) {
      this.onResize()
      this.cameraManager.vrMode = activated
      this.postProcessingManager.toggleVisibility()
      document.body.className = activated ? 'vr' : ''
    },
    'goToSectionId' (id) {
      let scrollVal = Math.floor(this.zPosToScrollTop((this.samples[id].zpos - CONST.CameraDistanceToSection)))
      this.sceneIsAutoScrolling = true
      this.$store.commit('setCurrentSectionId', id)
      this.cameraManager.scrollTo(scrollVal, () => {
        this.sceneIsAutoScrolling = false
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

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

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
    font-family: 'Roboto', sans-serif;
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

.stats {
  opacity: 0.4 !important;
  bottom: 0;
  top: auto !important;
}
</style>
