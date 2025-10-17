const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue']
    }
  },
  devServer: {
    allowedHosts: [
      "4de4-136-186-248-240.ngrok-free.app", // Add your ngrok domain here
    ],
    https: true,
  },
});


