<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useGameStore } from '@/stores/game';

const props = defineProps({
  currentTeamId: Number,
  gameId: Number,
});

defineExpose({
  dispose,
});

const gameStore = useGameStore();

watch(gameStore.getCurrentGame(props.gameId)?.isFinished, (val) => {
  if (val) {
    if (dragControls) dragControls.dispose?.();
  }
});

let scene, camera, renderer, dragControls, orbitControls;
let billardTable, billardBall;
let animationFrameId = null;

let ballsInHole = [];

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
  cancelAnimationFrame(animationFrameId);
});

const objects = [];
const holePositions = [
  { position: new THREE.Vector3(-1.5, 0.2, -0.85), name: 'Top Left' },
  { position: new THREE.Vector3(0.125, 0.2, -0.898), name: 'Top Center' },
  { position: new THREE.Vector3(1.83, 0.2, -0.85), name: 'Top Right' },
  { position: new THREE.Vector3(1.85, 0.2, 0.89), name: 'Bottom Right' },
  { position: new THREE.Vector3(0.125, 0.2, 0.943), name: 'Bottom Center' },
  { position: new THREE.Vector3(-1.58, 0.2, 0.89), name: 'Bottom Left' },
];
const holeRadius = 0.13; // Adjust based on your model
const ballFiles = Array.from({ length: 15 }, (_, i) => `/billardBall${i + 1}.glb`);

function init() {
  const container = document.getElementById('billard-scene');
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 0);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  const loader2 = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader2.setDRACOLoader(dracoLoader);

  // Load Billard Table
  loader2.load('/billardTable.glb', (gltf) => {
    billardTable = gltf.scene;
    billardTable.scale.set(0.2, 0.2, 0.2);
    scene.add(billardTable);
  });

  // Load Billard Ball
  const startX = 0; // Center on table
  const startZ = 0; // Adjust Z to position near breaking area
  const ballSpacing = 0.22; // Adjusted for proper ball touching

  let count = 0;

  // Loop through each row (5 total rows)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const thisCount = count;
      let ballZStart = (ballSpacing / 2) * row;
      loader2.load(ballFiles[count], (gltf) => {
        const newBall = gltf.scene;
        newBall.scale.set(0.2, 0.2, 0.2);

        // Triangle formation formula
        newBall.position.set(startZ, 0, startX);

        ballZStart -= ballSpacing;

        let ballType;
        if (thisCount + 1 === 8) {
          ballType = 'black';
        }
        ballType = thisCount + 1 > 8 ? 'striped' : 'solid';

        newBall.userData = {
          id: thisCount + 1,
          ballType: ballType,
        };

        let isHidden;
        if (props.gameId !== undefined) {
          isHidden = gameStore.getBall(props.gameId, thisCount + 1);
        }

        console.log(isHidden);
        if (!isHidden) {
          scene.add(newBall);
          objects.push(newBall);
        }

        // Activate DragControls after all balls are loaded
        if (objects.length === 15) {
          console.log(objects);
          dragControls = new DragControls(objects, camera, renderer.domElement);
          dragControls.addEventListener('drag', (event) => {
            event.object.position.y = 1; // Lock dragging to XZ plane
          });
        }
      });

      count++;
      if (count >= 15) break; // Stop if all 15 balls are placed
    }
  }

  // Orbit Controls
  orbitControls = new OrbitControls(camera, renderer.domElement);

  // Drag Controls (Enabled after ball loads)
  dragControls = new DragControls(objects, camera, renderer.domElement);
  dragControls.addEventListener('dragstart', (event) => {
    event.object.material.emissive = new THREE.Color(0xaaaaaa);
    orbitControls.enabled = false; // Disable OrbitControls while dragging
  });

  dragControls.addEventListener('dragend', (event) => {
    event.object.material.emissive = new THREE.Color(0x000000);
    orbitControls.enabled = true; // Re-enable OrbitControls after dragging
  });
  dragControls.addEventListener('drag', (event) => {
    event.object.position.y = 1;
    checkIfOverHole(event.object);
  });

  animate();
}

function checkIfOverHole(ball) {
  const removeObjectID = objects.findIndex((x) => x.uuid === ball.parent.uuid);
  if (!ballsInHole.includes(objects[removeObjectID].userData.id)) {
    const ballPosition = new THREE.Vector3();
    ball.getWorldPosition(ballPosition);

    holePositions.forEach(({ position, name }) => {
      const distance = ballPosition.distanceTo(position);
      if (distance < holeRadius) {
        console.log(`Ball is over hole: ${name}`);

        console.log(objects[removeObjectID].userData);
        ballsInHole.push(objects[removeObjectID].userData.id);
        handleBallInHole(removeObjectID, name);
      }
    });
  }
}

function handleBallInHole(removeObjectID, holeName) {
  scene.remove(objects[removeObjectID]);
  const ballData = objects[removeObjectID].userData;
  console.log(props.currentTeamId);
  gameStore.playedBall(props.gameId, props.currentTeamId, ballData.ballType, ballData.id);

  console.log(`Ball fell into ${holeName}`);
}

// Animation Loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function dispose() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (dragControls) dragControls.dispose?.();
  if (orbitControls) orbitControls.dispose?.();

  scene?.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });

  while (scene?.children?.length > 0) {
    scene.remove(scene.children[0]);
  }

  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  renderer?.dispose?.();

  // Null everything for GC
  scene = null;
  camera = null;
  renderer = null;
  dragControls = null;
  orbitControls = null;
  animationFrameId = null;
  objects.length = 0;
}

onBeforeUnmount(() => {
  dispose();
});
</script>

<template>
  <div id="billard-scene" class="w-full h-full"></div>
</template>
