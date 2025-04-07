<template>
  <!-- Replicamos la estructura de CitaCard: un v-container con v-col y un v-card dentro -->
  <v-container fluid>
    <v-col>
      <v-card class="hora-libre-card">
        <!-- Título de la card -->
        <v-card-title class="hora-libre-header">
          <v-icon small class="mr-2">mdi-clock-outline</v-icon>
          Hora Disponible:
          <span class="hora-text">{{ hora }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Botón de acción -->
        <v-card-actions class="actions">
          <v-btn color="success" dark @click="agendarCita">
            <v-icon left>mdi-plus-circle</v-icon>
            Agregar Cita
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: "HoraLibreCard",
  props: ["hora"],
  methods: {
    agendarCita() {
      // Emitimos el evento para que el padre maneje la lógica de agendar
      this.$emit("agendar", this.hora);
    },
  },
};
</script>

<style scoped>
/* Card con un estilo similar a CitaCard, pero con un degradado */
.hora-libre-card {
  border-radius: 15px;
  /* Sombra suave */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Margen inferior para separar cards entre sí */
  margin-bottom: 15px;
  /* Fondo degradado */
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  /* Borde punteado */
  border: 1px dashed #0097a7;
  /* Animación de hover */
  transition: transform 0.2s ease-in-out;
}

.hora-libre-card:hover {
  transform: scale(1.02);
}

/* Título con tipografía y color similares a CitaCard */
.hora-libre-header {
  font-weight: 600;
  font-size: 1.1rem;
  color: #424242;
  display: flex;
  align-items: center;
}

/* Texto específico para la hora */
.hora-text {
  font-weight: 700;
  color: #004d40;
  margin-left: 4px;
}

/* Acciones centradas, con un poco de espacio */
.actions {
  display: flex;
  justify-content: center;
  padding: 16px;
  margin-top: 8px;
}
</style>
