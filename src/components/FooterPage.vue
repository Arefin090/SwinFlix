<template>
    <footer class="footer">
      <div class="container mx-auto p-4 flex justify-between items-center">
        <div class="text-rose-700 font-bold">SwinFlix</div>
        <div class="text-gray-500 text-sm">&copy; 2023 SwinFlix. All rights reserved.</div>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-500 hover:text-rose-500">Home</a>
          <a href="#" class="text-gray-500 hover:text-rose-500">About</a>
          <a href="#" class="text-gray-500 hover:text-rose-500">Terms of Service</a>
        </div>
        <div class="text-gray-500 text-sm">Contact: info@swinflix.com</div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "FooterPage",
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #1a202c; /* A dark shade */
    border-top: 1px solid #000207; /* A slightly lighter shade for a subtle border */
  }
  </style>
  