<script setup lang="ts">
import Ball from './Ball.vue';

defineProps({
  currentTeamId: {
    type: Number,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div
    class="w-full h-full bg-green-700 border-8 border-amber-950 rounded-lg flex xl:flex-row flex-col justify-between xl:pr-8 pb-8 xl:pl-24 pt-20 xl:pt-0 xl:pb-0 items-center relative gap-x-3"
  >
    <Ball :number="0" :team-id="currentTeamId" :game-id="gameId" class="ml-20" />
    <div class="flex xl:flex-row flex-col items-center xl:space-y-3">
      <div class="flex xl:flex-col flex-row justify-center space-y-2 space-x-2">
        <Ball :number="1" :team-id="currentTeamId" :game-id="gameId" />
      </div>
      <div class="flex xl:flex-col flex-row justify-center space-y-2 space-x-2">
        <Ball :number="2" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="9" :team-id="currentTeamId" :game-id="gameId" />
      </div>
      <div class="flex xl:flex-col flex-row justify-center space-y-2 space-x-2">
        <Ball :number="10" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="8" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="3" :team-id="currentTeamId" :game-id="gameId" />
      </div>
      <div class="flex xl:flex-col flex-row justify-center space-y-2 space-x-2">
        <Ball :number="14" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="12" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="4" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="11" :team-id="currentTeamId" :game-id="gameId" />
      </div>
      <div class="flex xl:flex-col flex-row justify-center space-y-2 space-x-2">
        <Ball :number="6" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="13" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="5" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="15" :team-id="currentTeamId" :game-id="gameId" />
        <Ball :number="7" :team-id="currentTeamId" :game-id="gameId" />
      </div>
    </div>
  </div>
</template>
