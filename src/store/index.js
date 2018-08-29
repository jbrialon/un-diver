import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cameraDummy: null,
    stageSize: null,
    vrMode: false,
    glowing: false,
    currentSectionId: undefined,
    goToSectionId: undefined
  },
  mutations: {
    toggleVrMode (state) {
      state.vrMode = !state.vrMode
    },
    setCameraDummy (state, object3D) {
      state.cameraDummy = object3D
    },
    setStageSize (state, object) {
      state.stageSize = object
    },
    setCurrentSectionId (state, id) {
      state.currentSectionId = id
    },
    goToSectionId (state, id) {
      state.goToSectionId = id
    },
    toggleGlowing (state) {
      state.glowing = !state.glowing
    }
  },
  getters: {
    vrModeActivated: state => {
      return state.vrMode
    },
    glowingActivated: state => {
      return state.glowing
    },
    currentSectionId: state => {
      return state.currentSectionId
    },
    goToSectionId: state => {
      return state.goToSectionId
    }
  }
})

export default store
