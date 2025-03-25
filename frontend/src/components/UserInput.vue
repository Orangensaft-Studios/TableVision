<script setup>
import { defineModel } from 'vue';

const username = defineModel();

</script>

<template>
    <InputGroup>
        <InputGroupAddon>
            <i class="pi pi-user"></i>
        </InputGroupAddon>
        <InputText placeholder="Username" v-model="username" required />
    </InputGroup>
</template>
