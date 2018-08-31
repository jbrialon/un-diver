import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cameraDummy: null,
    stageSize: null,
    vrMode: false,
    nightMode: false,
    currentSectionId: undefined,
    goToSectionId: undefined,
    menuMobile: false
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
    setNightMode (state, active) {
      state.nightMode = active
    },
    toggleMenuMobile (state) {
      state.menuMobile = !state.menuMobile
    }
  },
  getters: {
    vrModeActivated: state => {
      return state.vrMode
    },
    nightModeActivated: state => {
      return state.nightMode
    },
    currentSectionId: state => {
      return state.currentSectionId
    },
    goToSectionId: state => {
      return state.goToSectionId
    },
    menuMobileActivated: state => {
      return state.menuMobile
    }
  }
})

export default store
