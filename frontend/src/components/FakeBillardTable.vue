<script setup lang="ts">
import FakeBillardBall from './FakeBillardBall.vue';

defineProps({
    currentTeamId: {
        type: Number,
        required: true,
    },
});

</script>

<template>
    <div class="w-full h-full bg-green-600 rounded-lg flex justify-center items-center relative">
        <FakeBillardBall number="1" color="yellow" type="solid" :team-id="currentTeamId" />
        <FakeBillardBall number="2" color="blue" type="striped" :team-id="currentTeamId"/>
    </div>
</template>
