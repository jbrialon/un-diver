import * as THREE from 'three'
import store from '@/store'

class LoadingManager {
  constructor (enforcer) {
    throw new Error('Cannot construct singleton')
  }

  static onStart = (url, itemsLoaded, itemsTotal) => {
  }
  static onProgress = (url, itemsLoaded, itemsTotal) => {
    store.commit('loadingPercent', itemsLoaded / itemsTotal)
  }
  static onError = (url) => {
    // eslint-disable-next-line
    console.warn( 'There was an error loading ' + url );
  }
  static onLoad = () => {
    store.commit('loadingComplete')
  }
}

LoadingManager.instance = new THREE.LoadingManager()
LoadingManager.instance.onStart = LoadingManager.onStart
LoadingManager.instance.onProgress = LoadingManager.onProgress
LoadingManager.instance.onError = LoadingManager.onError
LoadingManager.instance.onLoad = LoadingManager.onLoad

export default LoadingManager
