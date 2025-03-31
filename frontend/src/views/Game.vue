<script setup>
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import FakeBillardTable from '@/components/FakeBillardTable.vue';
import Button from 'primevue/button';
import { useGameStore } from '@/stores/game';
import { onMounted, watch, ref } from 'vue';


const route = useRoute();
const gameStore = useGameStore();

const team1Points = ref(0);
const team2Points = ref(0);

onMounted(() => {
    gameStore.setCurrentGame(route.params.id); 
    watch(
        () => gameStore.currentGame,
        (newGame) => {
            if (newGame && newGame.teams) {
                team1Points.value = newGame.teams[0]?.points || 0;
                team2Points.value = newGame.teams[1]?.points || 0;
            }
        },
        { immediate: true }
    );

    watch(() => gameStore.currentGame?.teams[0]?.points, (newPoints) => {
        team1Points.value = newPoints || 0;
    });

    watch(() => gameStore.currentGame?.teams[1]?.points, (newPoints) => {
        team2Points.value = newPoints || 0;
    });
})

</script>

<template>
    <div class="flex flex-col items-center h-full mx-[20vw]">
        <Header><template #action><!--statsbutton--></template></Header>
        <div class="flex flex-col mx-4 mb-2 w-full text-xl">
            <!-- Teams -->
            <div class="flex justify-between"> <span class=" text-slate-600">Team {{
                    
                    }}</span>
                <span class="text-2xl">{{ team1Points }}:{{ team2Points }}</span>
                <span class="text-slate-600 text-end">Team {{ 
                 }}</span>

            </div>

            
            <div class="flex justify-between">
                <span class="text-3xl">{{ "Roman" }}</span>
                <span class="text-3xl">{{ "Sevi" }}</span>
            </div>

        </div>
        <div class="w-[50vw] h-[60vh]">
            <!--Place Billard table here-->
            <FakeBillardTable />
        </div>

        <div class="flex gap-x-5 gap-y-2 w-full flex-wrap mb-3 mt-5">
            <Button label="Foul" severity="danger" />
            <Button label="Security" severity="warning" />
            <Button label="Next" severity="info" />
            <Button label="End game" severity="contrast" class="self-end" />
        </div>

    </div>
</template>
