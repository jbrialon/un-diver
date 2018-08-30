/*
* GLOBAL
*/
export const PageHeightMultiplyer = 5 // Multiply / Divide scrollTop and sceneDepth
export const SceneDepth = 35000 // from first section to last one
export const InitialCameraDistance = 3000 // Initial camera distance from first section
export const CameraDistanceToSection = 750 // Distance between current section and camera
export const SeaSurfaceColorCode = 0x014d74 // environment color at the surface of the sea
export const SeaBottomColorCode = 0x0e293c // environment color at the bottom of the sea
export const FogDensity = 0.0005 // environment fog density
export const ModelsPath = 'models/' // 3D models folder
export const HdrEnvTexturePath = 'textures/environmentmap/' // HDR texture for environment map
export const NightOpacity = 0.2

/*
* CAMERA
*/
export const CameraFOV = 50
export const CameraNearPlane = 1
export const CameraFarPlane = 5000

/*
* ENVIRONMENT
*/
export const TerrainModelPath = ModelsPath + 'environment.fbx'
export const SharkModelPath = ModelsPath + 'shark.fbx'
export const TurtleModelPath = ModelsPath + 'turtle.fbx'
export const DiverModelPath = ModelsPath + 'diver.fbx'

/*
* WATCH SECTION
*/
export const WatchModelPath = ModelsPath + 'watch/model.obj'
export const WatchTexturesPath = ModelsPath + 'watch/'
export const WatchDiffuseMap = 'Watch_A.jpg'
export const WatchMetalnessMap = 'Watch_RM.png'
export const WatchEmissiveMap = 'Watch_EM.png'

/*
* BOUTIQUE SECTION
*/
export const BoutiqueImage = require('./assets/boutique/moscow.jpg')
