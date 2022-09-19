import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export const createHelloCib = (canvas) => {
  const objects = []
  const spread = 15
  // create renderer
  const renderer = new THREE.WebGLRenderer({ canvas })

  // configure camera
  const fov = 40
  const aspect = 2
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 40

  // create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xAAAAAA)

  // create orbitControl for rotate camera around origin
  const controls = new OrbitControls(camera, canvas)
  controls.update()

  // 常见对称方向光源*2
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(1, -2, 4)
    scene.add(light)
  }

  const rotateObject = (x, y, obj) => {
    obj.position.x = x * spread
    obj.position.y = y * spread

    scene.add(obj)
    objects.push(obj)
  }

  // create material 创建字体材质
  const createMaterial = () => {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    })
    const random = Math.random()
    const saturation = 1
    const lumunance = 0.5
    material.color.setHSL(random, saturation, lumunance)
    return material
  }

  // create geometry
  const addGeometry = (x, y, geometry) => {
    const mesh = new THREE.Mesh(geometry, createMaterial())
    rotateObject(x, y, mesh)
  }

  // create loader
  const loader = new FontLoader()
  const loadFont = (url) => {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject)
    })
  }

  async function helloing() {
    // loader font 装载字体
    const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')
    // 绘制字形体
    const geometry = new TextGeometry(
      'Hello CIB',
      {
        font,
        size: 3.0,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true, // 是否使用斜切角
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
      },
    )
    // load 挂载到场景画布中
    addGeometry(-0.5, 0, geometry)
  }

  helloing()

  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize)
      renderer.setSize(width, height, false)

    return needResize
  }

  // loop render 渲染动画
  const render = (time) => {
    const delta = time / 1000

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    objects.forEach((o, i) => {
      const speed = 0.5 + i * 0.05
      const rot = delta * speed
      // o.rotation.x = rot
      o.rotation.y = rot
      // o.rotation.z = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
