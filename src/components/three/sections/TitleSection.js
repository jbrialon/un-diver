/*
* Section with only a Text inside
*/
import Section from '../Section.js'
import Fader from '../behaviors/Fader.js'
import CanvasText from '../../../utils/CanvasText.js'

export default class TitleSection extends Section {
  text = ''
  mesh

  constructor (sectionData) {
    super(sectionData)
    this.text = this.sectionData.text
    this.mesh = CanvasText.getTextMesh(this.text, {
      fontSize: 80,
      font: '80px Arial, sans-serif',
      textAlign: 'center',
      verticalAlign: 'middle',
      color: 'rgba(255,255,255,1)',
      allowNewLine: true,
      lineHeight: 1
    })
    this.mesh.scale.set(0.5, 0.5, 0.5)
    super.add(this.mesh)
    Object.assign(
      this.mesh,
      new Fader(this.mesh)
    )
  }
}
