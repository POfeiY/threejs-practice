<script setup lang="ts">
import { createStormTrooper } from '~/utils/stormtrooper.js'
const canvas = $ref()
onMounted(() => {
  createStormTrooper(canvas)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>

