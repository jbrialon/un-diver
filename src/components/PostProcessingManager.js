import * as THREE from 'three'
/* eslint-disable */
import * as EffectComposer from '../postprocessing/EffectComposer.js'
import * as RenderPass from '../postprocessing/RenderPass.js'
import * as TexturePass from '../postprocessing/TexturePass.js'
import * as FilmPass from '../postprocessing/FilmPass.js'
import * as ShaderPass from '../postprocessing/ShaderPass.js'
import * as BloomPass from '../postprocessing/BloomPass.js'
import * as FXAAShader from '../shaders/FXAAShader.js'
import * as BleachBypassShader from '../shaders/BleachBypassShader.js'
import * as FilmShader from '../shaders/FilmShader.js'
import * as ConvolutionShader from '../shaders/ConvolutionShader.js'
import * as CopyShader from '../shaders/CopyShader.js'
import * as VignetteShader from '../shaders/VignetteShader.js'
/* eslint-enable */

export default class PostProcessingManager {
  renderer
  scene
  camera
  stageSize
  composerScene
  composerSceneEffects
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

    this.composerSceneEffects = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(this.stageSize.width, this.stageSize.height, rtParameters))
    this.composerSceneEffects.addPass(renderScene)
    this.composerSceneEffects.addPass(effectBloom)
    this.composerSceneEffects.addPass(effectFilm)
    this.composerSceneEffects.addPass(effectBleach)
    this.composerSceneEffects.addPass(effectVignette)
    // this.composerScene.addPass(antiAliasing)
  }

  render () {
    this.composerSceneEffects.render(0.01)
  }
}
