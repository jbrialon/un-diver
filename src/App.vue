<template>
  <div id="app" :class="{vr: vrModeActivated, portrait: portraitOrientation}">
      <div id="stage" ref="stage"></div>
      <div id="logo">
        <a href="/">
          <!--<img src="./assets/logo.png" alt="Ulysse Nardin">-->
        </a>
      </div>
      <Menu></Menu>
      <div id="rotate-device-message">
        Please rotate your device to landscape
      </div>
  </div>
</template>

<script>
import * as dat from 'dat.gui'
import * as THREE from 'three'
/* eslint-disable */
import * as EffectComposer from './postprocessing/EffectComposer.js'
import * as RenderPass from './postprocessing/RenderPass.js'
import * as TexturePass from './postprocessing/TexturePass.js'
import * as FilmPass from './postprocessing/FilmPass.js'
import * as ShaderPass from './postprocessing/ShaderPass.js'
import * as BloomPass from './postprocessing/BloomPass.js'
import * as FXAAShader from './shaders/FXAAShader.js'
import * as BleachBypassShader from './shaders/BleachBypassShader.js'
import * as FilmShader from './shaders/FilmShader.js'
import * as ConvolutionShader from './shaders/ConvolutionShader.js'
import * as CopyShader from './shaders/CopyShader.js'
import * as VignetteShader from './shaders/VignetteShader.js'
/* eslint-enable */
import { mapGetters } from 'vuex'
import Menu from './components/vue/Menu.vue'
import Environment from './components/Environment.js'
import BackgroundColorManager from './components/BackgroundColorManager.js'
import VrRenderer from './components/VrRenderer.js'
import Title from './components/Title.js'
import Watch from './components/Watch.js'

export default {
  components: {
    Menu
  },
  data () {
    return {
      gui: new dat.GUI(),
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
      composerScene: null,
      samples: [
        {
          text: 'DIVER',
          zpos: 1000
        },
        {
          text: 'DISCOVER THE COLLECTION',
          zpos: 3000
        },
        {
          text: 'DEEP DIVE',
          zpos: 5000
        },
        {
          type: 'watch',
          title: 'DIVER CHRONOGRAPH',
          texturePath: require('./assets/watches/3203.png'),
          infoLink: 'toto.com',
          buyLink: 'toto.com',
          price: '12,000 CHF',
          zpos: 7000
        },
        {
          text: 'STAIN CASE',
          zpos: 9000
        },
        {
          text: 'PHOSPHORESCENT NEEDLES & NUMBERS',
          zpos: 11000
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
      'vrModeActivated'
    ])
  },
  mounted () {
    this.stageDOMElement = this.$refs.stage
    this.initScene()
    this.addContentInSpace()
    this.initEnvironment()
    this.initPostProcessing()
    this.handleEvents()
    this.onResize()
    this.render3D()
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
    },
    initEnvironment () {
      let bgManager = new BackgroundColorManager(this.renderer, this.scene)
      bgManager.init()

      let envManager = new Environment(this.scene, this.endZPos)
      envManager.init()

      // TODO: initialize this only on dev mode, maybe not in a setTimeout
      setTimeout(() => {
        const guiTerrainFolder = this.gui.addFolder('Terrain')
        guiTerrainFolder.add(envManager.terrainModel.position, 'x')
        guiTerrainFolder.add(envManager.terrainModel.position, 'y')
        guiTerrainFolder.add(envManager.terrainModel.position, 'z')

        const guiFogFoler = this.gui.addFolder('Fog')
        guiFogFoler.add(bgManager, 'density')
      }, 2000)
    },
    initPostProcessing () {
      let rtParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      }
      let renderScene = new THREE.RenderPass(this.scene, this.camera)
      let effectBloom = new THREE.BloomPass(0.5)
      let effectFilm = new THREE.FilmPass(0.15, 0.025, 100, false)
      let effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader)
      let effectVignette = new THREE.ShaderPass(THREE.VignetteShader)
      let antiAliasing = new THREE.ShaderPass(THREE.FXAAShader)
      effectBleach.uniforms[ 'opacity' ].value = 0.15
      effectVignette.uniforms[ 'offset' ].value = 0.55
      effectVignette.uniforms[ 'darkness' ].value = 1.6
      effectVignette.renderToScreen = true
      antiAliasing.uniforms.resolution.value.x = 1 / this.stageSize.width
      antiAliasing.uniforms.resolution.value.y = 1 / this.stageSize.height

      this.composerScene = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(this.stageSize.width, this.stageSize.height, rtParameters))
      this.composerScene.addPass(renderScene)
      this.composerScene.addPass(effectBloom)
      this.composerScene.addPass(effectFilm)
      this.composerScene.addPass(effectBleach)
      this.composerScene.addPass(effectVignette)
      // this.composerScene.addPass(antiAliasing)
    },
    addContentInSpace () {
      this.startZPos = this.samples[0].zpos
      this.endZPos = this.samples[this.samples.length - 1].zpos

      for (let index = 0; index < this.samples.length; index++) {
        let item = this.samples[index]
        let itemObject
        switch (item.type) {
          case 'watch':
            itemObject = new Watch(item.title, item.price, item.infoLink, item.buyLink, item.texturePath)
            break
          default:
            itemObject = new Title(item.text)
            break
        }
        itemObject.position.z = -item.zpos
        this.scene.add(itemObject)
      }
    },
    setPageHeight () {
      document.body.style.height = (this.endZPos - this.startZPos) / this.pageHeightMultiplyer + this.stageSize.height + 'px'
    },
    handleEvents () {
      window.addEventListener('resize', this.onResize, false)
      window.addEventListener('mousemove', this.onMouseMove, false)
      window.addEventListener('orientationchange', this.onScreenOrientationChange, false)
      window.addEventListener('deviceorientation', this.onDeviceOrientationInit, false)
      window.addEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
    },
    removeListeners () {
      window.removeEventListener('resize', this.onResize, false)
      window.removeEventListener('mousemove', this.onMouseMove, false)
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
    onMouseMove (e) {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
      this.restrictFOV(this.mousePosition)
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
    updateCameraRotation () {
      if (this.deviceOrientation) {
        this.deviceOrientationToQuaternion(this.cameraRotationQuaternion, this.deviceOrientation)
        this.cameraRotationQuaternion.premultiply(this.deviceOrientationInitialQuat)
      } else {
        this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-this.mousePosition.y, -this.mousePosition.x, 0))
      }
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
    onResize () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.renderer.setSize(this.stageSize.width, this.stageSize.height)
      this.camera.aspect = this.stageSize.width / this.stageSize.height
      this.vrRenderer.setSize(this.stageSize.width, this.stageSize.height)
      this.camera.updateProjectionMatrix()
      this.setPageHeight()
    },
    render3D () {
      requestAnimationFrame(() => this.render3D())
      window.AppScrollPercentage = (-this.cameraDummy.position.z / this.endZPos)
      this.cameraDummy.position.z += (-(document.scrollingElement || document.documentElement).scrollTop * this.pageHeightMultiplyer - this.cameraDummy.position.z) / 10
      this.updateCameraRotation()
      this.vrModeActivated ? this.camera.quaternion.copy(this.cameraRotationQuaternion) : this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1)
      this.renderer.clear()
      this.vrModeActivated ? this.vrRenderer.render(this.scene, this.camera) : this.renderer.render(this.scene, this.camera)

      this.composerScene.render(0.001)
    }
  },
  watch: {
    'vrModeActivated' (newVal) {
      this.onResize()
    }
  },
  beforeDestroy () {
    this.removeListeners()
  }
}
</script>

<style lang="scss">
  @import './scss/main.scss';

  body {
    min-height: 200vh;
    background: black;
  }

  #app {
    height: 100vh;

    &.vr {
      #logo, #menu-about, #menu-help {
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
