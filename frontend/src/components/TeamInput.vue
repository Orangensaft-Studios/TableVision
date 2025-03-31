<script setup>
import { defineModel } from 'vue';

const teamName = defineModel();
</script>

<template>
    <InputText placeholder="Teamname" v-model="teamName" required />
</template>
