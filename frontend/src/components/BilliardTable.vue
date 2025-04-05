<script setup>
import { UseLoader } from '@tresjs/core'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import { shallowRef, onMounted, defineProps } from 'vue'
import { useLoop } from '@tresjs/core'
import { DragControls } from 'three/addons/controls/DragControls.js'
import * as THREE from 'three'

const boxRef = shallowRef()
const props = defineProps(['camera'])

const controls = new DragControls(boxRef.value, props.camera)

controls.addEventListener('dragstart', function (event) {
  event.object.material.emissive.set(0xaaaaaa)
})

controls.addEventListener('dragend', function (event) {
  event.object.material.emissive.set(0x000000)
})

const { onBeforeRender } = useLoop()

onMounted(() => {
  console.log(boxRef.value)
  console.log(props.camera)
})
</script>

<template>
  <TresMesh ref="boxRef">
    <Suspense>
      <UseLoader v-slot="{ data }" :loader="GLTFLoader" url="/billiardTable.glb">
        <primitive :object="data.scene" :scale="[0.2, 0.2, 0.2]" />
      </UseLoader>
    </Suspense>
  </TresMesh>
</template>
