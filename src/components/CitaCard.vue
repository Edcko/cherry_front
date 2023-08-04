<template>
  <v-container v-if="user" fluid>
  <v-col cols="12" md="6" lg="12" class="mt-5">
    <v-card class="mb-3">
      <v-card-title class="headline">
        Fecha: {{ formatDate(cita.fecha) }}
        <div class="title-text">
          <strong>Cliente: </strong> {{ cita.Cliente.nombre_cliente }} {{ cita.Cliente.apellido_paterno }} {{ cita.Cliente.apellido_materno }}
        </div>
      </v-card-title>
    <!--  <v-card-subtitle> {{ formatDate(cita.fecha) }}</v-card-subtitle> -->
      <v-card-text>
        <p><strong>Agendo:</strong> {{ cita.Empleado?.nombre_empleado }}  {{ cita.Empleado?.apellido_paterno }} {{ cita.Empleado?.apellido_materno }}</p> 
        <p><strong>Cabina:</strong> {{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}  </p>
        <p><strong>Terapeuta:</strong> {{ cita.Cabina.Empleado.nombre_empleado }} {{ cita.Cabina.Empleado.apellido_paterno }} {{ cita.Cabina.Empleado.apellido_materno }}</p>
        <p><strong>Paquete:</strong> {{ cita.Paquete.nombre_paquete }}</p>
    <!--<p><strong>Sesión:</strong> {{ cita.Sesion.descripcion }}</p> -->
        <p :style="{ backgroundColor: getColorForEstado(cita.estado), color: 'white', padding: '5px', borderRadius: '5px' }"><strong>Estado:</strong> {{ cita.estado }}</p>
      </v-card-text>
      <v-card-actions>
<!--       <v-btn color="primary" @click="editCita(cita)">Editar</v-btn> -->
    <v-btn v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente'" color="error" @click="handleDeleteCita(cita)">Eliminar</v-btn>
    <v-btn v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente'" color="success" @click="changeEstado(cita)">
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
  </v-container>

  <v-container v-else fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="teal"
          size="70"
        ></v-progress-circular>
      </v-row>
    </v-container>

</template>

<script>
import { ref, onMounted } from "vue";
import { formatDate } from "@/utils/dateUtils";
import useCitas from "@/composables/useCitas";
import useUser from "@/composables/useUser";
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
    const { user, loadUser } = useUser();
    
    onMounted( async () => { 
      
      await loadUser();
    });

    const {    
      changeEstado, citas,
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
      user,
      citas
    };
  },
  methods: {
    getColorForEstado(estado) {
      const colors = {
      'cita programada': '#9754af', // Morado
      'cita realizada': '#77dd77', // Verde pastel
      'cita perdida': '#84b6f4', // Azul turquesa
      'reagendo cita': '#eeca06', // Amarillo
      'adeudo': '#a62520', // Rojo
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
