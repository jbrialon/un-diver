/*
* Section with alternative Watch models description inside
*/
import store from '@/store'
import * as THREE from 'three'
import Section from '@/components/three/Section.js'
import Fader from '@/components/three/behaviors/Fader.js'
import Button from '@/components/three/Button'
import LoadingManager from '@/utils/LoadingManager'

export default class OtherModelsSection extends Section {
  sectionWidth = 0.45 // 75% of screen width
  modelScaleFactor = 0.7
  models = []
  modelsMesh = []
  textureLoader = new THREE.TextureLoader(LoadingManager.instance)

  constructor (sectionData) {
    super(sectionData)
    this.models = this.sectionData.watches
    // Init modelsMesh with null values to have a fixed order for models mesh
    this.modelsMesh = Array(this.models.length).fill(null)
    this.models.forEach((watch, index) => {
      this.textureLoader.load(watch.texture, texture => {
        texture.minFilter = THREE.LinearFilter
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
        const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
        const modelMesh = new THREE.Mesh(geometry, material)
        modelMesh.matrixAutoUpdate = false
        this.modelsMesh[index] = modelMesh
        Object.assign(
          modelMesh,
          new Fader(modelMesh)
        )
        this.add(modelMesh)

        let findAStoreBtn = new Button('other-models-section-button-' + watch.id)
        findAStoreBtn.position.y = -texture.image.height * 0.55
        findAStoreBtn.setAutoDisplayMode(1700)
        modelMesh.add(findAStoreBtn)
        this.resize()
      })
    })
  }
  resize () {
    super.resize()
    let xPos = 0
    let zPos = 0
    let meshBoundingBox = new THREE.Vector3()
    let viewportSize = store.state.viewportSizeAtCameraFocus
    let itemIndex = 0
    let isPortrait = viewportSize.width < viewportSize.height
    let itemPadding = isPortrait ? 0 : (viewportSize.width * this.sectionWidth) / (this.modelsMesh.length - 1)
    itemPadding = Math.min(itemPadding, 345)
    // TODO: improve modelsMesh order
    // the order is handled by loader not data order
    this.modelsMesh
      // filter null values because modelsMesh is a fix length array
      .filter(modelMesh => modelMesh !== null)
      .forEach(modelMesh => {
        modelMesh.geometry.computeBoundingBox()
        modelMesh.geometry.boundingBox.getSize(meshBoundingBox)
        xPos = (itemIndex % 2 === 0) ? -itemPadding : itemPadding
        zPos = -(this.depth / (this.modelsMesh.length - 1)) * itemIndex
        this.modelScaleFactor = isPortrait ? 0.25 : 0.7
        modelMesh.position.set(xPos, 0, zPos)
        modelMesh.scale.set(this.modelScaleFactor, this.modelScaleFactor, this.modelScaleFactor)
        modelMesh.updateMatrix()
        modelMesh.updateMatrixWorld()
        itemIndex++
      })
    this.matrix.setPosition(new THREE.Vector3(-xPos * 0.5, this.matrix.elements[13], this.matrix.elements[14])) // Fast way to set x position but leaving y and z values untouched
  }
}
