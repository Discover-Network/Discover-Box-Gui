const { defineConfig } = require("@vue/cli-service");
const NodePolyFillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    proxy: {
      "/api/v1/": {
        // target: "http://158.247.224.99:5577",
        target: "http://45.77.30.9:5577",
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [new NodePolyFillPlugin()],
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Trojan Box";
      return args;
    });
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#007AFF",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
