<script setup>
import Header from '@/components/Header.vue';
import FakeBillardTable from '@/components/FakeBillardTable.vue';
import Button from 'primevue/button';
import { useGameStore } from '@/stores/game';
import { onMounted, watch, ref, computed } from 'vue';
import Ball from '@/components/Ball.vue';
import Dialog from 'primevue/dialog';
import { useRoute, useRouter } from 'vue-router';
import BillardTable from '@/components/BillardTable.vue';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const id = Number(route.params.id);
const billardRef = ref(null);

const team1Points = ref(0);
const team2Points = ref(0);

const team1Balls = ref([]);
const team2Balls = ref([]);

const threeDTableVisible = ref(false);

const visible = ref(false);

watch(threeDTableVisible, (val) => {
  if (!val && billardRef.value) {
    billardRef.value.dispose();
  }
});

onMounted(() => {
  watch(
    () => gameStore.getCurrentGame(id),
    (newGame) => {
      if (newGame && newGame.teams) {
        team1Points.value = newGame.teams[0]?.points || 0;
        team2Points.value = newGame.teams[1]?.points || 0;
        team1Balls.value = gameStore.getBalls(id, 0) || [];
        team2Balls.value = gameStore.getBalls(id, 1) || [];
      }
    },
    { immediate: true },
  );

  watch(
    () => gameStore.getCurrentGame(id)?.teams[0]?.points,
    (newPoints) => {
      team1Points.value = newPoints || 0;
    },
  );

  watch(
    () => gameStore.getCurrentGame(id)?.teams[1]?.points,
    (newPoints) => {
      team2Points.value = newPoints || 0;
    },
  );

  watch(
    () => gameStore.getBalls(id, 0),
    (newBalls) => {
      team1Balls.value = newBalls || [];
    },
  );

  watch(
    () => gameStore.getBalls(id, 1),
    (newBalls) => {
      team2Balls.value = newBalls || [];
    },
  );
});

function endGame(route) {
  visible.value = false;
  gameStore.end(id);
  if (route === 'stay') return;
  router.push({ name: route });
}

function toggleView() {
  threeDTableVisible.value = !threeDTableVisible.value;
  console.log(threeDTableVisible.value);
}

function playAgain() {
  const currentGame = gameStore.getCurrentGame(id);
  const teams = currentGame.teams.map((team) => ({
    name: team.name,
    usernames: team.usernames.map((user) => user.name),
  }));

  router.push({
    name: 'new',
    state: { previousTeams: teams },
  });
}

function undoLast() {
  if (gameStore.canUndo(id)) {
    gameStore.undo(id);
  }
}

const canUndo = computed(() => gameStore.canUndo(id));
</script>

<template>
  <div class="flex flex-col items-center h-full xl:mx-[20vw] mx-[8vw]">
    <Header
      ><template #action>
        <button
          @click="router.push({ name: 'stats', params: { id } })"
          class="px-5 py-2 hover:cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-500"
        >
          Show stats
        </button></template
      >
    </Header>
    <div class="flex flex-col mx-4 mb-6 w-full text-xl">
      <div
        v-if="gameStore.getCurrentGame(id)?.isFinished"
        class="bg-gray-200 py-2 justify-between text-center text-red-500 font-bold rounded mb-2 flex flex-col items-center"
      >
        <span>Game Finished</span>
      </div>
      <div v-if="gameStore.getCurrentGame(id)?.teams?.length >= 2" class="mt-3">
        <div class="flex justify-between items-center">
          <span class="text-slate-600">Team {{ gameStore.getCurrentGame(id).teams[0].name }} ({{ gameStore.getCurrentGame(id).teams[0].ballType }})</span>
          <span class="text-slate-600 text-right"
            >Team {{ gameStore.getCurrentGame(id).teams[1].name }} <({{ gameStore.getCurrentGame(id).teams[1].ballType }})</span
          >
        </div>
        <div class="my-2 text-2xl font-bold flex justify-center">
          <span>{{ team1Points }}:{{ team2Points }}</span>
        </div>
        <div class="flex justify-between">
          <span
            class="text-3xl"
            :class="gameStore.getCurrentGame(id).teams[0].isTurn ? 'font-bold' : ''"
            >{{ gameStore.getCurrentPlayerName(id, 0) }}</span
          >

          <span
            class="text-3xl text-right"
            :class="gameStore.getCurrentGame(id).teams[1].isTurn ? 'font-bold' : ''"
            >{{ gameStore.getCurrentPlayerName(id, 1) }}</span
          >
        </div>
        <div class="hidden sm:flex justify-between items-center">
          <div class="flex gap-x-2 items-center">
            <Ball
              v-for="ball in team1Balls"
              :key="ball"
              :number="ball"
              class="w-7"
              :clickable="false"
            />
          </div>
          <div class="flex gap-x-2 items-center">
            <Ball
              v-for="ball in team2Balls"
              :key="ball"
              :number="ball"
              class="w-7"
              :clickable="false"
            />
          </div>
        </div>
        <div class="flex items-center justify-end px-4 mt-2">
          <span class="text-sm font-medium mr-3 text-gray-700">2D</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="threeDTableVisible" />
            <div
              class="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300 ease-in-out"
            ></div>
            <div
              class="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ease-in-out peer-checked:translate-x-6"
            ></div>
          </label>
          <span class="text-sm font-medium ml-3 text-gray-700">3D</span>
        </div>
      </div>
    </div>
    <div class="w-full h-[60vh] relative">
      <FakeBillardTable
        class="w-full"
        v-if="!threeDTableVisible"
        :current-team-id="gameStore.getCurrentTeamIndex(id)"
        :game-id="id"
      />

      <BillardTable
        v-else
        ref="billardRef"
        :current-team-id="gameStore.getCurrentTeamIndex(id)"
        :game-id="id"
        class="w-full h-full block"
      />
      <div
        v-if="gameStore.getCurrentGame(id)?.isFinished"
        class="flex justify-center items-center absolute inset-0 z-10"
      >
        <div class="shadow-2xl flex flex-col gap-y-1">
          <Button label="Play Again" severity="success" @click="playAgain" />
          <Button label="Undo" severity="secondary" :disabled="!canUndo" @click="undoLast" />
        </div>
      </div>
    </div>

    <div
      class="flex gap-x-5 gap-y-2 w-full flex-wrap mb-3 mt-5"
      v-if="!gameStore.getCurrentGame(id)?.isFinished"
    >
      <Button label="Undo" severity="secondary" :disabled="!canUndo" @click="undoLast" />
      <Button
        label="Foul"
        severity="danger"
        @click="gameStore.foul(id, gameStore.getCurrentTeamIndex(id))"
      />
      <Button
        label="Next"
        severity="info"
        @click="gameStore.switchTurns(id, gameStore.getCurrentTeamIndex(id))"
        class="disabled:cursor-not-allowed"
      />
      <Button label="End game" severity="contrast" class="self-end" @click="visible = true" />
    </div>
    <div class="mt-6">
      <Button
        label="Return to home"
        severity="contrast"
        class="self-end"
        @click="router.push({ name: 'home' })"
      />
    </div>
    <Dialog v-model:visible="visible" modal header="End game" :style="{ width: '25rem' }">
      <span class="p-text-secondary block mb-5"
        >This action will end the current game! Don't worry, your game data is saved.</span
      >
      <div class="flex justify-content-end gap-2">
        <Button type="button" label="Show stats" @click="endGame('stats')"></Button>
        <Button type="button" label="Start new game" @click="endGame('new')"></Button>
        <Button type="button" label="Exit to menu" @click="endGame('home')"></Button>
        <Button type="button" label="Stay in game screen" @click="endGame('stay')"></Button>
      </div>
    </Dialog>
  </div>
</template>
