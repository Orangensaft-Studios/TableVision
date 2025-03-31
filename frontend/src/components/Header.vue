<script setup>
</script>

<template>
    <header class="w-full border-b py-2 my-2">
        <nav class="">
            <router-link to="/">
                <h1 class="text-4xl w-fit">TableVision</h1>
            </router-link>
        </nav>
        <slot name="action"></slot>
    </header>
</template>