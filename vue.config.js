const webpack = require('webpack');
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
    ],
  },

  // Configuración de proxy para evitar problemas de CORS
  devServer: {
    proxy: {
      '/cherry': {
        target: 'https://gpocherry.com',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      }
    }
  },

})

