<script setup>
const username = defineModel()
</script>

<template>
  <InputGroup>
    <InputGroupAddon>
      <i class="pi pi-user"></i>
    </InputGroupAddon>
    <InputText placeholder="Player name" v-model="username" required />
  </InputGroup>
</template>
