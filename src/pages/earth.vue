<script setup lang="ts">
import { createEarth, hideGui } from '~/utils/earth.js'
const canvas = $ref()
onMounted(() => {
  createEarth(canvas as HTMLCanvasElement)
})
onBeforeUnmount(() => {
  hideGui()
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>

