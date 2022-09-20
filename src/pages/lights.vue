<script setup lang="ts">
import { createAmbientLight, createDirectionalLight, createHemisphereLight, createPointLight } from '~/utils/lights.js'
const direction = $ref()
const point = $ref()
const AmbientLight = $ref()
const HemisphereLight = $ref()
onMounted(() => {
  createDirectionalLight(direction)
  createPointLight(point)
  createAmbientLight(AmbientLight)
  createHemisphereLight(HemisphereLight)
})
</script>

<template>
  <div w-full h-full grid="~ cols-2 rows-2">
    <div w-full position-relative>
      <span class="light-title">DirectionalLight</span>
      <canvas ref="direction" w-full h-full />
    </div>
    <div w-full position-relative>
      <span class="light-title">PointLight</span>
      <canvas ref="point" w-full h-full />
    </div>
    <div w-full position-relative>
      <span class="light-title">AmbientLight</span>
      <canvas ref="AmbientLight" w-full h-full />
    </div>
    <div w-full position-relative>
      <span class="light-title">HemisphereLight</span>
      <canvas ref="HemisphereLight" w-full h-full />
    </div>
  </div>
</template>>

