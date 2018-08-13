<template>
  <div id="app">
      <div id="stage"></div>
      <div id="logo">
        <a href="/">
          <img src="./assets/logo.png" alt="Ulysse Nardin">
        </a>
      </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Title from './components/Title.js'
import Watch from './components/Watch.js'
import Plankton from './components/Plankton.js'

export default {
  data: function () {
    return {
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      scene: null,
      cameraDummy: new THREE.Group(),
      camera: null,
      cameraPositionVector: null,
      cameraRotationQuaternion: null,
      pageHeight: 0,
      pageHeightMultiplyer: 0.5,
      deviceOrientation: null,
      screenOrientation: window.orientation || 0,
      mousePosition: new THREE.Vector2(),
      deviceOrientationInitialQuat: new THREE.Quaternion(),
      samples: [
        {
          text: 'WELCOME',
          zpos: 1000
        },
        {
          text: 'DIVER COLLECTION',
          zpos: 3000
        },
        {
          text: 'THE NEW DIVER',
          zpos: 5000
        },
        {
          type: 'watch',
          title: 'Diver Monaco Yacht Show',
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
  mounted: function () {
    this.stageDOMElement = document.getElementById('stage')
    this.initScene()
    this.initEnvironment()
    this.addContentInSpace()
    this.handleEvents()
    document.body.style.height = this.pageHeight + 'px'
  },
  methods: {
    initScene: function () {
      this.stageSize.set(this.stageDOMElement.clientWidth, this.stageDOMElement.clientHeight)
      this.cameraPositionVector = new THREE.Vector3()
      this.cameraRotationQuaternion = new THREE.Quaternion()
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.stageSize.width / this.stageSize.height,
        1,
        2e5
      )
      let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setSize(this.stageSize.width, this.stageSize.height)
      renderer.autoClear = !1
      renderer.setClearColor(0, 0)
      renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      )
      this.stageDOMElement.appendChild(renderer.domElement)
      let animate = () => {
        requestAnimationFrame(animate)
        this.cameraPositionVector.set(0, 0, -(document.scrollingElement || document.documentElement).scrollTop * this.pageHeightMultiplyer)
        this.cameraDummy.position.lerp(this.cameraPositionVector, 0.1)
        this.updateCameraRotation()
        this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1)
        renderer.render(this.scene, this.camera)
      }
      this.cameraDummy.add(this.camera)
      this.scene.add(this.cameraDummy)
      // this.scene.fog = new THREE.FogExp2(0x1c3c4a, 0.000045)
      window.ThreeCameraDummy = this.cameraDummy
      window.ThreeStageSize = this.stageSize
      animate()
    },
    initEnvironment: function () {
      let geometry = new THREE.SphereGeometry(10000, 32, 32)
      let texture = new THREE.TextureLoader().load(require('./assets/underwater.jpg'))
      let material = new THREE.MeshBasicMaterial({map: texture})
      material.side = THREE.BackSide
      let sphere = new THREE.Mesh(geometry, material)
      this.cameraDummy.add(sphere)

      // set up plankton
      let plankton = new Plankton()
      this.scene.add(plankton)
    },
    addContentInSpace: function () {
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
        this.pageHeight = item.zpos * 1 / this.pageHeightMultiplyer
      }
    },
    handleEvents: function () {
      window.addEventListener('mousemove', this.onMouseMove, false)
      window.addEventListener('orientationchange', this.onScreenOrientationChange, false)
      window.addEventListener('deviceorientation', this.onDeviceOrientationInit, false)
      window.addEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
    },
    removeListeners: function () {
      window.removeEventListener('mousemove', this.onMouseMove, false)
      window.removeEventListener('orientationchange', this.onScreenOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
      window.removeEventListener('compassneedscalibration', this.onCompassNeedsCalibration, false)
    },
    restrictFOV: function (vec2) {
      let maxWidth = this.stageSize.width >> 1
      let maxHeight = this.stageSize.height >> 1
      vec2.x = (vec2.x - maxWidth) / maxWidth
      vec2.y = (vec2.y - maxHeight) / maxHeight
    },
    onMouseMove: function (e) {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
      this.restrictFOV(this.mousePosition)
    },
    onDeviceOrientationInit: function (e) {
      this.deviceOrientationToQuaternion(this.deviceOrientationInitialQuat, e)
      this.deviceOrientationInitialQuat = this.deviceOrientationInitialQuat.clone().conjugate()
      window.addEventListener('deviceorientation', this.onDeviceOrientationChange, false)
      window.removeEventListener('deviceorientation', this.onDeviceOrientationInit, false)
    },
    onDeviceOrientationChange: function (e) {
      this.deviceOrientation = e
    },
    onScreenOrientationChange: function (e) {
      this.screenOrientation = window.orientation || 0
    },
    onCompassNeedsCalibration: function (e) {
      e.preventDefault()
    },
    updateCameraRotation: function () {
      if (this.deviceOrientation) {
        this.deviceOrientationToQuaternion(this.cameraRotationQuaternion, this.deviceOrientation)
        this.cameraRotationQuaternion.premultiply(this.deviceOrientationInitialQuat)
      } else {
        this.cameraRotationQuaternion.setFromEuler(new THREE.Euler(-this.mousePosition.y, -this.mousePosition.x, 0))
      }
    },
    deviceOrientationToQuaternion: function (quaternion, deviceOrientation) {
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
    }
  },
  beforeDestroy: function () {
    this.removeListeners()
  }
}
</script>

<style lang="scss">
  @import './scss/main.scss';

  body {
    min-height: 200vh;
  }

  #app {
    height: 100vh;

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
  }
</style>
