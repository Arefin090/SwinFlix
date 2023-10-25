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
}
</style>
