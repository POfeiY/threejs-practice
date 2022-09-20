<script setup lang="ts">
import { createGLTFLodaer } from '~/utils/gltf.js'
const canvas = $ref()
onMounted(() => {
  createGLTFLodaer(canvas)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>

