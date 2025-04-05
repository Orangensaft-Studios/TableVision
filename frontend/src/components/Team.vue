<script setup>
import { ref, watch, defineEmits } from 'vue';

import TeamInput from './TeamInput.vue';
import UserInput from './UserInput.vue';
import { VueDraggable } from 'vue-draggable-plus';

const props = defineProps(['id']);

const emit = defineEmits(['updatedUsernames']);

const teamName = ref('');
const amountOfUsers = ref(1);
const usernames = ref(['']);

function addUser() {
    amountOfUsers.value++;
    usernames.value.push('');
}

function removeUser() {
    if (amountOfUsers.value > 1) {
        amountOfUsers.value--;
        usernames.value.pop();
    }
}

watch(usernames, (newUsernames) => {
    emit('updatedUsernames', newUsernames, teamName.value, props.id);
}, { deep: true });

</script>

<template>
    <div class="flex flex-col gap-y-1">
        <TeamInput v-model="teamName" />
        <VueDraggable ref="el" v-model="usernames" target=".sort-target">
            <transition-group type="transition" tag="ul" name="fade" class="sort-target">
                <li v-for="(username, index) in usernames" :key="index">
                    <UserInput v-model="usernames[index]" class="mt-2" />
                </li>
            </transition-group>
        </VueDraggable>
        <div class="flex justify-between px-5 pt-2">
            <button type="button" @click="addUser" class="mt-1 hover:opacity-60 cursor-pointer"><i
                    class="pi pi-plus"></i></button>
            <button type="button" @click="removeUser" class="mt-1 hover:opacity-60 cursor-pointer"><i
                    class="pi pi-minus"></i></button>
        </div>
    </div>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
.fade-leave-active {
  position: absolute;
}
</style>
