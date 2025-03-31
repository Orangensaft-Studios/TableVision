<script setup lang="ts">
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

defineProps({
    number: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'solid',
    },
    teamId: {
        type: Number,
        required: false,
    },
});

const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
};
</script>


<template>
    <button @click="gameStore.playedBall(teamId, type)"
        class="w-16 h-16 overflow-hidden hover:cursor-pointer rounded-full relative"
        :class="type === 'solid' ? colorClasses[color] : ''">
        <span v-if="type === 'striped'" class="absolute bg-white h-[30%] top-0 left-0 right-0 rounded-t-full"></span>
        <span v-if="type === 'striped'" :class="colorClasses[color]"
            class="absolute h-[60%] top-[20%] left-0 right-0"></span>
        <span v-if="type === 'striped'" class="absolute bg-white h-[20%] bottom-0 left-0 right-0 rounded-b-full"></span>
        <span class="relative">{{ number }}</span>
    </button>
</template>
