import * as dat from 'dat.gui'
class GuiManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static addFolder (name) {
    return GuiManager.gui.addFolder(name)
  }
}

GuiManager.gui = new dat.GUI()

export default GuiManager
