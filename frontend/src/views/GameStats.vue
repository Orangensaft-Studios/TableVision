<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Ball from '@/components/Ball.vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const gameID = parseInt(route.params.id);
const gameStore = useGameStore();
const stats = computed(() => gameStore.getStatsPerTeam(gameID));
const startDate = computed(() => {
  const date = gameStore.getStartDate(gameID);
  if (!date) return '';
  return new Date(date).toLocaleDateString();
});

async function copyStats() {
  const teams = stats.value || [];
  let md = `# Game ${gameID} Stats\n\n`;
  md += `Date: ${startDate.value}\n`;

  teams.forEach((team) => {
    md += `## Team ${team.name}`;
    if (team.ballType) md += ` (${team.ballType})`;
    const anyWinner = teams.some(t => t.didWin);
    if (anyWinner) {
      md += team.didWin ? ` — Winner 🏆` : ` — Loser ❌`;
    }
    md += `\n`;
    md += `- Points: ${team.points}\n`;
    md += `- Fouls: ${team.fouls}\n`;

    md += `### Players\n`;
    (team.players || []).forEach((p) => {
      const name = String(p.name || '').replace(/\|/g, '\\|');
      md += `- ${name}:\n`;
      md += `  - ${p.points ?? 0} point${(p.points ?? 0) === 1 ? '' : 's'}\n`;
      md += `  - ${p.fouls ?? 0} foul${(p.fouls ?? 0) === 1 ? '' : 's'}\n`;
      md += `  - ${p.plays ?? 0} play${(p.plays ?? 0) === 1 ? '' : 's'}\n`;
    });

    md += `### Balls\n`;
    if (team.balls && team.balls.length) {
      md += team.balls.join(', ') + '\n';
    } else {
      md += `No balls played\n`;
    }
    md += `\n`;
  });

  await navigator.clipboard.writeText(md).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Stats copied to clipboard',
      life: 3000,
    });
  });
}
</script>

<template>
  <Toast />
  <div class="flex flex-col h-full mx-[20vw] p-4">
    <Header>
      <template #action>
        <button
          @click="router.push({ name: 'games', params: { id: gameID } })"
          class="px-5 py-2 hover:cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-500"
        >
          Back to Game
        </button>
      </template>
    </Header>

    <div class="flex flex-col items-center mt-2">
      <h1 class="font-bold text-2xl text-green-900">Game Stats</h1>
      <div class="flex justify-between w-full">
        <h2 class="font-semibold text-xl text-green-900">Game {{ gameID }}</h2>
        <h2 class="font-semibold text-xl text-green-900">
          {{ startDate }}
        </h2>
      </div>
    </div>

    <div class="grid gap-6 mt-4">
      <div
        v-for="(team, idx) in stats"
        :key="idx"
        :class="[
          'bg-white shadow-md rounded-lg p-6 border',
          team.didWin ? 'border-red-500 border-4 relative' : 'border-gray-200',
        ]"
      >
        <span
          v-if="team.didWin"
          class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg"
        >
          Winner
        </span>
        <h2 class="text-2xl font-semibold text-green-800">
          Team {{ team.name }}
          <span v-if="team.ballType" class="text-base text-green-600">({{ team.ballType }})</span>
        </h2>
        <table class="mt-4 min-w-32 text-md">
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="py-2 font-bold">Points</td>
              <td class="py-2 font-medium">{{ team.points }}</td>
            </tr>
            <tr>
              <td class="py-2 font-bold">Fouls</td>
              <td class="py-2 font-medium">{{ team.fouls }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4">
          <h3 class="font-semibold text-lg">Players:</h3>
          <table class="w-full mt-2 text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2">Name</th>
                <th class="text-center py-2">Points</th>
                <th class="text-center py-2">Fouls</th>
                <th class="text-center py-2">Shots</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, id) in team.players" :key="id" class="border-b border-gray-100">
                <td class="py-2">{{ player.name }}</td>
                <td class="text-center py-2">{{ player.points }}</td>
                <td class="text-center py-2">{{ player.fouls }}</td>
                <td class="text-center py-2">{{ player.plays }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <h3 class="font-semibold text-lg">Balls:</h3>
          <div v-if="team.balls && team.balls.length" class="flex flex-wrap gap-x-1">
            <Ball :clickable="false" :number="ball" v-for="ball in team.balls"></Ball>
          </div>
          <p class="text-sm" v-else>No balls played</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <button
        @click="copyStats"
        class="ml-4 px-5 py-2 hover:cursor-pointer bg-green-600 text-white rounded-sm hover:bg-green-500"
      >
        Copy stats
      </button>
    </div>
  </div>
</template>
