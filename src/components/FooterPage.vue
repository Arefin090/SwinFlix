<template>
  <footer class="bg-black border-t border-gray-800 mt-16">
    <div class="container mx-auto px-6 py-8">
      <div
        class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
      >
        <!-- Brand -->
        <div class="flex items-center space-x-8">
          <h3
            class="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
          >
            FinnFlix
          </h3>
          <div class="hidden md:flex items-center space-x-6">
            <router-link
              to="/"
              class="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Home
            </router-link>
            <router-link
              to="/booking-history"
              class="text-gray-400 hover:text-white transition-colors text-sm"
            >
              My List
            </router-link>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-gray-500 text-sm text-center">
          &copy; {{ currentYear }} FinnFlix. Made with ❤️ for movie lovers.
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterPage',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>
