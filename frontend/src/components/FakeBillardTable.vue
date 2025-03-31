<script setup lang="ts">
import Ball from './Ball.vue';

defineProps({
    currentTeamId: {
        type: Number,
        required: true,
    },
    gameId: {
        type: Number,
        required: true,
    },
});

</script>

<template>
    <div class="w-full h-full bg-green-600 rounded-lg flex justify-center items-center relative">
        <FakeBillardBall number="1" color="yellow" type="solid" :team-id="currentTeamId" :game-id="gameId" />
        <FakeBillardBall number="2" color="blue" type="striped" :team-id="currentTeamId" :game-id="gameId" />
    </div>
</template>
