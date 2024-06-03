<template>
  <v-container fluid>
    <v-col>
      <v-card>
        <v-card-title class="headline">
          Hora Disponible: {{ hora }}
        </v-card-title>
        <v-card-actions class="actions">
          <v-btn color="success" @click="agendarCita">
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
      this.$emit("agendar", this.hora);
    }
  }
};
</script>

<style scoped>
.headline {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.0075em;
}

.actions {
  justify-content: center;
  margin-top: -10px;
}

.hora-libre-card {
  background-color: #e0f7fa; /* Color azul claro */
  border: 1px dashed #0097a7; /* Borde punteado azul */
}

.v-card-title {
  display: flex;
  justify-content: space-between;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
}
</style>
