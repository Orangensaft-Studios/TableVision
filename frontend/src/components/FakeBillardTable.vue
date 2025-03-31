<script setup lang="ts">
import FakeBillardBall from './FakeBillardBall.vue';

</script>

<template>
    <div class="w-full h-full bg-green-600 rounded-lg flex justify-center items-center relative">
        <FakeBillardBall number="1" color="yellow" />
        <FakeBillardBall number="2" color="blue" />
    </div>
</template>
