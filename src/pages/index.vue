<script setup lang="ts">
import { PorcheRender, sunSolarSystem } from '~/utils'

const canvas = $ref()

onMounted(() => {
  // sunSolarSystem(canvas as HTMLCanvasElement)
  PorcheRender(canvas as HTMLCanvasElement)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>
