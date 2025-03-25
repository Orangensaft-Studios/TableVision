import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

  const teams = ref([])

  function updateTeam(usernames, teamName, teamID) {  
    teams.value[teamID] = { username: usernames, team: teamName }
  }

  return { updateTeam, teams }
})
