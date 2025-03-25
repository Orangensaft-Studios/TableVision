<script setup>
import { defineModel } from 'vue';

const teamName = defineModel();
</script>

<template>
    <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-users"></i>
        </InputGroupAddon>
        <InputText placeholder="Team Name" v-model="teamName" required />
    </InputGroup>
</template>
