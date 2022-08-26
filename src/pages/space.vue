<script setup lang="ts">
import { createSpace } from '~/utils/space.js'
const canvas = $ref()
onMounted(() => {
  createSpace(canvas)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>
