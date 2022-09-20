import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import Stats from './stats'
export const createStormTrooper = (canvas) => {
  let mixer
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const stats = new Stats()
  canvas.appendChild(stats.dom)

  const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(15, 10, -15)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.screenSpacePanning = true
  controls.minDistance = 5
  controls.maxDistance = 40
  controls.target.set(0, 2, 0)
  controls.update()

  window.addEventListener('resize', onWindowResize)

  const scene = new THREE.Scene()

  const clock = new THREE.Clock()
  const loader = new ColladaLoader()
  const image = new Image()
  image.src = new URL('../stormTrooper/Stormtrooper_D.jpg', import.meta.url).href
  loader.load(new URL('../stormTrooper/stormtrooper.dae', import.meta.url).href, (collada) => {
    const avatar = collada.scene
    const animations = avatar.animations
    avatar.traverse((node) => {
      if (node.isSkinnedMesh)
        node.frustumCulled = false
    })

    mixer = new THREE.AnimationMixer(avatar)
    mixer.clipAction(animations[0]).play()

    scene.add(avatar)
  })

  const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x444444)
  scene.add(gridHelper)

  // lights
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xFFFFFF, 0.8)
  scene.add(camera)
  camera.add(pointLight)

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function render() {
    const delta = clock.getDelta()
    if (mixer !== undefined)
      mixer.update(delta)
    renderer.render(scene, camera)
  }

  function animate() {
    requestAnimationFrame(animate)
    render()
    stats.update()
  }
  animate()
}
