<template>
    <v-card class="mb-3 hora-libre-card">
      <v-card-title class="headline">
        Hora Disponible: {{ hora }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="green" @click="agendarCita">Agendar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "HoraLibreCard",
    props: ["hora"],
    methods: {
      agendarCita() {
        this.$emit("agendar", this.hora);
      }
    }
  };
  </script>
  
  <style scoped>
  .hora-libre-card {
    background-color: #e0f7fa; /* Color azul claro */
    border: 1px dashed #0097a7; /* Borde punteado azul */
  }
  </style>
  