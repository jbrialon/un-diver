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

export default {
  data: function () {
    return {
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      scene: null,
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
          zpos: 2000
        },
        {
          text: 'THE NEW DIVER',
          zpos: 3000
        },
        {
          text: 'STAIN CASE',
          zpos: 4000
        },
        {
          text: 'PHOSPHORESCENT NEEDLES & NUMBERS',
          zpos: 5000
        }
      ]
    }
  },
  mounted: function () {
    this.stageDOMElement = document.getElementById('stage')
    this.initScene()
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
      let renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
      renderer.setSize(this.stageSize.width, this.stageSize.height)
      renderer.autoClear = !1
      renderer.setClearColor(0, 0)
      renderer.setPixelRatio(
        window.devicePixelRatio || window.webkitDevicePixelRatio || 1
      )
      this.stageDOMElement.appendChild(renderer.domElement)
      this.camera.position.set(0, 0, 500)
      let animate = () => {
        requestAnimationFrame(animate)
        this.cameraPositionVector.set(0, 0, -(document.scrollingElement || document.documentElement).scrollTop * this.pageHeightMultiplyer)
        this.camera.position.lerp(this.cameraPositionVector, 0.1)
        this.updateCameraRotation()
        this.camera.quaternion.slerp(this.cameraRotationQuaternion, 0.1)
        renderer.render(this.scene, this.camera)
      }
      animate()
    },
    addContentInSpace: function () {
      for (let index = 0; index < this.samples.length; index++) {
        let texture = new THREE.Texture(
          this.createCanvasText(this.samples[index].text)
        )
        texture.needsUpdate = true
        let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
        let geometry = new THREE.PlaneGeometry(THREE.Math.ceilPowerOfTwo(this.stageSize.width), THREE.Math.ceilPowerOfTwo(this.stageSize.height))
        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.z = -this.samples[index].zpos
        this.pageHeight = this.samples[index].zpos * 1 / this.pageHeightMultiplyer
        this.scene.add(mesh)
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
    createCanvasText: function (text) {
      let canvas = document.createElement('canvas')
      // document.body.appendChild(canvas)
      canvas.width = THREE.Math.ceilPowerOfTwo(
        this.stageSize.width
      )
      canvas.height = THREE.Math.ceilPowerOfTwo(
        this.stageSize.height
      )
      let ctx = canvas.getContext('2d')
      ctx.font = '35pt Arial'
      ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)
      return canvas
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
