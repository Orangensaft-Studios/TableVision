<script setup>
import Team from '@/components/Team.vue';
import { useGameStore } from '@/stores/game';
import { ref } from 'vue';

const game = useGameStore();



function log() {
    console.log(game.teams);
}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex flex-col items-center mt-20">
            <h1 class="font-bold text-4xl">Create new game</h1>
        </div>
        <form @submit.prevent="log">
            <div class="flex flex-row justify-center mt-10">
                <div class="w-1/3 flex flex-row justify-between gap-x-10">
                    <Team :id="1" @updated-usernames="game.updateTeam" />
                    <Team :id="2" @updated-usernames="game.updateTeam" />
                </div>
            </div>
            <div class="mt-10 flex justify-center">
                <button type="submit"
                    class="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-xl hover:cursor-pointer">Start
                    game</button>
            </div>
        </form>
    </div>
</template>
