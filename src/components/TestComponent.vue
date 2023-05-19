<!-- TestComponent.vue -->
<template>
    <div>
      <v-btn @click="showTestAlert">Mostrar Alerta de Prueba</v-btn>
    </div>
  </template>
  
  <script>
  export default {
    name: "TestComponent",
    methods: {
      showTestAlert() {
        this.$showAlert("¡Esto es una alerta de prueba!", "success");
      },
    },
  };
  </script>
  