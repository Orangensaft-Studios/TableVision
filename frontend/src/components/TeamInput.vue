<script setup>
const teamName = defineModel()
</script>

<template>
  <InputText placeholder="Teamname" v-model="teamName" required />
</template>
