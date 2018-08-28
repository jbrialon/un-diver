<template>
  <div id="app">
      <div id="stage" ref="stage"></div>
  </div>
</template>

<script>
import * as CONST from './Constants'
import GuiManager from './utils/GuiManager'
import AnimationLoopManager from './utils/AnimationLoopManager'
import THREE from './reflectance/ReflectanceImports'
import WatchModel from './components/WatchModel'

export default {
  components: {
  },
  data () {
    return {
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      scene: null,
      camera: null,
      renderer: null,
      params: {
        envMap: 'HDR',
        roughness: 0.0,
        metalness: 0.0,
        exposure: 1.0
      },
      controls: null,
      objects: [],
      hdrCubeRenderTarget: null,
      watch: null
    }
  },

  mounted () {
    this.stageDOMElement = this.$refs.stage
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.stageDOMElement.appendChild(this.renderer.domElement)
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.toneMappingExposure = 3
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000)
    this.camera.position.z = 2

    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement)
    this.scene.add(new THREE.HemisphereLight(0x443333, 0x222233, 4))

    this.addEnv()

    AnimationLoopManager.addFirstCallback(this.render3D)
    this.renderer.setAnimationLoop(AnimationLoopManager.renderLoop)

    // GuiManager.add(params, 'envMap', [ 'LDR', 'HDR', 'RGBM16'])
    GuiManager.add(this.renderer, 'toneMappingExposure', 0, 2).name('exposure')
    GuiManager.gui.open()
  },

  methods: {
    genCubeUrls (prefix, postfix) {
      return [
        prefix + 'px' + postfix, prefix + 'nx' + postfix,
        prefix + 'py' + postfix, prefix + 'ny' + postfix,
        prefix + 'pz' + postfix, prefix + 'nz' + postfix
      ]
    },
    addEnv () {
      new THREE.CubeTextureLoader().setPath('textures/pisa/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], (textureCube) => {
        this.scene.background = textureCube
      })
      const hdrUrls = this.genCubeUrls(CONST.HdrEnvTexturePath, '.hdr')
      new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, (hdrCubeMap) => {
        var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap)
        pmremGenerator.update(this.renderer)
        var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods)
        pmremCubeUVPacker.update(this.renderer)
        this.hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget
        hdrCubeMap.dispose()
        pmremGenerator.dispose()
        pmremCubeUVPacker.dispose()
        this.addWatch()
      })
    },
    addWatch () {
      this.watch = new WatchModel()
      this.watch.setEnvironmentMap(this.hdrCubeRenderTarget.texture)
      this.watch.scale.set(0.02, 0.02, 0.02)
      this.watch.position.x = -0.45
      this.watch.rotation.y = -Math.PI / 2

      let box = new THREE.BoxHelper(this.watch, 0xffff00)
      this.scene.add(box)
      this.scene.add(this.watch)
    },
    render3D () {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
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
      AnimationLoopManager.cleartLoop()
      this.renderer.setAnimationLoop(() => {})
      this.clearThree(this.scene)
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.context = undefined
      this.renderer.domElement = undefined
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

.stats { opacity: 0.4 !important; }
</style>
