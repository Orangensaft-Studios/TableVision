<script setup>
import { ref, watch, defineEmits, onMounted } from 'vue'
import TeamInput from './TeamInput.vue'
import UserInput from './UserInput.vue'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  id: Number,
  teamName: {
    type: String,
    default: '',
  },
  usernames: {
    type: Array,
    default: () => [''],
  },
})

const emit = defineEmits(['updatedUsernames'])

const teamName = ref(props.teamName)
const usernames = ref([...props.usernames])

// Entferne den onMounted emit - das verursacht den Rekursionsfehler

// Watch for props changes
watch(
  () => props.teamName,
  (newTeamName) => {
    if (newTeamName !== teamName.value) {
      teamName.value = newTeamName
    }
  },
)

watch(
  () => props.usernames,
  (newUsernames) => {
    // Only update when values have actually changed
    const currentUsernames = JSON.stringify(usernames.value)
    const newUsernamesStr = JSON.stringify(newUsernames)

    if (currentUsernames !== newUsernamesStr) {
      usernames.value = [...newUsernames]
    }
  },
  { deep: true },
)

function addUser() {
  usernames.value.push('')
}

function removeUser() {
  if (usernames.value.length > 1) {
    usernames.value.pop()
  }
}

// Watch for local changes
watch(
  usernames,
  (newUsernames) => {
    emit('updatedUsernames', newUsernames, teamName.value, props.id)
  },
  { deep: true },
)

watch(teamName, (newTeamName) => {
  emit('updatedUsernames', usernames.value, newTeamName, props.id)
})
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <TeamInput v-model="teamName" />
    <hr class="border-green-900 border-2 mt-2" />
    <VueDraggable ref="el" v-model="usernames" target=".sort-target">
      <transition-group type="transition" tag="ul" name="fade" class="sort-target">
        <li v-for="(username, index) in usernames" :key="index">
          <UserInput v-model="usernames[index]" class="mt-2" />
        </li>
      </transition-group>
    </VueDraggable>
    <div class="flex justify-between px-5 pt-2">
      <button
        type="button"
        @click="addUser"
        class="mt-1 bg-green-600 text-white rounded-sm p-2 hover:bg-green-500 focus:outline-none hover:cursor-pointer size-6 flex items-center justify-center"
      >
        <i class="pi pi-plus"></i>
      </button>
      <button
        type="button"
        @click="removeUser"
        class="mt-1 bg-red-600 text-white rounded-sm p-2 hover:bg-red-500 focus:outline-none hover:cursor-pointer size-6 flex items-center justify-center"
      >
        <i class="pi pi-minus"></i>
      </button>
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
