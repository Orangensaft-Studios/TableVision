import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {

  const router = useRouter();
  const currentGame = useStorage('currentGame', {})
  const games = useStorage('games', []);

  function startGame(teams) {
    console.log('Starting game with teams:', teams);
    
    currentGame.value = {id: games.value.length, teams: teams};
    games.value.push(currentGame.value);
    router.push({ name: 'games', params: { id: currentGame.value.id } })
  }

  return { startGame, games, currentGame }
})
