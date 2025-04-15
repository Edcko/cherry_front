<template>
  <v-container fluid>
    <v-col>
      <v-card class="hora-bloqueada-card">
        <v-card-title class="hora-bloqueada-header">
          <v-icon small class="mr-2">mdi-lock</v-icon>
          Hora Cerrada:
          <span class="hora-text">{{ hora }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="bloqueo-text">
          {{ motivoBloqueo }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: "HoraBloqueadaCard",
  props: {
    hora: {
      type: String,
      required: true,
    },
    motivoBloqueo: {
      type: String,
      default: "Bloqueo",
    },
  },
};
</script>

<style scoped>
.hora-bloqueada-card {
  border-radius: 15px;
  /* Actualizamos el box-shadow para que sea similar al de HoraLibreCard */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  background: linear-gradient(135deg, #ffebee, #ef9a9a);
  border: 1px solid #b71c1c;
  transition: transform 0.2s ease-in-out;
  padding: 8px;
  min-width: 250px;
  max-width: 350px;
}
.hora-bloqueada-card:hover {
  transform: scale(1.02);
}
.hora-bloqueada-header {
  font-weight: 600;
  font-size: 1.1rem;
  color: #b71c1c;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.hora-text {
  font-weight: 700;
  color: #b71c1c;
  margin-left: 4px;
}
.bloqueo-text {
  font-size: 0.9rem;
  color: #b71c1c;
  padding: 8px;
}

/* Media query para adaptar en pantallas pequeñas */
@media (max-width: 600px) {
  .hora-bloqueada-card {
    font-size: 0.9rem;
    padding: 4px;
    min-width: 200px;
    max-width: 300px;
  }
  .hora-bloqueada-header {
    font-size: 0.9rem;
  }
}
</style>
