import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export const createGLTFLodaer = (canvas) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = THREE.sRGBEncoding
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20)
  camera.position.set(-1.8, 0.6, 2.7)

  const scene = new THREE.Scene()
  const render = () => {
    renderer.render(scene, camera)
  }

  new RGBELoader()
    .load(new URL('../assets/royal_esplanade_1k.hdr', import.meta.url).href, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping

      scene.background = texture
      scene.environment = texture

      render()

      // get texture image
      const image1 = new Image()
      image1.src = new URL('../glTF/DamagedHelmet/Default_albedo.jpg', import.meta.url).href
      const image2 = new Image()
      image2.src = new URL('../glTF/DamagedHelmet/Default_AO.jpg', import.meta.url).href
      const image3 = new Image()
      image3.src = new URL('../glTF/DamagedHelmet/Default_emissive.jpg', import.meta.url).href
      const image4 = new Image()
      image4.src = new URL('../glTF/DamagedHelmet/Default_metalRoughness.jpg', import.meta.url).href
      const image5 = new Image()
      image5.src = new URL('../glTF/DamagedHelmet/Default_normal.jpg', import.meta.url).href
      // get model
      const loader = new GLTFLoader()
      loader.load(new URL('../glTF/DamagedHelmet/DamageHelmet.gltf', import.meta.url).href, (gltf) => {
        scene.add(gltf.scene)

        render()
      })
    })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render) // use if there is no animation loop
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, -0.2)
  controls.update()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    render()
  })
}
