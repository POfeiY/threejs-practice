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
    <canvas ref="direction" w-full h-full />
    <canvas ref="point" w-full h-full />
    <canvas ref="AmbientLight" w-full h-full />
    <canvas ref="HemisphereLight" w-full h-full />
  </div>
</template>>

