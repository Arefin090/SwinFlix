import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase';
import { ref } from 'vue';

// Import Swiper
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Create a user ref with a default value of null
export const user = ref(null);

let app;
auth.onAuthStateChanged((authUser) => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .component('Swiper', Swiper)
      .component('SwiperSlide', SwiperSlide)
      .mount('#app');
  }

  if (authUser) {
    // Set the user ref to the logged-in user's data
    user.value = authUser;
  } else {
    // Clear the user ref if no user is logged in
    user.value = null;
  }
});
