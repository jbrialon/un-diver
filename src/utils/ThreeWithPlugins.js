import * as THREEJS from 'three'

/*
* REFLECTANCE
*/
import '@/reflectance/PMREMGenerator.js'
import '@/reflectance/PMREMCubeUVPacker.js'

/*
* CURVES
*/
import '@/curves/NURBSCurve'
import '@/curves/NURBSUtils'
import '@/curves/NURBSSurface'

/*
* LOADERS
*/
import '@/loaders/OBJLoader.js'
import '@/loaders/RGBELoader.js'
import '@/loaders/HDRCubeTextureLoader.js'

let THREE = THREEJS
export default THREE
