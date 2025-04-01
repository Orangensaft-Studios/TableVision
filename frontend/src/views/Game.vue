<script setup>
import Header from '@/components/Header.vue';
import FakeBillardTable from '@/components/FakeBillardTable.vue';
import Button from 'primevue/button';
import { useGameStore } from '@/stores/game';
import { onMounted, watch, ref } from 'vue';
import Ball from '@/components/Ball.vue';
import Dialog from 'primevue/dialog';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const id = Number(route.params.id);

const team1Points = ref(0);
const team2Points = ref(0);

const team1Balls = ref([]);
const team2Balls = ref([]);

const visible = ref(false);

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
        { immediate: true }
    );
    
    watch(() => gameStore.getCurrentGame(id)?.teams[0]?.points, (newPoints) => {
        team1Points.value = newPoints || 0;
    });

    watch(() => gameStore.getCurrentGame(id)?.teams[1]?.points, (newPoints) => {
        team2Points.value = newPoints || 0;
    });

    watch(() => gameStore.getBalls(id, 0), (newBalls) => {
        team1Balls.value = newBalls || [];
    });

    watch(() => gameStore.getBalls(id, 1), (newBalls) => {
        team2Balls.value = newBalls || [];
    });
});

function endGame(route) {
    visible.value = false;
    gameStore.end(id);
    router.push({ name: route });
}

</script>

<template>
    <div class="flex flex-col items-center h-full mx-[20vw]">
        <Header><template #action><!--statsbutton--></template></Header>
        <div class="flex flex-col mx-4 mb-2 w-full text-xl">
            <!-- Teams -->
            <div v-if="gameStore.getCurrentGame(id)?.teams?.length >= 2" class="flex justify-between">
                <span class=" text-slate-600">Team {{ gameStore.getCurrentGame(id).teams[0].name }}</span>
                <div class="text-2xl flex gap-x-2">
                    <div>
                        <Ball v-for="ball in team1Balls" :key="ball" :number="ball" class="w-7" :clickable="false" />
                    </div>
                    <span>{{ team1Points }}:{{team2Points }}</span>
                    <div>
                        <Ball v-for="ball in team2Balls" :key="ball" :number="ball" class="w-7" :clickable="false" />
                    </div>
                </div>
                <span class="text-slate-600 text-end">Team {{ gameStore.getCurrentGame(id).teams[1].name }}</span>
            </div>


            <div class="flex justify-between">
                <span class="text-3xl" :class="gameStore.getCurrentGame(id).teams[0].isTurn ? 'font-bold' : ''">{{
                    gameStore.getCurrentPlayerName(id, 0)
                    }}</span>
                <span class="text-3xl" :class="gameStore.getCurrentGame(id).teams[1].isTurn ? 'font-bold' : ''">{{
                    gameStore.getCurrentPlayerName(id, 1)
                    }}</span>
            </div>

        </div>
        <div class="w-[50vw] h-[60vh]">
            <!--Place Billard table here-->
            <FakeBillardTable :current-team-id="gameStore.getCurrentTeamIndex(id)" :game-id="id" />
        </div>

        <div class="flex gap-x-5 gap-y-2 w-full flex-wrap mb-3 mt-5">
            <Button label="Foul" severity="danger" @click="gameStore.foul(id, gameStore.getCurrentTeamIndex(id))" />
            <Button label="Security" severity="warning" />
            <Button label="Next" severity="info"
                @click="gameStore.switchTurns(id, gameStore.getCurrentTeamIndex(id))" />
            <Button label="End game" severity="contrast" class="self-end" @click="visible = true" />
        </div>
        <Dialog v-model:visible="visible" modal header="End game" :style="{ width: '25rem' }">
            <span class="p-text-secondary block mb-5">This action will end the current game! Don't worry, your game data is saved.</span>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Show stats" @click="endGame('stats')"></Button>
                <Button type="button" label="Start new game" @click="endGame('new')"></Button>
                <Button type="button" label="Exit to menu" @click="endGame('home')"></Button>
            </div>
        </Dialog>

    </div>
</template>
