<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goToCamera = () => router.push('./camera')
const goToOrthographicCamera = () => router.push('./orthographic')
const goToSpace = () => router.push('./space')
const goToFerrari = () => router.push('./ferrari')
const goToStormTrooper = () => router.push('./storm')
const goToControlsPointer = () => router.push('./controls')
const goToEarth = () => router.push('./earth')
</script>

<template>
  <nav class="page-btn" text-xl mt-6 inline-flex gap-2 justify-between px-2>
    <div title="Camera" class="icon-btn" i-emojione:cat-face-with-wry-smile @click.stop="goToCamera" />
    <div title="Camera" class="icon-btn" i-emojione:angry-face-with-horns @click.stop="goToOrthographicCamera" />
    <div title="Space" class="icon-btn" i-emojione:bear-face @click.stop="goToSpace" />
    <div title="Ferrari" class="icon-btn" i-carbon:face-pending-filled @click.stop="goToFerrari" />
    <div title="StormTrooper" class="icon-btn" i-carbon:face-cool @click.stop="goToStormTrooper" />
    <div title="ControlsPointer" class="icon-btn" i-carbon:carbon @click.stop="goToControlsPointer" />
    <div title="Earth" class="icon-btn" i-carbon:carbon-for-ibm-product @click.stop="goToEarth" />
  </nav>
</template>
