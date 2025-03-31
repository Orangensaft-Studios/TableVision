import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {

  const router = useRouter();
  const game = useStorage('game', {});
  const games = useStorage('games', []);

  function startGame(teams) {
    console.log('Starting game with teams:', teams);
    
    game.value = {id: games.value.length, teams: teams};
    games.value.push(game.value);
    router.push({ name: 'games', params: { id: game.value.id } })
  }

  return { startGame, games, game }
})
