import THREE from '@/utils/ThreeWithPlugins'
import * as CONST from '@/Constants'
import Boid from '@/components/three/fishes/Boid.js'
import LoadingManager from '@/utils/LoadingManager'
import AnimationLoopManager from '@/utils/AnimationLoopManager'

export default class FishManager extends THREE.Object3D {
  BIRTH_PLACE = new THREE.Vector3(1500, 300, -3000)
  NUM_FISH = 100
  fishes = []
  boids = []
  modelLoader = new THREE.OBJLoader(LoadingManager.instance)
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  neighborhoodRadius
  worldSize

  constructor (neighborhoodRadius, worldSize) {
    super()
    this.neighborhoodRadius = neighborhoodRadius
    this.worldSize = worldSize
    this.matrixAutoUpdate = false
    this.modelLoader.load(CONST.FishModelPath, this.onModelLoaded)
    this.fishMaterial = new THREE.MeshPhongMaterial()
    this.fishMaterial.map = this.textureLoader.load(CONST.FishTexture)

    AnimationLoopManager.addCallback(this.updateFishes)
  }

  onModelLoaded = (fishModel) => {
    this.populate(fishModel)
  }

  populate (fishModel) {
    fishModel.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = this.fishMaterial
        child.material.side = THREE.DoubleSide
        child.material.shininess = 100
        // child.material.color = new THREE.Color(0x555555)
      }
    })
    for (var i = 0; i < this.NUM_FISH; i++) {
      this.boids[i] = new Boid()
      let boid = this.boids[i]

      boid._neighborhoodRadius = this.neighborhoodRadius

      boid.position.x = Math.random() * this.worldSize.x * 2 - this.worldSize.x
      boid.position.y = Math.random() * this.worldSize.y * 2 - this.worldSize.y
      boid.position.z = -Math.random() * this.worldSize.z * 2 - this.worldSize.z
      boid.velocity.x = Math.random() * 2 - 1
      boid.velocity.y = Math.random() * 2 - 1
      boid.velocity.z = Math.random() * 2 - 1

      // boid.setGoal(window.AppCameraDummy.position)
      // boid.setGoalOffset(new THREE.Vector3(25, 15, -150))

      fishModel.scale.x = fishModel.scale.y = fishModel.scale.z = 3 + Math.random() * 2
      fishModel.rotation.y = -3.14 / 2

      var clone = fishModel.clone()
      var fish = new THREE.Group()
      fish.matrixAutoUpdate = false
      fish.add(clone)
      this.add(fish)
      this.fishes.push(fish)
    }
  }

  updateFishes = () => {
    // this.BIRTH_PLACE.z = window.AppCameraDummy.position.z
    for (var i = 0, imax = this.fishes.length; i < imax; i++) {
      let boid = this.boids[i]
      boid.run(this.boids)

      let fish = this.fishes[i]
      let fishMatrixElements = fish.matrix.elements
      let y = Math.atan2(-boid.velocity.z, boid.velocity.x)
      let z = Math.asin(boid.velocity.y / boid.velocity.length())

      let c = Math.cos(y)
      let d = Math.sin(y)
      let e = Math.cos(z)
      let f = Math.sin(z)

      let ae = e
      let af = f

      fishMatrixElements[ 0 ] = c * e
      fishMatrixElements[ 4 ] = -c * f
      fishMatrixElements[ 8 ] = d

      fishMatrixElements[ 1 ] = af
      fishMatrixElements[ 5 ] = ae

      fishMatrixElements[ 2 ] = -ae * d
      fishMatrixElements[ 6 ] = af * d
      fishMatrixElements[ 10 ] = c

      fishMatrixElements[ 12 ] = this.boids[i].position.x
      fishMatrixElements[ 13 ] = this.boids[i].position.y
      fishMatrixElements[ 14 ] = this.boids[i].position.z
    }
  }
}
