<template>
  <div id="app" :class="{vr: vrModeActivated, portrait: portraitOrientation}">
      <c-watch-section :watch-data="sectionsData[0]"></c-watch-section>
      <c-other-models-section :models-data="sectionsData[1].watches"></c-other-models-section>
      <div id="stage" ref="stage"></div>
      <c-header></c-header>
      <c-menu-mobile></c-menu-mobile>
      <c-sections :items="sectionsData"></c-sections>
      <c-meter></c-meter>
      <!-- <c-tilt></c-tilt> -->
      <c-social-networks></c-social-networks>
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
import WatchSection from '@/components/three/sections/WatchSection.js'
import OtherModelsSection from '@/components/three/sections/OtherModelsSection.js'
import BoutiqueSection from '@/components/three/sections/BoutiqueSection.js'
import CameraManager from '@/components/three/CameraManager.js'

// vue
import { mapGetters } from 'vuex'
import Meter from '@/components/vue/Meter.vue'
import Header from '@/components/vue/Header.vue'
import SectionsAnchors from '@/components/vue/SectionsAnchors.vue'
import WatchSectionVue from '@/components/vue/WatchSection.vue'
import MenuMobile from '@/components/vue/Menu-mobile.vue'
import OtherModelsSectionVue from '@/components/vue/OtherModelsSection.vue'
import socialNetworks from '@/components/vue/social-networks.vue'
import Tilt from '@/components/vue/tilt.vue'

// libs
import * as THREE from 'three'
import GuiManager from '@/utils/GuiManager'

export default {
  name: 'Ulysse-Nardin-App',
  components: {
    'c-header': Header,
    'c-meter': Meter,
    'c-sections': SectionsAnchors,
    'c-watch-section': WatchSectionVue,
    'c-menu-mobile': MenuMobile,
    'c-other-models-section': OtherModelsSectionVue,
    'c-social-networks': socialNetworks,
    'c-tilt': Tilt
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
      sections: [],
      sectionsData: [
        {
          id: 0,
          type: 'watch',
          title: 'The New Diver',
          sectionWeight: 6,
          intro: [
            'A diving watch collection',
            'crafted to withstand up to',
            'three hundred meters of',
            'potentially deadly water pressure'
          ],
          features: [
            {id: 'bluedial', text: 'Inverted, concave bezel\nwith domed sapphire glass', weight: 0},
            {id: 'diameter', text: '42 and 44 mm diameters\nSturdy, blue rubber guards protect the crown', weight: 0},
            {id: 'caliber', text: 'UN-118 movement - silicium technology\nVisible through the open back', weight: 0},
            {id: 'glowing', text: 'Superluminova makes the hours and minutes visible at great depths', weight: 4},
            {id: 'waterproof', text: 'Waterproof\nup to 300m', weight: 0}
          ],
          details: {
            title: 'Diver Blue Dial',
            sku: '1183-170-3/93',
            movementLabel: 'movement',
            movementText: 'UN-1180 manufacture w. power reserve, small second and date\nUN certificate, Silicium technology',
            caseLabel: 'case',
            caseDiameter: 'Diameter 44mm',
            caseHeight: 'Height 10.75 mm',
            caseWater: 'Water resistance 300 m',
            price: '5\'800 CHF',
            buyLink: 'www.google.com'
          }
        },
        {
          id: 1,
          type: 'other-models',
          title: 'Other models',
          sectionWeight: 0,
          watches: [
            {
              id: 'black',
              title: 'Black dial',
              description: 'Rubber\n44 mm',
              price: '5\'800 CHF',
              buyLink: 'www.google.com'
            },
            {
              id: 'gold',
              title: 'Gold Black dial',
              description: 'Rubber\n44 mm',
              price: '7\'900 CHF',
              buyLink: 'www.google.com'
            },
            {
              id: 'white',
              title: 'Great White',
              description: 'Rubber\n44 mm',
              price: '8\'900 CHF',
              buyLink: 'www.google.com'
            }
          ]
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
      this.scene = new THREE.Scene()
      this.cameraManager = new CameraManager(this.stageSize)
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.renderer.autoClear = false
      this.renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      )

      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
      this.renderer.toneMapping = THREE.LinearToneMapping

      this.vrRenderer = new VrRenderer(this.renderer)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setEyeSeparation(1.3)
      this.stageDOMElement.appendChild(this.renderer.domElement)

      this.scene.add(this.cameraManager)
      window.AppCameraDummy = this.cameraManager
      window.AppStageSize = this.stageSize
      window.AppRenderer = this.renderer
      window.AppScene = this.scene

      let renderOptionFolder = GuiManager.addFolder('Render Options')
      let toneMappingOptions = {None: THREE.NoToneMapping, Linear: THREE.LinearToneMapping, Reinhard: THREE.ReinhardToneMapping, Uncharted2: THREE.Uncharted2ToneMapping, Cineon: THREE.CineonToneMapping}
      let currentToneMapping = {value: 'Linear'}
      renderOptionFolder.add(currentToneMapping, 'value', Object.keys(toneMappingOptions)).onChange((value) => {
        this.renderer.toneMapping = toneMappingOptions[value]
        this.onRendererSettingsChanged()
      })
      renderOptionFolder.add(this.renderer, 'toneMappingExposure', 0, 10).name('Exposure').onChange(this.onRendererSettingsChanged)
      renderOptionFolder.add(this.renderer, 'toneMappingWhitePoint', 0, 2).name('White point').onChange(this.onRendererSettingsChanged)
      renderOptionFolder.add(this.renderer, 'gammaInput').name('Gamma Input').onChange(this.onRendererSettingsChanged)
      renderOptionFolder.add(this.renderer, 'gammaOutput').name('Gamma Output').onChange(this.onRendererSettingsChanged)
      renderOptionFolder.add(this.renderer, 'gammaFactor', 0, 5).name('Gamma Factor').onChange(this.onRendererSettingsChanged)
    },
    onRendererSettingsChanged (value) {
      /* eslint-disable */
      console.log('-----------------------')
      console.log('toneMapping', this.renderer.toneMapping)
      console.log('toneMappingExposure', this.renderer.toneMappingExposure)
      console.log('toneMappingWhitePoint', this.renderer.toneMappingWhitePoint)
      console.log('gammaInput', this.renderer.gammaInput)
      console.log('gammaOutput', this.renderer.gammaOutput)
      console.log('gammaFactor', this.renderer.gammaFactor)
      /* eslint-enable */
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.needsUpdate = true
        }
      })
    },
    initEnvironment () {
      this.envManager = new Environment(this.scene, this.renderer, this.lastSectionZPosition)
      this.envManager.addEventListener('environmentmaploaded', this.onEnvironmentMapLoaded)
      this.scene.add(this.envManager)
    },
    onEnvironmentMapLoaded (event) {
      this.watchSection.setEnvironmentMap(event.texture)
    },
    initPostProcessing () {
      this.postProcessingManager = new PostProcessingManager(this.renderer, this.scene, this.cameraManager.camera, this.stageSize)
    },
    buildSections () {
      let currentZPos = CONST.InitialCameraDistance
      let sectionsSlotsCount = this.sectionsData.length
      this.sectionsData.forEach(item => {
        sectionsSlotsCount += item.sectionWeight
      })
      let sectionSlotDepth = CONST.SceneDepth / sectionsSlotsCount
      this.sectionsData.forEach(item => {
        item.sectionDepth = sectionSlotDepth * item.sectionWeight
        let section
        switch (item.type) {
          case 'watch':
            section = new WatchSection(item)
            this.watchSection = section
            break
          case 'other-models':
            section = new OtherModelsSection(item)
            break
          case 'boutique':
            section = new BoutiqueSection(item)
            break
        }
        section.matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, -currentZPos))
        item.zpos = currentZPos
        currentZPos += item.sectionDepth + sectionSlotDepth
        this.sectionsDepthList.push({id: item.id, start: -item.zpos + sectionSlotDepth, end: -currentZPos})
        this.scene.add(section)
        this.lastSectionZPosition = item.zpos
        this.sections.push(section)
      })
      this.firstSectionZPosition = this.sectionsData[0].zpos

      this.cameraManager.lastSectionZPosition = this.lastSectionZPosition
      this.setPageHeight()
    },
    onCurrentSectionIdChange (event) {
      if (!this.sceneIsAutoScrolling) this.$store.commit('setCurrentSectionId', event.message)
    },
    setPageHeight () {
      this.pageHeight = (this.lastSectionZPosition - this.firstSectionZPosition + CONST.InitialCameraDistance) / CONST.PageHeightMultiplyer + this.stageSize.height
      document.body.style.height = this.pageHeight + 'px'
    },
    onResize () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.cameraManager.setSize(this.stageSize)
      this.postProcessingManager.setSize(this.stageSize)
      this.setPageHeight()
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
      let scrollVal = Math.floor(this.zPosToScrollTop((this.sectionsData[id].zpos)))
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
  @import '@/scss/main.scss';
  @import '@/scss/_mixins.scss';

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
.gui {
  margin-top: 75px;
  @include small-only {
      display: none;
  }
}
</style>
