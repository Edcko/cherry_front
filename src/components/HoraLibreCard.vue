<template>
  <v-container fluid>
    <v-col>
      <v-card class="hora-card">
        <v-card-title class="hora-card-header">
          <v-icon small class="mr-2">mdi-clock-outline</v-icon>
          Hora Disponible:
          <span class="hora-text">{{ hora }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="actions">
          <v-btn color="success" dark @click="agendarCita">
            <v-icon left>mdi-plus-circle</v-icon>
            Agregar Cita
          </v-btn>
         <v-btn color="error" dark @click="abrirCerrarCabinaDialog">
            <v-icon left>mdi-close-circle</v-icon>
            Cerrar Cabina
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
      this.$emit("agendar", this.hora);
    },
    abrirCerrarCabinaDialog() {
      this.$emit("cerrarCabina", this.hora);
    }
  },
};
</script>

<style scoped>
.hora-card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  border: 1px dashed #0097a7;
  transition: transform 0.2s ease-in-out;
  padding: 8px;
  /* Establece un ancho mínimo para mantener coherencia */
  min-width: 250px;
  max-width: 350px;
}
.hora-card:hover {
  transform: scale(1.02);
}
.hora-card-header {
  font-weight: 600;
  font-size: 1rem;
  color: #424242;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.hora-text {
  font-weight: 700;
  color: #004d40;
  margin-left: 4px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px;
  gap: 8px;
}

/* Adaptaciones para pantallas pequeñas */
@media (max-width: 600px) {
  .hora-card {
    font-size: 0.9rem;
    padding: 4px;
    min-width: 200px;
    max-width: 300px;
  }
  .actions {
    padding: 4px;
    gap: 4px;
    flex-direction: column;
    align-items: center;
  }
  .hora-card-header {
    font-size: 0.9rem;
  }
}
</style>
