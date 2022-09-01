import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

export const createPointerLockControls = (blockLayer, helperLayer, container) => {
  // init global varibles
  const objects = []
  let moveForward = false
  let moveBackward = false
  let moveLeft = false
  let moveRight = false
  let canJump = false

  let prevTime = performance.now()

  const velocity = new THREE.Vector3()
  const direction = new THREE.Vector3()
  // top edge point
  const vertex = new THREE.Vector3()
  const color = new THREE.Color()

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 10
  // init scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  scene.fog = new THREE.Fog(0xFFFFFF, 0, 750)
  // init light
  const light = new THREE.HemisphereLight(0xEEEEFF, 0x777788, 0.75)
  light.position.set(0.5, 1, 0.75)
  scene.add(light)

  // init controls
  const controls = new PointerLockControls(camera, container)
  // bind helperLayer click-event handler
  helperLayer.addEventListener('click', () => {
    controls.lock()
  })
  // bind controls event handler
  controls.addEventListener('lock', () => {
    blockLayer.style.display = 'none'
    helperLayer.style.display = 'none'
  })
  controls.addEventListener('unlock', () => {
    blockLayer.style.display = 'block'
    helperLayer.style.display = ''
  })

  scene.add(controls.getObject())

  // bind document event-handler
  document.addEventListener('keydown', (evt) => {
    switch (evt.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true
        break

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true
        break

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true
        break

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true
        break

      case 'Space':
        if (canJump === true)
          velocity.y += 350
        canJump = false
        break

      default:
        break
    }
  })
  // bind document event-handler
  document.addEventListener('keyup', (evt) => {
    switch (evt.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false
        break

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false
        break

      case 'ArrowLeft':
      case 'Key':
        moveLeft = false
        break

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false
        break

      default:
        break
    }
  })

  const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)
  // init floor
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
  floorGeometry.rotateX(-Math.PI / 2)
  let position = floorGeometry.attributes.position

  for (let index = 0; index < position.count; index++) {
    vertex.fromBufferAttribute(position, index)
    vertex.x += Math.random() * 20 - 10
    vertex.y += Math.random() * 2
    vertex.z += Math.random() * 20 - 10
    position.setXYZ(index, vertex.x, vertex.y, vertex.z)
  }
  // ensure each face has unique vertices
  floorGeometry = floorGeometry.toNonIndexed()

  position = floorGeometry.attributes.position
  // init color-floor
  const colorFloor = []
  for (let index = 0; index < position.count; index++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    colorFloor.push(color.r, color.g, color.b)
  }
  floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorFloor, 3))
  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)

  scene.add(floor)

  // init boxGeometry
  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed()
  position = boxGeometry.attributes.position
  const colorsBox = []
  for (let index = 0; index < position.count; index++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    colorsBox.push(color.r, color.g, color.b)
  }
  boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3))

  for (let index = 0; index < 506; index++) {
    const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xFFFFFF, flatShading: true, vertexColors: true })
    boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20

    scene.add(box)
    objects.push(box)
  }
  // init renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize)

  const animate = () => {
    requestAnimationFrame(animate)
    const time = performance.now()
    if (controls.isLocked === true) {
      raycaster.ray.origin.copy(controls.getObject().position)
      raycaster.ray.origin.y -= 10

      const intersections = raycaster.intersectObjects(objects, false)

      const onObject = intersections.length > 0

      const delta = (time - prevTime) / 1000
      velocity.x -= velocity.x * 10.0 * delta
      velocity.z -= velocity.z * 10.0 * delta
      velocity.y -= 9.8 * 100.0 * delta // >=100.0 = mass

      direction.z = Number(moveForward) - Number(moveBackward)
      direction.x = Number(moveRight) - Number(moveLeft)
      direction.normalize() // ensures consistent movements in all directions

      if (moveBackward || moveForward)
        velocity.z -= direction.z * 400 * delta
      if (moveLeft || moveRight)
        velocity.x -= direction.x * 400 * delta

      if (onObject) {
        velocity.y = Math.max(0, velocity.y)
        canJump = true
      }

      controls.moveRight(-velocity.x * delta)
      controls.moveForward(-velocity * delta)

      controls.getObject().position.y += (velocity.y * delta) // update new behavior

      if (controls.getObject().position.y < 10) {
        velocity.y = 0
        controls.getObject().position.y = 10
        canJump = true
      }
    }
    prevTime = time
    renderer.render(scene, camera)
  }

  animate()
}
