<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Crear Cita</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Terapeuta" v-model="cita.id_empleado" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Cliente" v-model="cita.id_cliente" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Cabina" v-model="cita.id_cabina" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Sesión" v-model="cita.id_sesion" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="['Programado','Realizado', 'Adeudo', 'Cita perdida' ,'Reagendado', 'Cancelado' ]"
              label="Estado"
              v-model="cita.estado"
              required
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Fecha y hora" v-model="cita.fecha" type="datetime-local" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Cerrar</v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="onSubmit">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from "vue";
import { utcToZonedTime, format } from "date-fns-tz";

export default {
  props: ["showDialog"],
  setup(props, { emit }) {
    const cita = ref({
      id_empleado: "",
      id_cliente: "",
      id_cabina: "",
      id_sesion: "",
      fecha: "",
      estado: "Programado",
    });

    const onSubmit = () => {
  // Convierte la fecha y la hora de la zona horaria de México a la hora local
  const fechaUTC = new Date(cita.value.fecha);
  console.log("fechaUTC:", fechaUTC);
  const fechaLocal = utcToZonedTime(fechaUTC, "America/Mexico_City");
  console.log("fechaLocal:", fechaLocal);

  // Formatea la fecha y la hora a ISO y las guarda en la cita
  cita.value.fecha = format(fechaLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS");

  
  emit("addCita", cita.value);
  emit("close");
  console.log("Fecha enviada:", cita.value.fecha);
};

    return {
      cita,
      onSubmit,
    };
  },
};

</script>

<style>
.dialog {
  /* Estilos para el diálogo de creación de citas */
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  padding: 40px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  z-index: 100;
}
</style>
