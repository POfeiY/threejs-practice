<script setup lang="ts">
import { createDirectionalLightWithHelper } from '~/utils/lights.js'
const direction = $ref()
onMounted(() => {
  createDirectionalLightWithHelper(direction)
})
</script>

<template>
  <canvas ref="direction" w-full h-full />
</template>>

