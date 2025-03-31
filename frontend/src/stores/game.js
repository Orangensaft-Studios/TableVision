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
    currentGame.value.teams[0].points = 0
    currentGame.value.teams[0].isTurn = true
    currentGame.value.teams[0].currentPlayerIndex = 0

    currentGame.value.teams[1].points = 0
    currentGame.value.teams[1].isTurn = false
    currentGame.value.teams[1].currentPlayerIndex = 0
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
      switchTurns(teamIndex)
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

    const otherTeamID = teamIndex === 0 ? 1 : 0
    const otherBallType = ballType === 'solid' ? 'striped' : 'solid'

    currentGame.value.teams[otherTeamID].ballType = otherBallType
  }

  function switchTurns(teamIndex) {
    console.log('Switching turns for team:', teamIndex)
    currentGame.value.teams.forEach(team => {
      team.isTurn = !team.isTurn
    })
    currentGame.value.teams[teamIndex].currentPlayerIndex = (currentGame.value.teams[teamIndex].currentPlayerIndex + 1) % currentGame.value.teams[teamIndex].usernames.length
  }

  function getCurrentPlayer(teamIndex) {
    const team = currentGame.value.teams[teamIndex]
    console.log('Current player index:', team.currentPlayerIndex)
    console.log('Current player usernames:', team.usernames)
    console.log('Current player:', team.usernames[team.currentPlayerIndex]);
    
    if (team) {
      console.log(team.usernames[team.currentPlayerIndex])
      return team.usernames[team.currentPlayerIndex]
    }
    return null
  }

  function setCurrentGame(gameID) {
    console.log('Setting current game to:', gameID)
    currentGame.value = games.value[gameID];
  }

  function getCurrentTeamIndex() {
    const currentTeamIndex = currentGame.value.teams.findIndex(team => team.isTurn);
    console.log('Current team index:', currentTeamIndex)
    return currentTeamIndex
  }

  return { startGame, playedBall, getCurrentPlayer, setCurrentGame, getCurrentTeamIndex, games, currentGame }
})
