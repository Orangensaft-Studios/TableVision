<script setup>
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/game'
import Button from 'primevue/button';

const gameStore = useGameStore();

function clear() {
    gameStore.clear();
}
</script>

<template>
    <div class="flex flex-col ">
        <div class="flex flex-col items-center mt-20 h-[35vh] justify-end">
            <span class="text-3xl">Welcome to</span>
            <h1 class="font-bold text-6xl text-green-900">TableVision</h1>
            <div class="mt-7">
                <RouterLink to="/games/new"
                    class="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl hover:cursor-pointer text-xl">Start
                    new
                    round</RouterLink>
            </div>
        </div>
        <div class="flex flex-col items-center mt-12">
            <h2 class="text-2xl mb-3 border-b">Last Rounds</h2>
            <div class="flex flex-col gap-y-4 divide-amber-400 h-48 overflow-y-auto" v-if="gameStore.games.length > 0">
                <RouterLink v-for="game in gameStore.games" :to="'/games/' + game.id" class="border-green-800">{{
                    game.isFinished ? `🏁 Round ${game.id} (finished)` : `Round ${game.id}` }}</RouterLink>
            </div>
            <div v-else>
                <span>No rounds played yet</span>
            </div>
        </div>
        <div class="flex justify-center mt-7"><Button class="cursor-pointer" @click="clear"
                severity="danger">Clear local storage</Button></div>
    </div>
</template>
