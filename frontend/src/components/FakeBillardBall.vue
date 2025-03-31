<script setup lang="ts">

defineProps({
    number: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    // Add more colors as needed
};
</script>


<template>
    <button class="px-5 py-3 hover:cursor-pointer rounded-full" :class="colorClasses[color]">{{ number }}</button>
</template>
