import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cameraDummy: null,
    stageSize: null,
    vrMode: false
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
    }
  },
  getters: {
    vrModeActivated: state => {
      return state.vrMode
    }
  }
})

export default store
