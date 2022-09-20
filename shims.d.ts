declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'rollup-plugin-glsl-loader'

declare module '~/utils/camera.js'
declare module '~/utils/space.js'
declare module '~/utils/stormtrooper.js'
declare module '~/utils/controlsPointer.js'
declare module '~/utils/helloCib.js'
declare module '~/utils/earth.js'
declare module '~/utils/primitives.js'
declare module '~/utils/lights.js'
declare module '~/utils/gltf.js'
