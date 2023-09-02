const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    allowedHosts: [
      "4de4-136-186-248-240.ngrok-free.app", // Add your ngrok domain here
    ],
    https: true,
  },
});


