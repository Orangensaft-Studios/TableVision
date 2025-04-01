<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '@/stores/game';

const props = defineProps({
    number: {
        type: Number,
        required: true,
        validator: (value) => {
            return value >= 0 && value <= 15;
        }
    },
    teamId: {
        type: Number,
        required: false,
    },
    gameId: {
        type: Number,
        required: false,
    },
    clickable: {
        type: Boolean,
        default: true,
    }
});


const gameStore = useGameStore();

const colors = ref([
    '#F3C439',
    '#1E4C87',
    '#DA4435',
    '#5F4B9A',
    '#F9851D',
    '#3B6E45',
    '#A25128',
    '#000000'
]);

const thisColor = computed(() => {
    return colors.value[props.number < 9 ? props.number - 1 : props.number - 9];
});


const type = computed(() => {
    if (props.number === 8) {
        return 'black';
    }
    return props.number > 8 ? 'striped' : 'solid';
});

function playBall() {
    if (props.teamId !== undefined && props.gameId !== undefined) {
        gameStore.playedBall(props.gameId, props.teamId, type.value, props.number);
    }
}

const isHidden = computed(() => {
    if (props.teamId !== undefined && props.gameId !== undefined) {
        return gameStore.getBall(props.gameId, props.number);
    }
})
</script>

<template>
    <button @click="clickable ? playBall() : undefined" :class="{
        'cursor-pointer': clickable,
        'cursor-default': !clickable,
        'invisible': isHidden
    }" class="rounded-full relative w-7 h-7">
        <svg v-if="number === 0" id="Ebene_2_1" data-name="Ebene 2 1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 324 324">
            <g id="Ebene_1-2_2" data-name="Ebene 1 2">
                <g>
                    <path fill="#ffffff"
                        d="M162,320.5C74.6,320.5,3.5,249.4,3.5,162S74.6,3.5,162,3.5s158.5,71.1,158.5,158.5-71.1,158.5-158.5,158.5Z" />
                    <path
                        d="M162,7c41.4,0,80.33,16.12,109.6,45.4,29.28,29.28,45.4,68.2,45.4,109.6s-16.12,80.33-45.4,109.6c-29.28,29.28-68.2,45.4-109.6,45.4s-80.33-16.12-109.6-45.4C23.12,242.33,7,203.4,7,162S23.12,81.67,52.4,52.4C81.67,23.12,120.6,7,162,7M162,0C72.53,0,0,72.53,0,162s72.53,162,162,162,162-72.53,162-162S251.47,0,162,0h0Z" />
                </g>
                <g class="cls-2">
                    <path
                        d="M117.16,72.57c7.47,7.47-3.05,20.96-15.29,33.19s-24.19,23.04-31.66,15.57c-7.47-7.47-3.93-29,8.31-41.23s31.17-15.01,38.64-7.54Z"
                        fill="#EAEAEA" fill-opacity="0.79" />
                </g>
            </g>
        </svg>
        <svg v-else-if="number < 9" id="Ebene_2_1" data-name="Ebene 2 1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 324 324">
            <g id="Ebene_1-2_2" data-name="Ebene 1 2">
                <g>
                    <path :fill="thisColor"
                        d="M162,320.5C74.6,320.5,3.5,249.4,3.5,162S74.6,3.5,162,3.5s158.5,71.1,158.5,158.5-71.1,158.5-158.5,158.5Z" />
                    <path
                        d="M162,7c41.4,0,80.33,16.12,109.6,45.4,29.28,29.28,45.4,68.2,45.4,109.6s-16.12,80.33-45.4,109.6c-29.28,29.28-68.2,45.4-109.6,45.4s-80.33-16.12-109.6-45.4C23.12,242.33,7,203.4,7,162S23.12,81.67,52.4,52.4C81.67,23.12,120.6,7,162,7M162,0C72.53,0,0,72.53,0,162s72.53,162,162,162,162-72.53,162-162S251.47,0,162,0h0Z" />
                </g>
                <g>
                    <path
                        d="M162,229.34c-37.13,0-67.34-30.21-67.34-67.34s30.21-67.34,67.34-67.34,67.34,30.21,67.34,67.34-30.21,67.34-67.34,67.34Z"
                        fill="#fff" />
                    <path
                        d="M162,97.66c35.48,0,64.34,28.86,64.34,64.34s-28.86,64.34-64.34,64.34-64.34-28.86-64.34-64.34,28.86-64.34,64.34-64.34M162,91.66c-38.85,0-70.34,31.49-70.34,70.34s31.49,70.34,70.34,70.34,70.34-31.49,70.34-70.34-31.49-70.34-70.34-70.34h0Z" />
                </g>
                <text class="cls-3" transform="translate(143.57 202.69)">
                    <tspan x="-7" y="-5">{{ number }}</tspan>
                </text>
                <g class="cls-2">
                    <path
                        d="M117.16,72.57c7.47,7.47-3.05,20.96-15.29,33.19s-24.19,23.04-31.66,15.57c-7.47-7.47-3.93-29,8.31-41.23s31.17-15.01,38.64-7.54Z"
                        fill="#EAEAEA" fill-opacity="0.79" />
                </g>
            </g>
        </svg>
        <svg v-else id="Ebene_2" data-name="Ebene 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324 324">
            <g id="Ebene_1-2" data-name="Ebene 1">
                <g>
                    <path class="cls-1" fill="#ffffff"
                        d="M162,320.5C74.6,320.5,3.5,249.4,3.5,162S74.6,3.5,162,3.5s158.5,71.1,158.5,158.5-71.1,158.5-158.5,158.5Z" />
                    <path
                        d="M162,7c41.4,0,80.33,16.12,109.6,45.4s45.4,68.2,45.4,109.6-16.12,80.33-45.4,109.6-68.2,45.4-109.6,45.4-80.33-16.12-109.6-45.4S7,203.4,7,162,23.12,81.67,52.4,52.4C81.67,23.12,120.6,7,162,7M162,0C72.53,0,0,72.53,0,162s72.53,162,162,162,162-72.53,162-162S251.47,0,162,0h0Z" />
                </g>
                <g>
                    <path :fill="thisColor"
                        d="M33.65,255.01c-17.84-24.57-28.17-53.54-29.89-83.9v-18.21c1.72-30.36,12.05-59.33,29.89-83.9h256.7c17.84,24.57,28.17,53.54,29.89,83.9v18.21c-1.72,30.36-12.05,59.33-29.89,83.9H33.65Z" />
                    <path
                        d="M288.55,72.49c16.79,23.69,26.52,51.44,28.18,80.5v18.02c-1.66,29.06-11.39,56.81-28.18,80.5H35.45c-16.79-23.69-26.52-51.44-28.18-80.5v-18.02c1.66-29.06,11.39-56.81,28.18-80.5h253.1M292.12,65.49H31.88C13.56,90.14,2.09,120.18.27,152.79v18.41c1.83,32.61,13.3,62.65,31.61,87.3h260.24c18.32-24.65,29.79-54.69,31.61-87.3v-18.41c-1.83-32.61-13.3-62.65-31.61-87.3h0Z" />
                </g>
                <g>
                    <path class="cls-1"
                        d="M162,229.34c-37.13,0-67.34-30.21-67.34-67.34s30.21-67.34,67.34-67.34,67.34,30.21,67.34,67.34-30.21,67.34-67.34,67.34Z" />
                    <path
                        d="M162,97.66c35.48,0,64.34,28.86,64.34,64.34s-28.86,64.34-64.34,64.34-64.34-28.86-64.34-64.34,28.86-64.34,64.34-64.34M162,91.66c-38.85,0-70.34,31.49-70.34,70.34s31.49,70.34,70.34,70.34,70.34-31.49,70.34-70.34-31.49-70.34-70.34-70.34h0Z"
                        fill="#ffffff" />
                </g>
                <text class="cls-3" transform="translate(137.78 202.69)">
                    <tspan :x="number > 9 ? -25 : -5" :y="-5">{{ number }}</tspan>
                </text>
                <g class="cls-2">
                    <path class="cls-5"
                        d="M106.09,78.58c7.47,7.47-3.05,20.96-15.29,33.19s-24.19,23.04-31.66,15.57c-7.47-7.47-3.93-29,8.31-41.23s31.17-15.01,38.64-7.54Z" />
                </g>
            </g>
        </svg>
    </button>
</template>
<style scoped>
.cls-1 {
    fill: #fff;
}

.cls-2 {
    opacity: .79;
}

.cls-3 {
    font-family: BernardMT-Condensed, 'Bernard MT Condensed';
    font-size: 101px;
}

.cls-5 {
    fill: #eaeaea;
}
</style>
