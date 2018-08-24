import GuiManager from '../utils/GuiManager'
import THREE from './PostProcessingImports.js'

export default class PostProcessingManager {
  renderer
  scene
  camera
  stageSize
  composerScene
  composerSceneEffects
  visible = true

  constructor (renderer, scene, camera, stageSize) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.stageSize = stageSize
    let rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: false
    }
    let renderScene = new THREE.RenderPass(this.scene, this.camera)
    let effectBloom = new THREE.BloomPass(0.5)
    // let effectFilm = new THREE.FilmPass(0.15, 0.025, 100, false)
    let effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader)
    let effectVignette = new THREE.ShaderPass(THREE.VignetteShader)
    let antiAliasing = new THREE.ShaderPass(THREE.FXAAShader)
    effectBleach.uniforms[ 'opacity' ].value = 0.15
    effectVignette.uniforms[ 'offset' ].value = 0.8
    effectVignette.uniforms[ 'darkness' ].value = 1.0
    effectVignette.renderToScreen = true
    antiAliasing.uniforms.resolution.value.x = 1 / this.stageSize.width
    antiAliasing.uniforms.resolution.value.y = 1 / this.stageSize.height

    this.composerSceneEffects = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(this.stageSize.width, this.stageSize.height, rtParameters))
    this.composerSceneEffects.addPass(renderScene)
    this.composerSceneEffects.addPass(effectBloom)
    // this.composerSceneEffects.addPass(effectFilm)
    // this.composerSceneEffects.addPass(effectBleach)
    this.composerSceneEffects.addPass(effectVignette)
    // this.composerScene.addPass(antiAliasing)

    GuiManager.add(this, 'visible').name('Post processing')
  }

  resize () {
    this.composerSceneEffects.setSize(this.stageSize.width, this.stageSize.height)
  }

  render () {
    if (this.visible) this.composerSceneEffects.render(0.01)
  }

  toggleVisibility () {
    this.visible = !this.visible
  }
}
