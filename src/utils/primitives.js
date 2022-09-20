import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export const createPrimitives = (canvas) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 500)
  camera.position.z = 50

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000)

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
    light.position.set(1, -2, -4)
    scene.add(light)
  }

  const objects = []
  const spread = 15

  const addObject = (x, y, obj) => {
    obj.position.x = x * spread
    obj.position.y = y * spread

    scene.add(obj)
    objects.push(obj)
  }

  const createMaterial = () => {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    })

    const hue = Math.random()
    const saturation = 1
    const luminance = 0.5
    material.color.setHSL(hue, saturation, luminance)

    return material
  }

  const addSolidGeometry = (x, y, geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material || createMaterial())
    addObject(x, y, mesh)
  }

  {
    const width = 8
    const height = 8
    const depth = 8
    addSolidGeometry(-2, 0, new THREE.BoxGeometry(width, height, depth))
  }

  {
    const radius = 7
    const segments = 24
    addSolidGeometry(-1, 0, new THREE.CircleGeometry(radius, segments))
  }

  {
    const radius = 7
    const widthSegments = 12
    const heightSegments = 12
    addSolidGeometry(0, 0, new THREE.SphereGeometry(radius, widthSegments, heightSegments))
  }

  {
    const loader = new FontLoader()
    // promisify font loading
    const loadFont = (url) => {
      return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })
    }

    async function doit() {
      const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')
      const geometry = new TextGeometry('XZH', {
        font,
        size: 3.0,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
      })
      const mesh = new THREE.Mesh(geometry, createMaterial())
      geometry.computeBoundingBox()
      geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1)

      const parent = new THREE.Object3D()
      parent.add(mesh)

      addObject(1, 0, parent)
    }
    doit()
  }

  {
    const radius = 3.5
    const tube = 1.5
    const radialSegments = 8
    const tubularSegments = 64
    const p = 2
    const q = 3
    addSolidGeometry(2, 0, new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q), new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
    }))
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

  const render = (time) => {
    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    objects.forEach((obj, ndx) => {
      const speed = 0.1 + ndx * 0.05
      const rot = time * speed
      obj.rotation.x = rot
      obj.rotation.y = rot
    })

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
