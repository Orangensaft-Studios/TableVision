import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {

  const router = useRouter();
  const games = useStorage('games', []);

  async function startGame(teams) {
    const game = {
      id: games.value.length,
      teams: teams.map((team, index) => ({
        ...team,
        points: 0,
        isTurn: index === 0,
        currentPlayerIndex: 0,
        ballType: undefined,
      })),
    }
    await games.value.push(game)
    router.push({ name: 'games', params: { id: game.id } })
  }

  function playedBall(gameID, teamIndex, ballType) {
    console.log('Played ball:', ballType, 'for team index:', teamIndex)
    if (!isAnyBallTypeSet(gameID)) {
      setTeamBallType(gameID, teamIndex, ballType)
    }

    const teamBallType = getTeamBallType(gameID, teamIndex)
    if (teamBallType === ballType) {
      games.value[getGameIndex(gameID)].teams[teamIndex].points += 1
    } else {
      const otherTeamID = teamIndex === 0 ? 1 : 0
      games.value[getGameIndex(gameID)].teams[otherTeamID].points += 1
      switchTurns(gameID, teamIndex)
    }
  }

  function isAnyBallTypeSet(gameID) {
    return getCurrentGame(gameID).teams.some((team) => team.ballType !== undefined)
  }

  function getTeamBallType(gameID, teamIndex) {
    const team = getTeam(gameID, teamIndex);
    return team ? team.ballType : undefined
  }

  function getTeam(gameID, teamIndex) {
    const game = getCurrentGame(gameID);
    return game ? game.teams[teamIndex] : null
  }

  function setTeamBallType(gameID, teamIndex, ballType) {
    const gameIndex = getGameIndex(gameID);
    games.value[gameIndex].teams[teamIndex].ballType = ballType

    const otherTeamID = teamIndex === 0 ? 1 : 0
    const otherBallType = ballType === 'solid' ? 'striped' : 'solid'

    games.value[gameIndex].teams[otherTeamID].ballType = otherBallType
  }

  function switchTurns(gameID, teamIndex) {
    games.value[getGameIndex(gameID)].teams.forEach((team) => {
      team.isTurn = !team.isTurn
    })
    games.value[getGameIndex(gameID)].teams[teamIndex].currentPlayerIndex =
      (getCurrentGame(gameID).teams[teamIndex].currentPlayerIndex + 1) %
      getCurrentGame(gameID).teams[teamIndex].usernames.length
  }

  function getCurrentPlayer(gameID, teamIndex) {
    const team = getTeam(gameID, teamIndex);
    
    if (team) {
      return team.usernames[team.currentPlayerIndex]
    }
    return null
  }

  function getGameIndex(gameID) {
    return games.value.findIndex((game) => game.id === gameID)
  }

  function getCurrentGame(gameID) {
    return games.value.find((game) => game.id === gameID);
  }

  function getCurrentTeamIndex(gameID) {
    const currentTeamIndex = getCurrentGame(gameID).teams.findIndex((team) => team.isTurn)
    return currentTeamIndex;
  }

  return { startGame, playedBall, getCurrentPlayer, getCurrentTeamIndex, getCurrentGame, games }
})
