<script setup>
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore();

function clear() {
    gameStore.clear();
}
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-col items-center mt-20">
            <span class="text-2xl">Welcome to</span>
            <h1 class="font-bold text-5xl">TableVision</h1>
            <div class="mt-10">
                <RouterLink to="/games/new"
                    class="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-xl hover:cursor-pointer">Start new
                    round</RouterLink>
            </div>
        </div>
        <div class="flex flex-col items-center mt-10">
            <h2>Last Rounds</h2>
            <div class="flex flex-col gap-y-4" v-if="gameStore.games.length > 0">
                <RouterLink v-for="game in gameStore.games" :to="'/games/' + game.id">Round {{ game.id }}</RouterLink>
            </div>
            <div v-else>
                <span>No rounds played yet</span>
            </div>
        </div>
        <div class="flex justify-center mt-60 text-red-500 underline"><button class="cursor-pointer"
                @click="clear">Clear local storage</button></div>
    </div>
</template>
