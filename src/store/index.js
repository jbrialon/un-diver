import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loadingPercent: 0,
    loadingComplete: false,
    initDiving: false,
    render3dExperience: false,
    cameraDummy: null,
    stageSize: null,
    vrMode: false,
    nightMode: false,
    currentSectionId: undefined,
    goToSectionId: undefined,
    menuMobile: false,
    viewportSizeAtCameraFocus: undefined,
    showUI: false
  },
  mutations: {
    initDiving (state) {
      state.initDiving = true
    },
    render3dExperience (state) {
      state.render3dExperience = true
    },
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
    },
    toggleUI (state) {
      state.showUI = !state.showUI
    },
    setViewportSizeAtCameraFocus (state, object) {
      state.viewportSizeAtCameraFocus = object
    },
    loadingPercent (state, value) {
      state.loadingPercent = value
    },
    loadingComplete (state) {
      state.loadingComplete = true
    }
  },
  getters: {
    initDiving: state => {
      return state.initDiving
    },
    render3dExperience: state => {
      return state.render3dExperience
    },
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
    },
    uiActivated: state => {
      return state.showUI
    },
    viewportSizeAtCameraFocus: state => {
      return state.viewportSizeAtCameraFocus
    },
    loadingPercent: state => {
      return state.loadingPercent
    },
    loadingComplete: state => {
      return state.loadingComplete
    }
  }
})

export default store
