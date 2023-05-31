<template>
  <v-col cols="12" md="6" lg="12" class="mt-5">
    <v-card class="mb-3">
      <v-card-title class="headline">
        Número de cita: {{ cita.id_cita }}
        <div class="title-text">
          <strong>Cliente: </strong> {{ cita.id_cliente }} - {{ cita.Cliente.nombre_cliente }} {{ cita.Cliente.apellido_paterno }} {{ cita.Cliente.apellido_materno }}
        </div>
      </v-card-title>
      <v-card-subtitle>{{ formatDate(cita.fecha) }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Empleado:</strong> {{ cita.id_empleado }} - {{ cita.Empleado.nombre_empleado }}  {{ cita.Empleado.apellido_paterno }} {{ cita.Empleado.apellido_materno }}</p>
        <p><strong>Cabina:</strong> {{ cita.id_cabina }} - {{ cita.Cabina.estado_cabina }}</p>
        <p><strong>Sesión:</strong> {{ cita.id_sesion }} - {{ cita.Sesion.descripcion }}</p>
        <p :style="{ backgroundColor: getColorForEstado(cita.estado), color: 'white', padding: '5px', borderRadius: '5px' }"><strong>Estado:</strong> {{ cita.estado }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="editCita(cita)">Editar</v-btn>
        <v-btn color="error" @click="handleDeleteCita(cita)">Eliminar</v-btn>
        <v-btn color="success" @click="changeEstado(cita)">
          Cambiar Estado
        </v-btn>
      </v-card-actions>
      <cita-edit-dialog
        v-model="showEditDialog"
        :cita="currentCita"
        @update="updateCitaFromForm"
        @closeDialog="showEditDialog = false"
      />
    </v-card>

    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de eliminar la cita {{ citaToDelete.id_cita }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="deleteCita">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { ref } from "vue";
import { formatDate } from "@/utils/dateUtils";
import useCitas from "@/composables/useCitas";
import CitaEditDialog from "@/components/CitaEditDialog.vue";
import chroma from "chroma-js";

export default {
  name: "CitaCard",
  components: {
    CitaEditDialog,
  },
  props: ["cita"],
  setup(props, {emit}) {
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const confirmDeleteDialog = ref(false);
    const citaToDelete = ref(null);

    const {    
      changeEstado,
    } = useCitas();

    const handleDeleteCita = (cita) => {
      citaToDelete.value = cita;
      confirmDeleteDialog.value = true;
    };

    const deleteCita = () => {
      emit("deleteCita", citaToDelete.value);
      confirmDeleteDialog.value = false;
    };

    const editCita = (cita) => {
      currentCita.value = cita;
      showEditDialog.value = true;
    };

    const updateCitaFromForm = (cita) => {
      emit('updateCita', cita);
    };

    return {
      formatDate,
      editCita,
      showEditDialog,
      currentCita,
      updateCitaFromForm,
      changeEstado,
      handleDeleteCita,
      confirmDeleteDialog,
      citaToDelete,
      deleteCita,
    };
  },
  methods: {
    getColorForEstado(estado) {
      const colors = {
      'adeudo': '#a62520', // Rojo
      'reagendo': '#eeca06', // Amarillo
      'cita perdida': '#84b6f4', // Azul turquesa
      'programado': '#9754af', // Morado
      'realizado': '#77dd77' // Verde pastel
    };
    const color = colors[estado.toLowerCase()] || '#9e9e9e'; // Gris por defecto
    return chroma(color).hex();
    },
  },
};
</script>

<style scope>
.title-text {
  font-size: 1rem;
  font-weight: bold;
}
</style>
