<script setup lang="ts">
import FakeBillardBall from './FakeBillardBall.vue';

</script>

<template>
    <div class="w-full h-full bg-green-600 rounded-lg flex justify-center items-center relative">
        <FakeBillardBall number="1" color="yellow" type="solid" :team-id="0" />
        <FakeBillardBall number="2" color="blue" type="striped" :team-id="0"/>
    </div>
</template>
