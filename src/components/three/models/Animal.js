import * as THREE from 'three'
import FBXLoader from 'three-fbxloader-offical'
import LoadingManager from '@/utils/LoadingManager'
import Utils from '@/utils/Utils'

export default class Animal extends THREE.Object3D {
  material = new THREE.MeshStandardMaterial()
  mesh = new THREE.Mesh()

  animationDelta = 0.2
  up = new THREE.Vector3(0, 0, 0)
  axis = new THREE.Vector3()
  pt
  radians
  tangent
  path

  animationSpline
  animationPath

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

  setAnimationPath (path) {
    this.animationPath = path
    this.animationPath.position.set(0, 0, 0)
    this.add(this.animationPath)
    let verticesTypedArray = this.animationPath.geometry.attributes.position
    let verticesCount = verticesTypedArray.count
    let vectorsArray = []
    for (let index = 0; index < verticesCount; index++) {
      vectorsArray.push(new THREE.Vector3(verticesTypedArray.getX(index), verticesTypedArray.getY(index), verticesTypedArray.getZ(index)))
    }
    this.animationSpline = new THREE.CatmullRomCurve3(vectorsArray)
  }

  initModelAnimation () {
    this.mesh.mixer = new THREE.AnimationMixer(this.mesh)
    this.mesh.mixer.clipAction(this.mesh.animations[0]).setDuration(5).play()
  }

  updateAnimation (delta) {
    this.mesh.mixer.update(delta)
    if (this.animationSpline) {
      this.pt = this.animationSpline.getPoint(this.animationDelta)
      this.mesh.position.set(this.pt.x, this.pt.y, this.pt.z)
      this.tangent = this.animationSpline.getTangent(this.animationDelta).normalize()
      this.axis.crossVectors(this.up, this.tangent).normalize()
      this.radians = Math.acos(this.up.dot(this.tangent))
      this.mesh.quaternion.setFromAxisAngle(this.axis, this.radians)
      this.animationDelta = (this.animationDelta >= 1) ? 0 : this.animationDelta += 0.0002
    }
  }
}
