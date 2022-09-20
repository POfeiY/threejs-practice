import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stats from './stats'

const gui = new GUI()
export const hideGUI = () => gui.hide()
export const showGUI = () => gui.show()
let isGUIInit = false
export const sunSolarSystem = (canvas) => {
  // create renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  // create scene
  const scene = new THREE.Scene()
  // rotating object array
  const rotatingObjects = []
  // create sun
  const raduis = 1
  const widthSegments = 6
  const heightSegments = 6
  const sphereGeometry = new THREE.SphereGeometry(raduis, widthSegments, heightSegments)
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 })
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  // scale sun 5
  sunMesh.scale.set(5, 5, 5)
  // scene.add(sunMesh)
  // rotatingObjects.push(sunMesh)

  // create empty scene
  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)
  solarSystem.add(sunMesh)
  rotatingObjects.push(solarSystem)

  // create point light
  const color = 0xFFFFFF
  const intensity = 3
  const light = new THREE.PointLight(color, intensity)
  scene.add(light)

  // create earthOrbit
  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 10
  solarSystem.add(earthOrbit)
  rotatingObjects.push(earthOrbit)

  // create earth
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233FF,
    emissive: 0x112244,
  })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  // earthMesh.position.x = 10
  // scene.add(earthMesh)
  earthOrbit.add(earthMesh)
  rotatingObjects.push(earthMesh)

  // create moonOrbit
  const moonOrbit = new THREE.Object3D()
  moonOrbit.position.x = 2
  earthOrbit.add(moonOrbit)
  rotatingObjects.push(moonOrbit)

  // create moon
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  })
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
  moonMesh.scale.set(0.5, 0.5, 0.5)
  moonOrbit.add(moonMesh)
  rotatingObjects.push(moonMesh)

  // create camera
  const fov = 40
  const aspect = 2
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)

  // create orbitControl
  const controls = new OrbitControls(camera, canvas)
  controls.update()

  // resizer
  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize)
      renderer.setSize(width, height, false)

    return needResize
  }

  // render function
  const render = (time) => {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    rotatingObjects.forEach((obj) => {
      obj.rotation.y = time

      // const axes = new THREE.AxesHelper()
      // axes.material.depthTest = false
      // axes.renderOrder = 1
      // obj.add(axes)
    })

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  // create gui
  class AxisGridHelper {
    _visible
    grid
    constructor(node, units = 10) {
      const axes = new THREE.AxesHelper()
      axes.material.depthTest = false
      axes.renderOrder = 2 // 在网格渲染之后再渲染
      node.add(axes)

      const grid = new THREE.GridHelper(units, units)
      grid.material.depthTest = false
      grid.renderOrder = 1
      node.add(grid)

      this.grid = grid
      this.axes = axes
      this.visible = false
    }

    get visible() {
      return this._visible
    }

    set visible(v) {
      this._visible = v
      this.grid.visible = v
      this.axes.visible = v
    }
  }
  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
  }

  makeAxisGrid(solarSystem, 'solarSystem', 25)
  makeAxisGrid(sunMesh, 'sunMesh')
  makeAxisGrid(earthOrbit, 'earthOrbit')
  makeAxisGrid(earthMesh, 'earthMesh')
  makeAxisGrid(moonOrbit, 'moonOrbit')
  makeAxisGrid(moonMesh, 'moonMesh')
}

export const PorcheRender = (canvas) => {
  const wheels = []

  // create renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(render)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.85

  window.addEventListener('resize', onWindowResize)

  const stats = new Stats()
  document.querySelector('#app')?.appendChild(stats.dom)
  // create camera
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(4.25, 1.4, -4.5)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.maxDistance = 9
  controls.target.set(0, 0.5, 0)
  controls.update()

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x333333)
  scene.environment = new RGBELoader().load(new URL('../textures/venice_sunset_1k.hdr', import.meta.url).href, (texture) => {
    console.log(texture)
  })
  scene.environment.mapping = THREE.EquirectangularReflectionMapping
  scene.fog = new THREE.Fog(0x333333, 10, 15)

  const grid = new THREE.GridHelper(20, 40, 0xFFFFFF, 0xFFFFFF)
  grid.material.opacity = 0.2
  grid.material.depthWrite = false
  grid.material.transparent = true
  scene.add(grid)

  class ColorGUIHelper {
    constructor(object, key) {
      this.object = object
      this.key = key
    }

    get value() {
      return `#${this.object[this.key].getHexString()}`
    }

    set value(hexString) {
      this.object[this.key] = new THREE.Color(hexString)
    }
  }
  const bodyMaterialColor = new THREE.Color('red')
  const detailMaterialColor = new THREE.Color(0xFFFFFF)
  const glassMaterialColor = new THREE.Color(0xFFFFFF)

  // material
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: bodyMaterialColor,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    sheen: 0.5, // 光泽
  })
  const detailMaterial = new THREE.MeshStandardMaterial({
    color: detailMaterialColor,
    metalness: 1.0,
    roughness: 0.5,
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: glassMaterialColor,
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0, // 穿透性
  })

  if (!isGUIInit) {
    isGUIInit = true
    gui.addColor(new ColorGUIHelper(bodyMaterial, 'color'), 'value').name('bodyMaterialColor')
    gui.addColor(new ColorGUIHelper(detailMaterial, 'color'), 'value').name('detailMaterialColor')
    gui.addColor(new ColorGUIHelper(glassMaterial, 'color'), 'value').name('glassMaterialColor')
  }

  // car glTF
  const shadow = new THREE.TextureLoader().load(new URL('../glTF/ferrari_ao.png', import.meta.url).href)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/gltf/')

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  loader.load(new URL('../glTF/ferrari.glb', import.meta.url).href, (gltf) => {
    const carModel = gltf.scene.children[0]
    carModel.getObjectByName('body').material = bodyMaterial

    carModel.getObjectByName('rim_fl').material = detailMaterial
    carModel.getObjectByName('rim_fr').material = detailMaterial
    carModel.getObjectByName('rim_rr').material = detailMaterial
    carModel.getObjectByName('rim_rl').material = detailMaterial
    carModel.getObjectByName('trim').material = detailMaterial

    carModel.getObjectByName('glass').material = glassMaterial

    wheels.push(
      carModel.getObjectByName('wheel_fl'),
      carModel.getObjectByName('wheel_fr'),
      carModel.getObjectByName('wheel_rr'),
      carModel.getObjectByName('wheel_rl'),
    )

    // shadow
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadow,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
      }),
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.renderOrder = 2
    carModel.add(mesh)
    scene.add(carModel)
  }, (progress) => {
    if (progress.lengthComputable && progress.loaded / progress.total === 1)
      console.log('load complete')
  })

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  function render() {
    controls.update()
    const time = -performance.now() * 0.001
    for (let index = 0; index < wheels.length; index++)
      wheels[index].rotation.x = time * Math.PI * 2
    grid.position.z = -(time) % 1
    renderer.render(scene, camera)
    stats.update()
  }
}

export { gui }
