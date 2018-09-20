/*
* GLOBAL
*/
export const PageHeightMultiplyer = 5 // Multiply / Divide scrollTop and sceneDepth
export const SceneDepth = 40000 // from first section to last one
export const SectionsMargin = 0.1 // Percent margins between each Sections, actually equal to SceneDepth * SectionsMargin
export const SeaSurfaceColorCode = 0x014d74 // environment color at the surface of the sea
export const SeaBottomColorCode = 0x0e293c // environment color at the bottom of the sea
export const FogDensity = 0.0005 // environment fog density
export const TexturesPath = 'textures/' // textures folder
export const ModelsPath = 'models/' // 3D models folder
export const HdrEnvTexturePath = 'textures/environmentmap/' // HDR texture for environment map
export const NightOpacity = 0.2

/*
* CAMERA
*/
export const CameraFOV = 50 // Camera frustum vertical field of view
export const CameraNearPlane = 1 // Camera frustum near plane
export const CameraFarPlane = 5000 // Camera frustum far plane
export const CameraRotationEaseFactor = 0.1 // How much the camera rotation is slowed down
export const CameraRotationRestrictFactor = 0.3 // we don't want user to be able to watch 3D space all around
export const InitialCameraDistance = 3000 // Initial camera distance from first section
export const CameraDistanceToSection = 750 // Distance between current section and camera
export const InitialCameraTweenDuration = 6 // After intro, automatic tween to first section

/*
* ENVIRONMENT
*/
export const PlanktonParticleMapPath = TexturesPath + 'particles/'
export const PlanktonParticleCount = 5000
export const PlanktonParticleMapCount = 3
export const TerrainModelPath = ModelsPath + 'environment/environment.fbx'
export const TerrainRockMap = ModelsPath + 'environment/rock.jpg'
export const SandCoralMap = ModelsPath + 'environment/sand.jpg'
export const SharkPathName = 'shark_spline'
export const TurtlePathName = 'turtle_spline'

export const SharkModelPath = ModelsPath + 'shark/riggedshark.fbx'
export const SharkDiffuseMap = ModelsPath + 'shark/shark_diffuse.jpg'
export const SharkGlossinessMap = ModelsPath + 'shark/shark_glossiness.gif'

export const TurtleModelPath = ModelsPath + 'turtle/riggedturtle.fbx'
export const TurtleDiffuseMap = ModelsPath + 'turtle/turtle_diffuse.jpg'
export const TurtleGlossinessMap = ModelsPath + 'turtle/turtle_glossiness.gif'

export const BreamModelPath = ModelsPath + 'bream/riggedbream.fbx'
export const BreamDiffuseMap = ModelsPath + 'bream/bream_diffuse.jpg'

export const FishModelPath = ModelsPath + 'fish/fish.obj'
export const FishTexture = ModelsPath + 'fish/fish.jpg'

/*
* WATCH SECTION
*/
export const WatchModelPath = ModelsPath + 'watch/model.obj'
export const WatchTexturesPath = ModelsPath + 'watch/'
export const WatchDiffuseMap = 'Watch_A.jpg'
export const WatchMetalnessMap = 'Watch_RM.png'
export const WatchEmissiveMap = 'Watch_EM.png'
export const MarginBetweenWatchAndText = 0.02 // percent of screen width

/*
* FINAL SECTION
*/

/*
* EVENTS
*/
export const SEA_BOTTOM_REACHED = 'seabottomreached'
export const SEA_BOTTOM_LEAVED = 'seabottomleaved'
export const SHARK_PATH_LOADED = 'sharkpathloaded'
export const TURTLE_PATH_LOADED = 'turtlepathloaded'
export const ENVIRONMENT_MAP_LOADED = 'environmentmaploaded'
export const OPEN_VUE = 'openvue'
