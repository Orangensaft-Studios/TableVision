import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const router = useRouter();
  const games = useStorage('games', []);

  async function startGame(teams) {
    const game = {
      id: games.value.length + 1,
      isFinished: false,
      teams: teams.map((team, index) => ({
        ...team,
        points: 0,
        isTurn: index === 0,
        didWin: false,
        currentPlayerIndex: 0,
        currentPlayerPlayed: false,
        ballType: undefined,
        balls: [],
        usernames: team.usernames.map((username) => ({
          name: username,
          plays: 0,
          fouls: 0,
          points: 0,
        })),
      })),
    }
    games.value.push(game);
    await router.push({ name: 'games', params: { id: game.id } });
  }

  function playedBall(gameID, teamIndex, ballType, number) {
    console.log(`Played ball ${number} of type ${ballType} for team ${teamIndex}`);

    if (number === 0) {
      foul(gameID, teamIndex);
      return;
    }  
    
    if (!isGameActive(gameID)) {
      return;
    }

    if (!isAnyBallTypeSet(gameID)) {
      setTeamBallType(gameID, teamIndex, ballType);
    }

    const gameIndex = getGameIndex(gameID);
    const currentPlayerIndex = getCurrentPlayerIndex(gameID, teamIndex);
    const teamBallType = getTeamBallType(gameID, teamIndex);

    games.value[gameIndex].teams[teamIndex].usernames[currentPlayerIndex].plays += 1;
    games.value[gameIndex].teams[teamIndex].currentPlayerPlayed = true;

    if (number !== 8) {
      if (teamBallType === ballType) {
        games.value[gameIndex].teams[teamIndex].points += 1;
        games.value[gameIndex].teams[teamIndex].usernames[currentPlayerIndex].points += 1;
        addBall(gameID, teamIndex, number);
      } else {
        const otherTeamID = getOtherTeamIndex(teamIndex);
        games.value[gameIndex].teams[otherTeamID].points += 1;
        addBall(gameID, otherTeamID, number);
      }
    } else {
      addBall(gameID, teamIndex, number);
    }

    if(didSomeoneWin(gameID, teamIndex, number)) {
      console.log(getStatsPerTeam(gameID));
    }
  }

  function isGameActive(gameID) {
    return getCurrentGame(gameID).isFinished === false;
  }

  function is8ValidPlay(gameID, teamIndex) {
    const game = getCurrentGame(gameID);
    const team = game.teams[teamIndex];
    const amount = team.balls.length;

    if (amount === 8) {
      games.value[getGameIndex(gameID)].teams[teamIndex].points += 1;
      games.value[getGameIndex(gameID)].teams[teamIndex].usernames[
        getCurrentPlayerIndex(gameID, teamIndex)
      ].points += 1;
      return true;
    } else {
      return false;
    }
  }

  function didSomeoneWin(gameID, teamIndex, ball) {
    if (ball === 8) {
      const isValid = is8ValidPlay(gameID, teamIndex);
      const otherTeamIndex = getOtherTeamIndex(teamIndex);
      const gameIndex = getGameIndex(gameID);
      if (isValid) {
        games.value[gameIndex].teams[teamIndex].didWin = true;
      } else {
        games.value[gameIndex].teams[otherTeamIndex].didWin = true;
      }
      games.value[gameIndex].teams[teamIndex].isTurn = false;
      games.value[gameIndex].teams[otherTeamIndex].isTurn = false;
      games.value[gameIndex].isFinished = true;
      return true;
    }
    return false;
  }

  function isAnyBallTypeSet(gameID) {
    return getCurrentGame(gameID).teams.some((team) => team.ballType !== undefined);
  }

  function getTeamBallType(gameID, teamIndex) {
    const team = getTeam(gameID, teamIndex);
    return team ? team.ballType : undefined;
  }

  function getTeam(gameID, teamIndex) {
    const game = getCurrentGame(gameID);
    return game ? game.teams[teamIndex] : null;
  }

  function setTeamBallType(gameID, teamIndex, ballType) {
    const gameIndex = getGameIndex(gameID);
    games.value[gameIndex].teams[teamIndex].ballType = ballType;

    const otherBallType = ballType === 'solid' ? 'striped' : 'solid';

    games.value[gameIndex].teams[getOtherTeamIndex(teamIndex)].ballType = otherBallType;
  }

  function switchTurns(gameID, teamIndex) {
    const gameIndex = getGameIndex(gameID);
    const game = getCurrentGame(gameID);

    games.value[gameIndex].teams[teamIndex].currentPlayerPlayed = false;
if(!games.value[gameIndex].teams[teamIndex].currentPlayerPlayed) {
games.value[gameIndex].teams[teamIndex].usernames[currentPlayerIndex].plays += 1;
}
    games.value[gameIndex].teams.forEach((team) => {
      team.isTurn = !team.isTurn
    });
    games.value[gameIndex].teams[teamIndex].currentPlayerIndex =
      (game.teams[teamIndex].currentPlayerIndex + 1) %
      game.teams[teamIndex].usernames.length;
  }

  function getCurrentPlayerName(gameID, teamIndex) {
    const team = getTeam(gameID, teamIndex);

    if (team) {
      return team.usernames[team.currentPlayerIndex].name;
    }
    return null;
  }

  function getCurrentPlayerIndex(gameID, teamIndex) {
    const team = getTeam(gameID, teamIndex);

    if (team) {
      return team.currentPlayerIndex;
    }
    return null;
  }

  function getGameIndex(gameID) {
    return games.value.findIndex((game) => game.id === gameID);
  }

  function getCurrentGame(gameID) {
    return games.value.find((game) => game.id === gameID);
  }

  function getCurrentTeamIndex(gameID) {
    return getCurrentGame(gameID).teams.findIndex((team) => team.isTurn);
  }

  function foul(gameID, teamIndex) {
    games.value[getGameIndex(gameID)].teams[teamIndex].usernames[
      getCurrentPlayerIndex(gameID, teamIndex)
    ].fouls += 1;
    switchTurns(gameID, teamIndex);
  }

  function security(gameID, teamIndex) {}

  function end(gameID) {
    getCurrentGame(gameID).isFinished = true;
  }

  function clear() {
    games.value = [];
  }

  function getOtherTeamIndex(teamIndex) {
    return teamIndex === 0 ? 1 : 0;
  }

  function addBall(gameID, teamIndex, ball) {
    games.value[getGameIndex(gameID)].teams[teamIndex].balls.push(ball);
  }

  function getBalls(gameID, teamIndex) {
    return games.value[getGameIndex(gameID)].teams[teamIndex].balls;
  }

  function getBall(gameID, ball) {
    return getCurrentGame(gameID).teams.some((team) => team.balls.includes(ball));
  }

  function getStatsPerTeam(gameID) {
    const game = getCurrentGame(gameID);
    return game.teams.map((team) => ({
      name: team.name,
      fouls: getFoulsPerTeam(team),
      points: team.points,
      balls: team.balls,
      didWin: team.didWin,
      ballType: team.ballType,
      players: team.usernames.map((player) => ({
        name: player.name,
        fouls: player.fouls,
        points: player.points,
        plays: player.plays,
      })),
    }));
  }

  function getFoulsPerTeam(team) {
      return team.usernames.reduce((total, player) => total + player.fouls, 0);
  }

  return {
    startGame,
    playedBall,
    getCurrentPlayerName,
    getCurrentTeamIndex,
    getCurrentGame,
    foul,
    switchTurns,
    security,
    end,
    clear,
    addBall,
    getBalls,
    getBall,
    isGameActive,
    getStatsPerTeam,
    games,
  }
})
