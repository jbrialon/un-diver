import * as THREE from 'three'
import FBXLoader from 'three-fbxloader-offical'
import LoadingManager from '@/utils/LoadingManager'
import Utils from '@/utils/Utils'

export default class Animal extends THREE.Object3D {
  material = new THREE.MeshStandardMaterial()
  mesh = new THREE.Mesh()

  fbxLoader = new FBXLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor (modelPath) {
    super()
    this.mesh.mixer = {update: () => {}}
    this.fbxLoader.load(modelPath, this.onModelLoaded, () => {}, this.onError)
    this.material.skinning = true
    this.material.shininess = 0
  }

  onModelLoaded = (object) => {
    this.mesh = object
    this.mesh.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true
      }
    })
    Utils.applyMaterialToGroup(this.mesh, this.material)
    this.initModelAnimation()
    super.add(this.mesh)
  }

  onError = (error) => {
    // eslint-disable-next-line
    console.error(error)
  }

  loadDiffuseMap (mapPath) {
    this.material.map = this.textureLoader.load(mapPath)
  }

  loadGlossinessMap (mapPath) {
    this.material.metalnessMap = this.material.roughnessMap = this.textureLoader.load(mapPath)
    this.material.metalness = 1
    this.material.roughness = 1
  }

  initModelAnimation () {
    this.mesh.mixer = new THREE.AnimationMixer(this.mesh)
    this.mesh.mixer.clipAction(this.mesh.animations[0]).setDuration(5).play()
  }

  updateAnimation (delta) {
    this.position.x -= 0.65
    this.position.z += 1
    this.position.y -= 0.15
    this.mesh.mixer.update(delta)
  }
}
