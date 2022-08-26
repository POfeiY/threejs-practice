<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goToCamera = () => router.push('./camera')
const goToSpace = () => router.push('./space')
const goToFerrari = () => router.push('./ferrari')
const goToStormTrooper = () => router.push('./')
</script>

<template>
  <nav class="page-btn" text-xl mt-6 inline-flex gap-2 justify-between px-2>
    <div title="Camera" class="icon-btn" i-carbon:face-dizzy-filled @click.stop="goToCamera" />
    <div title="Space" class="icon-btn" i-carbon:face-mask @click.stop="goToSpace" />
    <div title="Ferrari" class="icon-btn" i-carbon:face-pending-filled @click.stop="goToFerrari" />
    <div title="StormTrooper" class="icon-btn" i-carbon:face-cool @click.stop="goToStormTrooper" />
  </nav>
</template>
