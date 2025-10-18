import { createRouter, createWebHistory } from 'vue-router';
import MovieExplorer from '@/components/MovieExplorer.vue';
import BookingConfirmation from '@/components/BookingConfirmation.vue';
import UserLogin from '@/components/UserLogin.vue';
import BookingHistory from '@/components/BookingHistory.vue';

const routes = [
  {
    path: '/',
    name: 'MovieExplorer',
    component: MovieExplorer,
  },

  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
  },

  {
    path: '/confirmation',
    name: 'BookingConfirmation',
    component: BookingConfirmation,
  },

  {
    path: '/booking-history',
    name: 'BookingHistory',
    component: BookingHistory,
  },
  // other routes...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
