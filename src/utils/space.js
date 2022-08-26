import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const createSpace = (canvas) => {
  const renderer = new THREE.WebGLRenderer({ canvas })

  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 3

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()

  const scene = new THREE.Scene()

  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  {
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load([
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
    ])
    scene.background = texture
  }
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize)
      renderer.setSize(width, height, false)

    return needResize
  }

  function render() {
    // time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * .1;
    //   const rot = time * speed;
    //   cube.rotation.x = rot;
    //   cube.rotation.y = rot;
    // });

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
