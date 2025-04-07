<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Ball from '@/components/Ball.vue'

const route = useRoute()
const router = useRouter()
const gameID = parseInt(route.params.id)
const gameStore = useGameStore()
const stats = computed(() => gameStore.getStatsPerTeam(gameID))
</script>

<template>
    <div class="flex flex-col h-full mx-[20vw] p-4">
        <Header>
            <template #action>
                <button @click="router.push({ name: 'games', params: { id: gameID } })"
                    class="px-5 py-2 hover:cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-500">
                    Back to Game
                </button>
            </template>
        </Header>

        <div class="flex flex-col items-center mt-2">
            <h1 class="font-bold text-2xl text-green-900">Game Stats</h1>
        </div>

        <div class="grid gap-6 mt-4">
            <div v-for="(team, idx) in stats" :key="idx" :class="[
             'bg-white shadow-md rounded-lg p-6 border',
             team.didWin ? 'border-red-500 border-4 relative' : 'border-gray-200'
           ]">
                <span v-if="team.didWin"
                    class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                    Winner
                </span>
                <h2 class="text-2xl font-semibold text-green-800">
                    Team {{ team.name }} <span v-if="team.ballType" class="text-base text-green-600">({{ team.ballType
                        }})</span>
                </h2>
                <div class="mt-4 grid grid-cols-2 gap-y-2">
                    <p class="text-lg">Points:</p>
                    <p class="text-lg font-medium">{{ team.points }}</p>
                    <p class="text-lg">Fouls:</p>
                    <p class="text-lg font-medium">{{ team.fouls }}</p>
                </div>
                <div class="mt-4">
                    <h3 class="font-semibold text-lg">Players:</h3>
                    <table class="w-full mt-2 text-sm">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="text-left py-2">Name</th>
                                <th class="text-center py-2">Points</th>
                                <th class="text-center py-2">Fouls</th>
                                <th class="text-center py-2">Shots</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(player, id) in team.players" :key="id" class="border-b border-gray-100">
                                <td class="py-2">{{ player.name }}</td>
                                <td class="text-center py-2">{{ player.points }}</td>
                                <td class="text-center py-2">{{ player.fouls }}</td>
                                <td class="text-center py-2">{{ player.plays }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4">
                    <h3 class="font-semibold text-lg">Balls:</h3>
                    <div v-if="team.balls && team.balls.length" class="flex flex-wrap gap-x-1">
                        <Ball :clickable="false" :number="ball" v-for="ball in team.balls"></Ball>
                    </div>
                    <p class="text-sm" v-else>No balls played</p>
                </div>
            </div>
        </div>

        <!-- Navigation Button -->
        <div class="flex justify-center mt-10">
            <button @click="router.push({name: 'games', params: { id: gameID }})"
                class="px-5 py-2 hover:cursor-pointer bg-green-600 text-white rounded-xl hover:bg-green-500">
                Back to Game
            </button>
        </div>
    </div>
</template>