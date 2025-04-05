<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  currentTeamId: Number,
  gameId: Number,
})

let scene, camera, renderer, dragControls, orbitControls
const objects = []
let animationFrameId = null

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  cancelAnimationFrame(animationFrameId)
})

function init() {
  const container = document.getElementById('billiard-scene')
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x82dbc5)

  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 3, 5)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
  scene.add(ambientLight)

  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  loader.setDRACOLoader(dracoLoader)

  // Load Table
  loader.load('/billiardTable.glb', (gltf) => {
    const table = gltf.scene
    table.scale.set(0.2, 0.2, 0.2)
    scene.add(table)
  })

  // Load Balls (example only)
  const ballFiles = Array.from({ length: 15 }, (_, i) => `/billiardBall${i + 1}.glb`)
  const ballSpacing = 0.22
  let count = 0

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const thisCount = count
      loader.load(ballFiles[thisCount], (gltf) => {
        const ball = gltf.scene
        ball.scale.set(0.2, 0.2, 0.2)
        const x = row * ballSpacing - ballSpacing * 2
        const z = (col - row / 2) * ballSpacing
        ball.position.set(x, 0, z)

        ball.userData = {
          id: thisCount + 1,
          type: thisCount === 0 ? 'cue' : 'normal',
        }

        scene.add(ball)
        objects.push(ball)

        if (objects.length === 15) {
          dragControls = new DragControls(objects, camera, renderer.domElement)
          dragControls.addEventListener('drag', (event) => {
            event.object.position.y = 1
          })
        }
      })
      count++
    }
  }

  orbitControls = new OrbitControls(camera, renderer.domElement)

  animate()
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
</script>

<template>
  <div id="billiard-scene" class="w-full h-full"></div>
</template>
