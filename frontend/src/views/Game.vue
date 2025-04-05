<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, dragControls, orbitControls
let billiardTable, billiardBall
const objects = []
const holePositions = [
  // Example hole positions
  new THREE.Vector3(-1.5, 0.25, -0.85),
  new THREE.Vector3(1.1, 0, -2.0),
  new THREE.Vector3(-1.1, 0, 2.0),
  new THREE.Vector3(1.1, 0, 2.0),
  new THREE.Vector3(0, 0, -2.0),
  new THREE.Vector3(0, 0, 2.0),
]
const holeRadius = 0.2 // Adjust based on your model
const ballFiles = Array.from({ length: 15 }, (_, i) => `/billiardBall${i + 1}.glb`)

function init() {
  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x82dbc5)

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 3, 5)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    powerPreference: 'low-power', // Uses less GPU
    antialias: false,
    alpha: false,
    preserveDrawingBuffer: false, // Avoids storing unnecessary data
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
  scene.add(ambientLight)

  const loader = new GLTFLoader()
  const loader2 = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  loader2.setDRACOLoader(dracoLoader)

  // Load Billiard Table
  loader.load('/billiardTable.glb', (gltf) => {
    billiardTable = gltf.scene
    billiardTable.scale.set(0.2, 0.2, 0.2)
    scene.add(billiardTable)
  })

  // Load Billiard Ball
  const startX = 0 // Center on table
  const startZ = -0.5 // Adjust Z to position near breaking area
  const ballSpacing = 0.22 // Adjusted for proper ball touching

  let count = 0

  // Loop through each row (5 total rows)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      let ballZStart = (ballSpacing / 2) * row
      loader2.load(ballFiles[count], (gltf) => {
        const newBall = gltf.scene
        newBall.scale.set(0.2, 0.2, 0.2)

        // Triangle formation formula
        newBall.position.set(startZ, 0, startX)

        ballZStart -= ballSpacing

        scene.add(newBall)
        objects.push(newBall)

        // Activate DragControls after all balls are loaded
        if (objects.length === 15) {
          dragControls = new DragControls(objects, camera, renderer.domElement)
          dragControls.addEventListener('drag', (event) => {
            event.object.position.y = 1 // Lock dragging to XZ plane
          })
        }
      })

      count++
      if (count >= 15) break // Stop if all 15 balls are placed
    }
  }

  // Orbit Controls
  orbitControls = new OrbitControls(camera, renderer.domElement)

  // Drag Controls (Enabled after ball loads)
  dragControls = new DragControls(objects, camera, renderer.domElement)
  dragControls.addEventListener('dragstart', (event) => {
    event.object.material.emissive = new THREE.Color(0xaaaaaa)
    orbitControls.enabled = false // Disable OrbitControls while dragging
  })

  dragControls.addEventListener('dragend', (event) => {
    event.object.material.emissive = new THREE.Color(0x000000)
    orbitControls.enabled = true // Re-enable OrbitControls after dragging
  })
  dragControls.addEventListener('drag', (event) => {
    event.object.position.y = 1
    checkIfOverHole(event.object)
  })

  animate()
}

// ✅ Function to check if the ball is over a hole
function checkIfOverHole(ball) {
  const ballPosition = new THREE.Vector3()
  ball.getWorldPosition(ballPosition)

  holePositions.forEach((holePos) => {
    const distance = ballPosition.distanceTo(holePos)
    console.log(distance)
    console.log(ballPosition)
    console.log(holePos)
    if (distance < holeRadius) {
      console.log('Ball is over a hole!')
      handleBallInHole(ball)
    }
  })
}

// ✅ Function to handle ball falling in hole
function handleBallInHole() {
  scene.remove(billiardBall)
  console.log('Ball fell in the hole!')
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
</script>

<template>
  <div></div>
</template>
