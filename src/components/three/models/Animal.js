import * as THREE from 'three'
import FBXLoader from 'three-fbxloader-offical'
import LoadingManager from '@/utils/LoadingManager'
import Utils from '@/utils/Utils'

export default class Animal extends THREE.Object3D {
  material = new THREE.MeshLambertMaterial()
  mesh = new THREE.Mesh()

  showAnimationSpline = true
  cruisingSpeed = 0.001
  cruisingRadius = 1000

  animationDelta = 0.2
  upVector = new THREE.Vector3(-1, 0, 0)
  rotationAxis = new THREE.Vector3()
  currentPoint
  radians
  tangent

  animationSpline
  animationPath

  fbxLoader = new FBXLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor () {
    super()
    this.mesh.mixer = {update: () => {}}
    this.material.skinning = true
    this.material.shininess = 0
  }

  loadModel (modelPath) {
    this.fbxLoader.load(modelPath, this.onModelLoaded, () => {}, this.onError)
  }

  set speed (speed) {
    this.cruisingSpeed = speed * 0.01
  }

  get speed () {
    return this.cruisingSpeed * 0.01
  }

  onModelLoaded = (object) => {
    object.scale.copy(this.mesh.scale)
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
    let newMaterial = new THREE.MeshStandardMaterial()
    newMaterial.map = this.material.map
    newMaterial.metalnessMap = newMaterial.roughnessMap = this.textureLoader.load(mapPath)
    newMaterial.metalness = 0.5
    newMaterial.roughness = 1
    newMaterial.shininess = 1
    newMaterial.skinning = true
    if (this.material.envMap) this.applyEnvMap(this.material.envMap, newMaterial)
    this.material = newMaterial
  }

  setEnvironmentMap (texture) {
    this.applyEnvMap(texture, this.material)
  }

  applyEnvMap (texture, material) {
    material.envMap = texture
    material.envMapIntensity = 2
    material.needsUpdate = true
  }

  setOrientation (euler) {
    this.quaternion.setFromEuler(euler)
  }

  setAnimationPath (path) {
    // TODO : if possible work with spline passed in Terrain FBX model, passed in "path" argument here
    /*
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
    */

    // Create the default ellipse path to animate animal
    this.animationSpline = new THREE.EllipseCurve(
      0, 0, // ax, aY
      this.cruisingRadius, this.cruisingRadius * 0.2, // xRadius, yRadius
      0, 2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    )

    let points2D = this.animationSpline.getPoints(50)
    let points3d = []
    for (let index = 0; index < points2D.length; index++) {
      points3d.push(new THREE.Vector3(points2D[index].x, 0, points2D[index].y))
    }
    this.animationSpline = new THREE.CatmullRomCurve3(points3d)
    if (this.showAnimationSpline) {
      let geometry = new THREE.BufferGeometry().setFromPoints(points3d)
      let material = new THREE.LineBasicMaterial({color: 0xff0000})
      let curveObject = new THREE.Line(geometry, material)
      this.add(curveObject)
    }
  }

  initModelAnimation () {
    this.mesh.mixer = new THREE.AnimationMixer(this.mesh)
    this.mesh.mixer.clipAction(this.mesh.animations[0]).setDuration(5).play()
  }

  updateAnimation (delta) {
    this.mesh.mixer.update(delta)
    if (this.animationSpline) {
      this.currentPoint = this.animationSpline.getPoint(this.animationDelta)
      this.mesh.position.set(this.currentPoint.x, this.currentPoint.y, this.currentPoint.z)
      this.tangent = this.animationSpline.getTangent(this.animationDelta).normalize()
      this.rotationAxis.crossVectors(this.upVector, this.tangent).normalize()
      this.radians = Math.acos(this.upVector.dot(this.tangent))
      this.mesh.quaternion.setFromAxisAngle(this.rotationAxis, this.radians)
      this.animationDelta += (this.cruisingSpeed * delta)
      this.animationDelta = (this.animationDelta > 1) ? 0 : this.animationDelta
      this.animationDelta = (this.animationDelta < 0) ? 1 : this.animationDelta
    }
  }
}
