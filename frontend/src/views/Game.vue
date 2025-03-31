<script setup>
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'

const route = useRoute();
const gameStore = useGameStore();

console.log(route.params.id);
console.log(gameStore.game);

</script>

<template>
    
</template>
