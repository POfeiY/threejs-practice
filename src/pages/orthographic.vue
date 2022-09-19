<script setup lang="ts">
import { createOrthographicCamera } from '~/utils/camera.js'
const canvas = $ref()
const viewLeft = $ref()
const viewRight = $ref()
onMounted(() => {
  createOrthographicCamera(canvas, viewLeft, viewRight)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
  <div class="split-screen" w-full h-full flex position-absolute top-0 left-0>
    <section id="view-left" ref="viewLeft" w-full h-full />
    <section id="view-right" ref="viewRight" w-full h-full />
  </div>
</template>

