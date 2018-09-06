<template>
  <div id="app">
      <div id="stage" ref="stage"></div>
      <c-link id="test__link" :href="$t('header_cta_1_link')" :label="$t('header_cta_1')" class="header__link"></c-link>
  </div>
</template>

<script>
/* eslint-disable */
import GuiManager from '@/utils/GuiManager'
import AnimationLoopManager from '@/utils/AnimationLoopManager'
import THREE from '@/utils/ThreeWithPlugins'
import Link from '@/components/vue/Link'
import Button from '@/components/three/Button'

export default {
  components: {
    'c-link': Link
  },
  data () {
    return {
      stageSize: new THREE.Vector2(0, 0),
      stageDOMElement: null,
      cssScene: null,
      div: null,
      scene: null,
      camera: null,
      cssRenderer: null,
      renderer: null,
      planeMesh: null,
      params: {
        envMap: 'HDR',
        roughness: 0.0,
        metalness: 0.0,
        exposure: 1.0
      },
      objects: []
    }
  },

  mounted () {
    this.stageDOMElement = this.$refs.stage
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0xffffff, 1)
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.domElement.style.zIndex = 5;
    this.stageDOMElement.appendChild(this.renderer.domElement)
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.renderer.toneMappingExposure = 3
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000)
    this.camera.position.z = 300

    this.scene.add(new THREE.HemisphereLight(0x443333, 0x222233, 4))

    //CSS3D Renderer
    this.cssRenderer = new THREE.CSS3DRenderer()
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
    this.cssRenderer.domElement.style.position = 'fixed'
    this.cssRenderer.domElement.style.top = 0
    document.body.appendChild(this.cssRenderer.domElement)


    // create the plane mesh
    var material = new THREE.MeshBasicMaterial({ wireframe: true });
    var geometry = new THREE.PlaneGeometry();
    this.planeMesh= new THREE.Mesh( geometry, material );
    // add it to the WebGL scene
    this.scene.add(this.planeMesh);

    let btn = new Button('test__link')
    btn.addEventListener('mouseover', event => {
      // eslint-disable-next-line
      console.log('mouseover')
      event.preventDefault()
      event.stopImmediatePropagation()
    })
    this.planeMesh.add(btn)

    AnimationLoopManager.addFirstCallback(this.render3D)
    this.renderer.setAnimationLoop(AnimationLoopManager.renderLoop)

    // GuiManager.add(params, 'envMap', [ 'LDR', 'HDR', 'RGBM16'])
    GuiManager.add(this.renderer, 'toneMappingExposure', 0, 2).name('exposure')
    GuiManager.gui.open()
  },

  methods: {
    render3D () {
      this.planeMesh.rotation.y += 0.05
      this.cssRenderer.render(this.scene, this.camera)
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
    min-height: 100vh;
    background: black;
  }

  #app {
    height: 100vh;
    opacity: 0.5;

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
