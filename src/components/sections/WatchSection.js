import GuiManager from '../../utils/GuiManager'
import Section from '../Section.js'
import * as THREE from 'three'
import FBXLoader from 'three-fbxloader-offical'
import CanvasText from '../../utils/CanvasText'
import Button from '../Button'
import Fader from '../Fader'

export default class WatchSection extends Section {
    watch2DMesh
    watch3DModelPath = 'diver_watch_blue_LOW.fbx'
    watch3DModel
    infoButton
    buyButton
    watch3DModelVisible = true

    constructor (sectionData) {
      super(sectionData)

      let loader = new FBXLoader()
      loader.load(this.watch3DModelPath, (object) => this.onWatchModelLoaded(object))

      let texture = new THREE.TextureLoader().load(this.sectionData.texturePath)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      // TODO : review texture offset and aspect ratio handling
      texture.repeat.set(0.5, 1)
      texture.offset.set(0.25, 0)
      texture.minFilter = THREE.LinearFilter
      let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
      let geometry = new THREE.PlaneGeometry(window.AppStageSize.width * 0.5, window.AppStageSize.width * 0.533333)
      this.watch2DMesh = new THREE.Mesh(geometry, material)
      this.watch2DMesh.position.x = -window.AppStageSize.width * 0.15
      this.watch2DMesh.position.z = 20
      super.add(this.watch2DMesh)

      this.addTitle()

      this.infoButton = new Button('More information', 'toto.com')
      this.infoButton.position.x = window.AppStageSize.width * 0.15
      this.infoButton.position.y = -window.AppStageSize.height * 0.1
      // super.add(this.infoButton)

      this.buyButton = new Button('Buy', 'toto.com')
      this.buyButton.position.x = window.AppStageSize.width * 0.15
      this.buyButton.position.y = -window.AppStageSize.height * 0.2
      // super.add(this.buyButton)

      return Object.assign(
        this,
        new Fader(this)
      )
    }

    initGUI () {
      GuiManager.add(this, 'watch3DModelVisible').name('Watch 3D Model').onFinishChange(() => this.toggle3D())
    }

    toggle3D () {
      this.watch2DMesh.visible = !this.watch3DModelVisible
      this.watch3DModel.visible = this.watch3DModelVisible
    }

    onWatchModelLoaded (object) {
      // TODO : handle correctly sizing and positioning
      this.watch3DModel = object
      let modelScale = 10 - (1000 / window.AppStageSize.width)
      this.watch3DModel.scale.set(modelScale, modelScale, modelScale)
      this.watch3DModel.position.x = -200 * (modelScale / 7)
      super.add(this.watch3DModel)
      this.initGUI()
      this.toggle3D()
    }

    addTitle () {
      let texture = new THREE.Texture(
        CanvasText.getText(this.sectionData.title, 50, 'Arial', 'rgba(255,255,255,1)', 'center', 'middle')
      )
      texture.needsUpdate = true
      texture.minFilter = THREE.LinearFilter
      let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, visible: true })
      let geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height)
      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(texture.image.width * 0.5, 0, 0))
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = 10
      mesh.position.x = window.AppStageSize.width * 0.1
      // mesh.rotation.y = THREE.Math.degToRad(-25)
      super.add(mesh)
    }
}
