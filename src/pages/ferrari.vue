<script setup lang="ts">
import { PorcheRender, hideGUI, showGUI } from '~/utils'
const canvas = $ref()
onMounted(() => {
  showGUI()
  PorcheRender(canvas as HTMLCanvasElement)
})
onBeforeUnmount(() => {
  hideGUI()
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>
