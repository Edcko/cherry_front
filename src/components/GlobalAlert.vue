<template>
    <v-alert v-show="show" :type="type" dismissible app class="global-alert">
      {{ message }}
    </v-alert>
  </template>
  
  <script>
  export default {
    name: "GlobalAlert",
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "error",
      },
    },
  };
  </script>
  
  <style scoped>
  .global-alert {
    /* Agrega un z-index alto para asegurarte de que la alerta se muestre por encima de otros elementos */
    z-index: 10000;
  
    /* Ajusta la posición de la alerta */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 16px; /* Ajusta este valor según el margen deseado */
  }
  </style>
  