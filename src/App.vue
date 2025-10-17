<template>
  <div id="app">
    <router-view/>
    <FooterPage/>
  </div>
</template>

<script>
import FooterPage from './components/FooterPage.vue';

// import MovieExplorer from "./components/MovieExplorer.vue";
 //import UserLogin from "./components/UserLogin.vue";

export default {
  components: 
  {
    FooterPage
  },
};
</script>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

body {
  font-family: "Inter", sans-serif;
  background: #000;
  overflow-x: hidden;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Movie card animations */
.movie-card {
  perspective: 1000px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.2);
}

/* Glowing text animation */
@keyframes glow {
  0%, 100% { text-shadow: 0 0 5px rgba(239, 68, 68, 0.5), 0 0 10px rgba(239, 68, 68, 0.3); }
  50% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.5); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Loading animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Particle animations for hero section */
.particle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.3), rgba(236, 72, 153, 0.3));
  animation: float 20s infinite linear;
}

.particle-1 {
  width: 8px;
  height: 8px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 12px;
  height: 12px;
  top: 60%;
  left: 80%;
  animation-delay: -5s;
}

.particle-3 {
  width: 6px;
  height: 6px;
  top: 80%;
  left: 20%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
    opacity: 0.9;
  }
}
</style>
