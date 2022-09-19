import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import * as dat from 'dat.gui'
import lineFragmentShader from '~/glsl/fragment.glsl'
import imgData from '~/assets/earth.jpg'

// create mock gui
const gui = new dat.GUI()
export const hideGui = () => {
  gui.hide()
}
export const createEarth = (canvas) => {
  let earth
  // create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  // create camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50)
  camera.position.set(0, 0, 15.5)
  // create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // post-edition
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const glitchPass = new GlitchPass()
  composer.addPass(glitchPass)

  // create controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false

  const params = {
    colors: { base: '#f9f002', gradInner: '#8ae66e', gradOuter: '#03c03c' },
    reset: () => { controls.reset() },
  }

  const maxImpactAmount = 10
  const impacts = []
  const trails = []

  const tweens = []

  // create trails path
  const setPath = (l, startPoint, endPoint, peakHeight, cycles) => {
    const pos = l.geometry.attributes.position
    const division = pos.count - 1
    const cycle = cycles || 1
    const peak = peakHeight || 1
    const radius = startPoint.length()
    const angle = startPoint.angleTo(endPoint)
    const arcLength = radius * angle
    const diameterMinor = arcLength / Math.PI
    const radiusMinor = (diameterMinor * 0.5) / cycle
    const peakRatio = peak / diameterMinor
    const radiusMajor = startPoint.length() + radiusMinor
    const basisMajor = new THREE.Vector3().copy(startPoint).setLength(radiusMajor)
    const basisMinor = new THREE.Vector3().copy(startPoint).negate().setLength(radiusMinor)
    const tri = new THREE.Triangle(startPoint, endPoint, new THREE.Vector3())
    const nrm = new THREE.Vector3()
    tri.getNormal(nrm)
    const v3Major = new THREE.Vector3()
    const v3Minor = new THREE.Vector3()
    const v3Inter = new THREE.Vector3()
    const vFinal = new THREE.Vector3()
    for (let i = 0; i <= division; i++) {
      const divisionRatio = i / division
      const angleValue = angle * divisionRatio
      v3Major.copy(basisMajor).applyAxisAngle(nrm, angleValue)
      v3Minor.copy(basisMinor).applyAxisAngle(nrm, angleValue + Math.PI * 2 * divisionRatio * cycle)
      v3Inter.addVectors(v3Major, v3Minor)
      const newLength = ((v3Inter.length() - radius) * peakRatio) + radius
      vFinal.copy(v3Inter).setLength(newLength)
      pos.setXYZ(i, vFinal.x, vFinal.y, vFinal.z)
    }
    pos.needsUpdate = true
    l.computeLineDistances()
    l.geometry.attributes.lineDistance.needsUpdate = true
    impacts[l.userData.idx].trailLength.value = l.geometry.attributes.lineDistance.array[99]
    l.material.dashSize = 3
  }

  // create trails
  const makeTrail = (index) => {
    const pts = new Array(100 * 3).fill(0)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const m = new THREE.LineDashedMaterial({
      color: params.colors.gradOuter,
      transparent: true,
      onBeforeCompile: (shader) => {
        shader.uniforms.actionRatio = impacts[index].trailRatio
        shader.uniforms.lineLength = impacts[index].trailLength
        shader.fragmentShader = lineFragmentShader
      },
    })
    const l = new THREE.Line(g, m)
    l.userData.idx = index
    setPath(l, impacts[index].prevPosition, impacts[index].impactPosition, 1)
    trails.push(l)
  }

  for (let index = 0; index < maxImpactAmount; index++) {
    impacts.push({
      impactPosition: new THREE.Vector3().random().subScalar(0.5).setLength(5),
      impactMaxRadius: 5 * THREE.Math.randFloat(0.5, 0.75),
      impactRatio: 0,
      prevPosition: new THREE.Vector3().random().subScalar(0.5).setLength(5),
      trailRatio: { value: 0 },
      trailLength: { value: 0 },
    })
    makeTrail(index)
  }

  const uniforms = {
    impacts: {
      value: impacts,
    },
    maxSize: {
      value: 0.04,
    },
    minSize: {
      value: 0.025,
    },
    waveHeight: {
      value: 0.1,
    },
    scaling: {
      value: 1,
    },
    gradInner: {
      value: new THREE.Color(params.colors.gradInner),
    },
    gradOuter: {
      value: new THREE.Color(params.colors.gradOuter),
    },
  }

  const makeGlobeOfPoints = () => {
    const dummyObj = new THREE.Object3D()
    const p = new THREE.Vector3()
    const sph = new THREE.Spherical()
    const geoms = []
    const tex = new THREE.TextureLoader().load(imgData)
    const counter = 75000
    const rad = 5
    let r = 0
    const dlong = Math.PI * (3 - Math.sqrt(5))
    const dz = 2 / counter
    let long = 0
    let z = 1 - dz / 2
    for (let i = 0; i < counter; i++) {
      r = Math.sqrt(1 - z * z)
      p.set(Math.cos(long) * r, z, -Math.sin(long) * r).multiplyScalar(rad)
      z = z - dz
      long = long + dlong
      sph.setFromVector3(p)
      dummyObj.lookAt(p)
      dummyObj.updateMatrix()
      const g = new THREE.PlaneGeometry(1, 1)
      g.applyMatrix4(dummyObj.matrix)
      g.translate(p.x, p.y, p.z)
      const centers = [
        p.x, p.y, p.z,
        p.x, p.y, p.z,
        p.x, p.y, p.z,
        p.x, p.y, p.z,
      ]
      const uv = new THREE.Vector2(
        (sph.theta + Math.PI) / (Math.PI * 2),
        1.0 - sph.phi / Math.PI,
      )
      const uvs = [
        uv.x, uv.y,
        uv.x, uv.y,
        uv.x, uv.y,
        uv.x, uv.y,
      ]
      g.setAttribute('center', new THREE.Float32BufferAttribute(centers, 3))
      g.setAttribute('baseUv', new THREE.Float32BufferAttribute(uvs, 2))
      geoms.push(g)
    }
    const g = mergeBufferGeometries(geoms)
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(params.colors.base),
      onBeforeCompile: (shader) => {
        shader.uniforms.impacts = uniforms.impacts
        shader.uniforms.maxSize = uniforms.maxSize
        shader.uniforms.minSize = uniforms.minSize
        shader.uniforms.waveHeight = uniforms.waveHeight
        shader.uniforms.scaling = uniforms.scaling
        shader.uniforms.gradInner = uniforms.gradInner
        shader.uniforms.gradOuter = uniforms.gradOuter
        shader.uniforms.tex = { value: tex }
        shader.vertexShader = `
          struct impact {
            vec3 impactPosition;
            float impactMaxRadius;
            float impactRatio;
          };
          uniform impact impacts[${maxImpactAmount}];
          uniform sampler2D tex;
          uniform float maxSize;
          uniform float minSize;
          uniform float waveHeight;
          uniform float scaling;
          attribute vec3 center;
          attribute vec2 baseUv;
          varying float vFinalStep;
          varying float vMap;
          ${shader.vertexShader}
        `.replace(
            '#include <begin_vertex>',
          `#include <begin_vertex>
          float finalStep = 0.0;
          for (int i = 0; i < ${maxImpactAmount};i++){
            float dist = distance(center, impacts[i].impactPosition);
            float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio;
            float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.25 * impacts[i].impactRatio ), curRadius, dist);
            sstep *= 1. - impacts[i].impactRatio;
            finalStep += sstep;
          }
          finalStep = clamp(finalStep, 0., 1.);
          vFinalStep = finalStep;
          float map = texture(tex, baseUv).g;
          vMap = map;
          float pSize = map < 0.5 ? maxSize : minSize;
          float scale = scaling;
          transformed = (position - center) * pSize * mix(1., scale * 1.25, finalStep) + center; // scale on wave
          transformed += normal * finalStep * waveHeight; // lift on wave
          `,
          )
        shader.fragmentShader = `
          uniform vec3 gradInner;
          uniform vec3 gradOuter;
          varying float vFinalStep;
          varying float vMap;
          ${shader.fragmentShader}
          `.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
          `
          // shaping the point, pretty much from The Book of Shaders
          vec2 hUv = (vUv - 0.5);
          int N = 8;
          float a = atan(hUv.x,hUv.y);
          float r = PI2/float(N);
          float d = cos(floor(.5+a/r)*r-a)*length(hUv);
          float f = cos(PI / float(N)) * 0.5;
          if (d > f) discard;
          vec3 grad = mix(gradInner, gradOuter, clamp( d / f, 0., 1.)); // gradient
          vec3 diffuseMap = diffuse * ((vMap > 0.5) ? 0.5 : 1.);
          vec3 col = mix(diffuseMap, grad, vFinalStep); // color on wave
          //if (!gl_FrontFacing) col *= 0.25; // moderate the color on backside
          vec4 diffuseColor = vec4( col , opacity );
          `,
          )
      },
    })
    m.defines = { USE_UV: '' }
    earth = new THREE.Mesh(g, m)
    earth.rotation.y = Math.PI
    trails.forEach((t) => { earth.add(t) })
    earth.position.set(0, -0.4, 0)
    scene.add(earth)
  }

  // animation tweens
  for (let i = 0; i < maxImpactAmount; i++) {
    tweens.push({
      runTween: () => {
        const path = trails[i]
        const speed = 3
        const len = path.geometry.attributes.lineDistance.array[99]
        const dur = len / speed
        const tweenTrail = new TWEEN.Tween({ value: 0 })
          .to({ value: 1 }, dur * 1000)
          .onUpdate((val) => {
            impacts[i].trailRatio.value = val.value
          })
        const tweenImpact = new TWEEN.Tween({ value: 0 })
          .to({ value: 1 }, THREE.Math.randInt(2500, 5000))
          .onUpdate((val) => {
            uniforms.impacts.value[i].impactRatio = val.value
          })
          .onComplete(() => {
            impacts[i].prevPosition.copy(impacts[i].impactPosition)
            impacts[i].impactPosition.random().subScalar(0.5).setLength(5)
            setPath(path, impacts[i].prevPosition, impacts[i].impactPosition, 1)
            uniforms.impacts.value[i].impactMaxRadius = 5 * THREE.Math.randFloat(0.5, 0.75)
            tweens[i].runTween()
          })
        tweenTrail.chain(tweenImpact)
        tweenTrail.start()
      },
    })
  }

  tweens.forEach((t) => { t.runTween() })
  makeGlobeOfPoints()
  // window bind resize-hanlder
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }, false)

  gui.add(uniforms.maxSize, 'value', 0.01, 0.06).step(0.001).name('land')
  gui.add(uniforms.minSize, 'value', 0.01, 0.06).step(0.001).name('sea')
  gui.add(uniforms.waveHeight, 'value', 0.1, 1).step(0.001).name('waveHeight')
  gui.add(uniforms.scaling, 'value', 1, 5).step(0.01).name('range')
  gui.addColor(params.colors, 'base').name('baseColor').onChange((val) => {
    earth && earth.material.color.set(val)
  })
  gui.addColor(params.colors, 'gradInner').name('gradientInner').onChange((val) => {
    uniforms.gradInner.value.set(val)
  })
  gui.addColor(params.colors, 'gradOuter').name('gradientInner').onChange((val) => {
    uniforms.gradOuter.value.set(val)
  })

  // gui.hide()

  renderer.setAnimationLoop((_) => {
    TWEEN.update()
    earth.rotation.y += 0.001
    renderer.render(scene, camera)
    // composer.render()
  })

  // const raycaster = new THREE.Raycaster()
  // const mouse = new THREE.Vector2()
  // window.addEventListener('dblclick', (event) => {
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  //   raycaster.setFromCamera(mouse, camera)
  //   const intersects = raycaster.intersectObjects(earth.children)
  //   if (intersects.length > 0) {
  //     // this.setState({
  //     //   showModal: true,
  //     //   modelText: tips[Math.floor(Math.random() * tips.length)],
  //     // })
  //   }
  // }, false)
}
