<script setup lang="ts">
import { createEarth } from '~/utils/earth.js'
const canvas = $ref()
onMounted(() => {
  createEarth(canvas as HTMLCanvasElement)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>

