import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Game from '../views/Game.vue';
import CreateGame from '@/views/CreateGame.vue';
import GameStats from '@/views/GameStats.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/games/new', name: 'new', component: CreateGame },
    { path: '/games/:id', name: 'games', component: Game },
    { path: '/games/:id/stats', name: 'stats', component: GameStats },
  ],
});

export default router;
