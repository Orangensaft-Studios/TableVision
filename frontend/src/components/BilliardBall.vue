<script setup>
import { UseLoader } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { shallowRef, onMounted } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'

const boxRef = shallowRef()

const { onBeforeRender } = useLoop()

onMounted(() => {})
</script>

<template>
  <TresMesh ref="boxRef">
    <Suspense>
      <UseLoader v-slot="{ data }" :loader="GLTFLoader" url="/billiardBall.glb">
        <primitive :object="data.scene" :scale="[0.4, 0.4, 0.4]" />
      </UseLoader>
    </Suspense>
  </TresMesh>
</template>
