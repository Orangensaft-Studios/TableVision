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

  function playedBall(teamIndex, ballType) {
    console.log('Team', teamIndex, 'played ball type:', ballType)
    if (!isAnyBallTypeSet()) {
      setTeamBallType(teamIndex, ballType)
    }

    const teamBallType = getTeamBallType(teamIndex)
    if (teamBallType === ballType) {
      console.log(`Team ${teamIndex} played their own ball type: ${ballType}`)
      currentGame.value.teams[teamIndex].points += 1
    } else {
      console.log(`Team ${teamIndex} played the opponent's ball type: ${ballType}`)
      const otherTeamID = teamIndex === 0 ? 1 : 0
      currentGame.value.teams[otherTeamID].points += 1
    }
  }

  function isAnyBallTypeSet() {
    return currentGame.value.teams.some(team => team.ballType !== undefined)
  }

  function getTeamBallType(teamIndex) {
    const team = currentGame.value.teams[teamIndex];
    return team ? team.ballType : undefined
  }

  function setTeamBallType(teamIndex, ballType) {
    currentGame.value.teams[teamIndex].ballType = ballType
    currentGame.value.teams[teamIndex].points = 0
    const otherTeamID = teamIndex === 0 ? 1 : 0
    const otherBallType = ballType === 'solid' ? 'striped' : 'solid'
    currentGame.value.teams[otherTeamID].ballType = otherBallType
    currentGame.value.teams[otherTeamID].points = 0
    console.log(
      `Team ${teamID} is assigned ${ballType}, and team ${otherTeamID} is assigned ${otherBallType}`,
    )
  }

  function setCurrentGame(gameID) {
    console.log('Setting current game to:', gameID)
    currentGame.value = games.value[gameID];
  }

  return { startGame, playedBall, setCurrentGame, games, currentGame }
})
