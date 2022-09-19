<script setup lang="ts">
import { createPrimitives } from '~/utils/primitives.js'
const canvas = $ref()
onMounted(() => {
  createPrimitives(canvas)
})
</script>

<template>
  <canvas ref="canvas" w-full h-full />
</template>>
