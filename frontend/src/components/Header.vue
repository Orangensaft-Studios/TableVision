<script setup>
</script>

<template>
    <header class="w-full border-b py-2 my-2">
        <nav class="w-full flex flex-col lg:flex-row lg:justify-between items-center">
            <router-link to="/">
                <h1 class="md:text-4xl text-2xl w-fit font-bold text-green-900">TableVision</h1>
            </router-link>
            <div class="mt-2 lg:mt-0 flex justify-center lg:justify-end">
                <div class="text-xs lg:text-base">
                    <slot name="action"></slot>
                </div>
            </div>
        </nav>
    </header>
</template>