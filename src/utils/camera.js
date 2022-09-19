import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MinMaxGUIHelper } from '~/composables/helper.js'
// handler GUI
const gui = new GUI()
let isGUIInit = false
export const hideGUI = () => gui.hide()
export const showGUI = () => gui.show()
export const createPerspectiveCamera = (canvas, viewLeft, viewRight) => {
  const renderer = new THREE.WebGLRenderer({ canvas })

  const cameraOptions = {
    fov: 45, aspect: 2, near: 5, far: 100,
  }
  const camera = new THREE.PerspectiveCamera(cameraOptions.fov, cameraOptions.aspect, cameraOptions.near, cameraOptions.far)
  camera.position.set(0, 10, 20)

  const cameraHelper = new THREE.CameraHelper(camera)

  const updateCamera = () => {
    camera.updateProjectionMatrix()
  }

  if (!isGUIInit) {
    isGUIInit = true
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
  }

  // orbitControl
  const controls = new OrbitControls(camera, viewLeft)
  controls.target.set(0, 5, 0)
  controls.update()

  // create camera2
  const camera2 = new THREE.PerspectiveCamera(
    60,
    2,
    0.1,
    500,
  )
  camera2.position.set(40, 10, 30)
  camera2.lookAt(0, 5, 0)

  const controls2 = new OrbitControls(camera2, viewRight)
  controls2.target.set(0, 5, 0)
  controls2.update()

  // create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  scene.add(cameraHelper)

  // create space plain
  { const planeSize = 48
    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh) }

  // create cube
  {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }

  // create light
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }

  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize)
      renderer.setSize(width, height, false)
    return needResize
  }

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom)
    const top = Math.max(elemRect.top, canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    // apsect
    return width / height
  }

  function render() {
    // if (resizeRendererToDisplaySize(renderer)) {
    //   const canvas = renderer.domElement
    //   camera.aspect = canvas.clientWidth / canvas.clientHeight
    //   camera.updateProjectionMatrix()
    // }
    // renderer.render(scene, camera)

    resizeRendererToDisplaySize(renderer)

    // turn on scissor
    renderer.setScissorTest(true)

    // render original view
    {
      const aspect = setScissorForElement(viewLeft)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()

      cameraHelper.visible = false

      scene.background.set(0x000000)

      renderer.render(scene, camera)
    }

    {
      const aspect = setScissorForElement(viewRight)
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()

      cameraHelper.visible = true

      scene.background.set(0x000040)

      renderer.render(scene, camera2)
    }

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

export const createOrthographicCamera = (canvas, viewLeft, viewRight) => {
  const renderer = new THREE.WebGLRenderer({ canvas })

  const left = -1
  const right = 1
  const top = 1
  const bottom = -1
  const near = 5
  const far = 50
  const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
  camera.zoom = 0.2
  camera.position.set(0, 10, 20)

  const cameraHelper = new THREE.CameraHelper(camera)

  const gui_ortho = new GUI()
  gui_ortho.add(camera, 'zoom', 0.01, 1, 0.01).listen()
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
  gui_ortho.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
  gui_ortho.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')

  // orbitControl
  const controls = new OrbitControls(camera, viewLeft)
  controls.target.set(0, 5, 0)
  controls.update()

  // create camera2
  const camera2 = new THREE.PerspectiveCamera(
    60,
    2,
    0.1,
    500,
  )
  camera2.position.set(40, 10, 30)
  camera2.lookAt(0, 5, 0)

  const controls2 = new OrbitControls(camera2, viewRight)
  controls2.target.set(0, 5, 0)
  controls2.update()

  // create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  scene.add(cameraHelper)

  // create space plain
  { const planeSize = 48
    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    scene.add(mesh) }

  // create cube
  {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }

  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
  }

  // create light
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }

  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize)
      renderer.setSize(width, height, false)
    return needResize
  }

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom)
    const top = Math.max(elemRect.top, canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    // apsect
    return width / height
  }

  function render() {
    resizeRendererToDisplaySize(renderer)

    // turn on scissor
    renderer.setScissorTest(true)

    // render original view
    {
      const aspect = setScissorForElement(viewLeft)
      camera.left = -aspect
      camera.right = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()

      cameraHelper.visible = false

      scene.background.set(0x000000)

      renderer.render(scene, camera)
    }

    {
      const aspect = setScissorForElement(viewRight)
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()

      cameraHelper.visible = true

      scene.background.set(0x000040)

      renderer.render(scene, camera2)
    }

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

