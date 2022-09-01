declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '~/utils/camera.js'
declare module '~/utils/space.js'
declare module '~/utils/stormtrooper.js'
declare module '~/utils/controlsPointer.js'
