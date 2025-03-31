<script setup lang="ts">
import Ball from './Ball.vue';

defineProps({
    currentTeamId: {
        type: Number,
        required: true,
    },
});

</script>

<template>
    <div class="w-full h-full bg-green-600 rounded-lg flex justify-center items-center relative">
        <Ball :number="1" :team-id="currentTeamId" />
        <Ball :number="2" :team-id="currentTeamId"/>
    </div>
</template>
