import * as dat from 'dat.gui'
class GuiManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static addFolder (name) {
    try {
      return GuiManager.gui.addFolder(name)
    } catch (error) {
      let newName = name + GuiManager.getUniqueID()
      // eslint-disable-next-line
      console.warn('You already have a folder in this GUI by the name "' + name + '", renamed : ' + newName)
      return GuiManager.gui.addFolder(newName)
    }
  }

  static add (...params) {
    return GuiManager.gui.add(...params)
  }

  static getUniqueID () {
    return '_' + Math.random().toString(36).substr(2, 9)
  }
}

GuiManager.gui = new dat.GUI({closed: true})
GuiManager.gui.close()
GuiManager.gui.domElement.className = GuiManager.gui.domElement.className + ' gui'

export default GuiManager
