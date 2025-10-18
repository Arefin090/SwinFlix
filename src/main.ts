import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { pinia, useAuthStore } from './stores';

// Import Swiper
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Initialize the app
const app = createApp(App);

app.use(pinia);
app.use(router);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);
app.mount('#app');

// Initialize auth state management
const authStore = useAuthStore();
authStore.initializeAuth();
