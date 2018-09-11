<template>
  <div id="app" :class="{vr: vrModeActivated, portrait: portraitOrientation, started: render3dExperience}">
    <c-watch-section v-if="sectionsData" :watch-data="sectionsData[0]"></c-watch-section>
    <c-other-models-section v-if="sectionsData" :models-data="sectionsData[1].watches"></c-other-models-section>
    <c-final-section v-if="sectionsData" :section-data="sectionsData[2]"></c-final-section>
    <c-intro></c-intro>
    <c-gallery></c-gallery>
    <div id="stage" ref="stage"></div>
    <c-header></c-header>
    <c-menu-mobile></c-menu-mobile>
    <c-sections v-if="sectionsData" :items="sectionsData"></c-sections>
    <c-meter></c-meter>
    <c-social-networks></c-social-networks>
    <div id="rotate-device-message">
      {{ $t("rotate_device_message") }}
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
import WatchSection from '@/components/three/sections/WatchSection.js'
import OtherModelsSection from '@/components/three/sections/OtherModelsSection.js'
import FinalSection from '@/components/three/sections/FinalSection.js'
import CameraManager from '@/components/three/CameraManager.js'

// vue
import { mapGetters } from 'vuex'
import Meter from '@/components/vue/Meter.vue'
import Header from '@/components/vue/Header.vue'
import SectionsAnchors from '@/components/vue/SectionsAnchors.vue'
import WatchSectionVue from '@/components/vue/vue-textures/WatchSection.vue'
import OtherModelsSectionVue from '@/components/vue/vue-textures/OtherModelsSection.vue'
import FinalSectionVue from '@/components/vue/vue-textures/FinalSection.vue'
import MenuMobile from '@/components/vue/Menu-mobile.vue'
import SocialNetworks from '@/components/vue/SocialNetworks.vue'
import Intro from '@/components/vue/Intro/Intro.vue'
import Gallery from '@/components/vue/Gallery/Gallery.vue'

// libs
import THREE from '@/utils/ThreeWithPlugins'
// import GuiManager from '@/utils/GuiManager'
import Utils from '@/utils/Utils'

// data
import data from '@/data/data.js'

export default {
  name: 'Ulysse-Nardin-App',
  components: {
    'c-header': Header,
    'c-meter': Meter,
    'c-sections': SectionsAnchors,
    'c-watch-section': WatchSectionVue,
    'c-other-models-section': OtherModelsSectionVue,
    'c-final-section': FinalSectionVue,
    'c-menu-mobile': MenuMobile,
    'c-social-networks': SocialNetworks,
    'c-intro': Intro,
    'c-gallery': Gallery
  },
  data () {
    return {
      sectionsData: null
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
      'loadingPercent',
      'loadingComplete',
      'render3dExperience',
      'initDiving',
      'vrModeActivated',
      'currentSectionId',
      'goToSectionId'
    ])
  },
  beforeCreate () {
    this.stageSize = new THREE.Vector2(0, 0)
    this.scene = null
    this.envManager = null
    this.scrollingElement = null
    this.sceneIsAutoScrolling = false
    this.pageHeight = 0
    this.stageDOMElement = null
    this.cameraManager = null
    this.renderer = null
    this.cssRenderer = null
    this.firstSectionZPosition = 0
    this.postProcessingManager = null
    this.screenOrientation = window.orientation || 0
    this.scrollTween = null
    this.sectionMargin = 0
    this.sectionsDepthList = []
    this.ThreeClock = new THREE.Clock()
    this.sections = []
  },
  mounted () {
    this.initExperience()
  },
  methods: {
    initExperience () {
      this.sectionMargin = CONST.SceneDepth * CONST.SectionsMargin
      const sceneDepthWithoutMargins = CONST.SceneDepth - (this.sectionMargin * (data.length - 1))
      Utils.computeChildDepths(data, sceneDepthWithoutMargins)
      this.sectionsData = data

      this.stageDOMElement = this.$refs.stage
      this.initScene()
      this.buildSections()
      this.initEnvironment()
      this.initPostProcessing()
      this.handleEvents()
      this.onResize()
      AnimationLoopManager.addCallback(this.checkCurrentSection)
      AnimationLoopManager.addLastCallback(this.render3D)
      if (this.render3dExperience) this.startRender()
      if (this.initDiving) this.startDiving(true)
    },
    startRender () {
      this.renderer.setAnimationLoop(AnimationLoopManager.renderLoop)
    },
    startDiving (skipInitialTween) {
      this.setPageHeight()
      this.cameraManager.initDiving(skipInitialTween)
    },
    handleEvents () {
      this.cameraManager.handleEvents()
      window.addEventListener('resize', this.onResize, false)
      window.addEventListener('orientationchange', this.onScreenOrientationChange, false)
    },
    removeListeners () {
      this.cameraManager.removeListeners()
      window.removeEventListener('resize', this.onResize, false)
      window.removeEventListener('orientationchange', this.onScreenOrientationChange, false)
    },
    initScene () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.$store.commit('setStageSize', this.stageSize)
      this.scene = new THREE.Scene()
      this.cameraManager = new CameraManager(this.stageSize)
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.renderer.autoClear = false
      // optimization for retina screens
      if (Utils.isMobile()) {
        this.renderer.setPixelRatio(
          window.devicePixelRatio || window.webkitDevicePixelRatio || 1
        )
      }
      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
      this.renderer.toneMapping = THREE.LinearToneMapping
      this.stageDOMElement.appendChild(this.renderer.domElement)

      this.cssRenderer = new THREE.CSS3DRenderer()
      this.cssRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.cssRenderer.domElement.style.position = 'fixed'
      this.cssRenderer.domElement.style.top = 0
      this.stageDOMElement.appendChild(this.cssRenderer.domElement)

      this.vrRenderer = new VrRenderer(this.renderer)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setEyeSeparation(1.3)

      this.scene.add(this.cameraManager)
      window.AppCameraDummy = this.cameraManager
      window.AppStageSize = this.stageSize
      window.AppRenderer = this.renderer
      window.AppScene = this.scene
      window.AppNightIntensity = 0

      // let renderOptionFolder = GuiManager.addFolder('Render Options')
      // let toneMappingOptions = { None: THREE.NoToneMapping, Linear: THREE.LinearToneMapping, Reinhard: THREE.ReinhardToneMapping, Uncharted2: THREE.Uncharted2ToneMapping, Cineon: THREE.CineonToneMapping }
      // let currentToneMapping = { value: 'Linear' }
      // renderOptionFolder.add(currentToneMapping, 'value', Object.keys(toneMappingOptions)).onChange((value) => {
      //   this.renderer.toneMapping = toneMappingOptions[value]
      //   this.onRendererSettingsChanged()
      // })
      // renderOptionFolder.add(this.renderer, 'toneMappingExposure', 0, 10).name('Exposure').onChange(this.onRendererSettingsChanged)
      // renderOptionFolder.add(this.renderer, 'toneMappingWhitePoint', 0, 2).name('White point').onChange(this.onRendererSettingsChanged)
      // renderOptionFolder.add(this.renderer, 'gammaInput').name('Gamma Input').onChange(this.onRendererSettingsChanged)
      // renderOptionFolder.add(this.renderer, 'gammaOutput').name('Gamma Output').onChange(this.onRendererSettingsChanged)
      // renderOptionFolder.add(this.renderer, 'gammaFactor', 0, 5).name('Gamma Factor').onChange(this.onRendererSettingsChanged)
    },
    onRendererSettingsChanged (value) {
      /* eslint-disable */
      // console.log('-----------------------')
      // console.log('toneMapping', this.renderer.toneMapping)
      // console.log('toneMappingExposure', this.renderer.toneMappingExposure)
      // console.log('toneMappingWhitePoint', this.renderer.toneMappingWhitePoint)
      // console.log('gammaInput', this.renderer.gammaInput)
      // console.log('gammaOutput', this.renderer.gammaOutput)
      // console.log('gammaFactor', this.renderer.gammaFactor)
      /* eslint-enable */
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.needsUpdate = true
        }
      })
    },
    initEnvironment () {
      this.envManager = new Environment(this.scene, this.renderer)
      this.envManager.addEventListener(CONST.ENVIRONMENT_MAP_LOADED, this.onEnvironmentMapLoaded)
      this.scene.add(this.envManager)
    },
    onEnvironmentMapLoaded (event) {
      this.watchSection.setEnvironmentMap(event.texture)
    },
    initPostProcessing () {
      this.postProcessingManager = new PostProcessingManager(this.renderer, this.scene, this.cameraManager.camera, this.stageSize)
    },
    buildSections () {
      let currentZPos = 0
      this.sectionsData.forEach(item => {
        let section
        switch (item.type) {
          case 'watch':
            section = new WatchSection(item)
            this.watchSection = section
            break
          case 'other-models':
            section = new OtherModelsSection(item)
            break
          case 'final':
            section = new FinalSection(item)
            break
        }
        section.matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, -currentZPos))
        item.zpos = currentZPos
        currentZPos += item.depth
        currentZPos += this.sectionMargin
        this.sectionsDepthList.push({ id: item.id, start: -item.zpos + this.sectionMargin, end: -currentZPos })
        this.scene.add(section)
        this.sections.push(section)
      })
      this.firstSectionZPosition = this.sectionsData[0].zpos
      this.initPageHeight()
    },
    initPageHeight () {
      this.pageHeight = (CONST.SceneDepth - this.firstSectionZPosition) / CONST.PageHeightMultiplyer + this.stageSize.height
    },
    setPageHeight () {
      document.body.style.height = this.pageHeight + 'px'
    },
    onResize () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.cssRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.cameraManager.setSize(this.stageSize)
      this.postProcessingManager.setSize(this.stageSize)
      this.initPageHeight()
      if (this.render3dExperience) this.setPageHeight()
      this.sections.forEach(section => {
        section.resize()
      })
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
      return (zPos / CONST.SceneDepth) * (this.pageHeight - this.stageSize.height)
    },
    render3D () {
      this.renderer.clear()
      if (this.vrModeActivated) {
        this.vrRenderer.render(this.scene, this.cameraManager.camera)
      } else {
        this.renderer.render(this.scene, this.cameraManager.camera)
        this.postProcessingManager.render()
      }
      this.cssRenderer.render(this.scene, this.cameraManager.camera)
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
          if (obj.material.map && obj.material.map.dispose) {
            obj.material.map.dispose()
          }
          if (obj.material.dispose) {
            obj.material.dispose()
          }

          obj.material.map = undefined
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
    'initDiving' (activated) {
      this.startDiving()
    },
    'render3dExperience' (complete) {
      this.startRender()
    },
    'loadingComplete' (complete) {
      this.$store.commit('render3dExperience')
    },
    'vrModeActivated' (activated) {
      this.onResize()
      this.cameraManager.vrMode = activated
      this.postProcessingManager.toggleVisibility()
      document.body.className = activated ? 'vr' : ''
    },
    'goToSectionId' (idObj) {
      let scrollVal = Math.floor(this.zPosToScrollTop((this.sectionsData[idObj.id].zpos)))
      this.sceneIsAutoScrolling = true
      this.$store.commit('setCurrentSectionId', idObj.id)
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
  @import '@/scss/main.scss';
  @import '@/scss/_mixins.scss';

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }

  html::-webkit-scrollbar {
    width:0 !important;
  }
  body {
    position:relative;
    width:100vw;
    min-height: 100vh;
    background: black;
    overflow-x: hidden;
    &.vr {
      .stats, .gui {
        display: none;
      }
    }
  }

  #app {
    position:relative;
    font-family: 'Roboto', sans-serif;
    width:100vw;
    height: 100vh;
    overflow: hidden;
    &.started {
      overflow: auto;
    }
    &.vr {
      #logo, #menu-about, #menu-help, #sections {
        display: none;
      }

      &.portrait {
        #rotate-device-message {
          display: block;
        }
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

    #startBtn {
      position: fixed;
      background: $white;
      color: $black;
      font-size: 3em;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

.stats {
  opacity: 0.4 !important;
  bottom: 0;
  top: auto !important;
}
.gui {
  margin-top: 75px;
  @include small-only {
      display: none;
  }
}
</style>
