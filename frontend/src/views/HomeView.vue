<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const games = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);
</script>

<template>
    <div class="flex flex-col">
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
            <div class="flex flex-col gap-y-4">
                <RouterLink v-for="game in games" :to="'/games/' + game.id">Round {{ game.id }}</RouterLink>
            </div>
        </div>
    </div>
</template>
