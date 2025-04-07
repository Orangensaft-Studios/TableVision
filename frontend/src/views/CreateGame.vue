<script setup>
import Team from '@/components/Team.vue';
import { useGameStore } from '@/stores/game';
import { ref } from 'vue';
import Header from '@/components/Header.vue';

const game = useGameStore();
const teams = ref([]);

function updateTeam(usernames, teamName, teamID) {
    teams.value[teamID] = { usernames: usernames, name: teamName }
}

function start() {
    game.startGame(teams.value);
}
</script>

<template>
    <div class="flex flex-col mx-4 sm:mx-10 md:mx-[15vw]">
        <Header class="" />
        <div class="flex flex-col items-center mt-20">
            <h1 class="font-bold text-4xl text-green-900">Create new game</h1>
        </div>
        <form @submit.prevent="start">
            <div class="flex flex-col sm:flex-row justify-center mt-10 gap-10">
                <Team :id="0" @updated-usernames="updateTeam" />
                <Team :id="1" @updated-usernames="updateTeam" />
            </div>
            <div class="mt-10 flex justify-center">
                <button type="submit"
                    class="px-3 py-2 bg-green-600 text-white hover:bg-green-500 rounded-xl hover:cursor-pointer">
                    Start game
                </button>
            </div>
        </form>
    </div>
</template>
