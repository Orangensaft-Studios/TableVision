<script setup>
import Team from '@/components/Team.vue'
import { useGameStore } from '@/stores/game'
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'

const game = useGameStore()
const teams = ref([
  { usernames: [''], name: '' },
  { usernames: [''], name: '' },
])

function updateTeam(usernames, teamName, teamID) {
  teams.value[teamID] = { usernames: usernames, name: teamName }
}

function resetTeams() {
  teams.value = [
    { usernames: [''], name: '' },
    { usernames: [''], name: '' },
  ]
}

function start() {
  game.startGame(teams.value)
}

onMounted(() => {
  const previousTeams = history.state?.previousTeams
  if (previousTeams && previousTeams.length === 2) {
    // Stelle sicher, dass jedes Team mindestens einen leeren Benutzernamen hat
    teams.value = previousTeams.map((team) => ({
      name: team.name || '',
      usernames: team.usernames && team.usernames.length > 0 ? team.usernames : [''],
    }))
  }
})
</script>

<template>
  <div class="flex flex-col mx-4 sm:mx-10 md:mx-[15vw]">
    <Header class="">
      <template #action>
        <button
          @click="resetTeams()"
          class="px-5 py-2 hover:cursor-pointer bg-red-600 text-white rounded-sm hover:bg-red-500"
        >
          Reset Teams
        </button>
      </template>
    </Header>
    <div class="flex flex-col items-center mt-20">
      <h1 class="font-bold text-4xl text-green-900">Create new game</h1>
    </div>
    <form @submit.prevent="start">
      <div class="flex flex-col sm:flex-row justify-center mt-10 gap-10">
        <Team
          :id="0"
          @updated-usernames="updateTeam"
          :team-name="teams[0].name"
          :usernames="teams[0].usernames"
        />
        <Team
          :id="1"
          @updated-usernames="updateTeam"
          :team-name="teams[1].name"
          :usernames="teams[1].usernames"
        />
      </div>
      <div class="mt-10 flex justify-center">
        <button
          type="submit"
          class="px-3 py-2 bg-green-600 text-white hover:bg-green-500 rounded-xl hover:cursor-pointer"
        >
          Start game
        </button>
      </div>
    </form>
  </div>
</template>
