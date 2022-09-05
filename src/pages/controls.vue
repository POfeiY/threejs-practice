<script setup lang="ts">
import { createPointerLockControls } from '~/utils/controlsPointer.js'
const container = $ref()
const blockLayer = $ref()
const helperLayer = $ref()
onMounted(() => {
  createPointerLockControls(blockLayer, helperLayer, container)
})
</script>

<template>
  <div id="c" ref="container" w-full h-full position-relative>
    <div ref="blockLayer" class="block-layer">
      <div ref="helperLayer" class="helper-layer">
        <p class="title">
          Click to play
        </p>
        <p>
          Move: WASD<br>
          Jump: SPACE<br>
          Look: MOUSE
        </p>
      </div>
    </div>
  </div>
</template>

