const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    allowedHosts: [
      'ec2-3-21-28-163.us-east-2.compute.amazonaws.com',
      // Agrega cualquier otro host que necesites aquí
    ],
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})

