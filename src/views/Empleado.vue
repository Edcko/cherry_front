<template>
  <v-table fixed-header height="500px">
    <thead>
      <tr>
<!--        <th class="text-left">ID</th> -->
        <th class="text-left">Nombre</th>
        <th class="text-left">Apellido Paterno</th>
        <th class="text-left">Apellido Materno</th>
        <th class="text-left">Puesto del empleado</th>
        <th class="text-left">Email</th>
        <th class="text-left">Teléfono</th>
        <th class="text-left">Fecha de Nacimiento</th>
        <th class="text-left">Sexo</th>
        <th class="text-left">Fecha de Contratación</th>
        <th class="text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="empleado in empleados" :key="empleado.id_empleado">
<!--        <td>{{ empleado.id_empleado }}</td> -->
        <td>{{ empleado.nombre_empleado }}</td>
        <td>{{ empleado.apellido_paterno }}</td>
        <td>{{ empleado.apellido_materno }}</td>
        <td>{{ empleado.tipo_empleado }}</td>
        <td>{{ empleado.email }}</td>
        <td>{{ empleado.telefono_empleado }}</td>
        <td>{{ helperServices.empleadoHelper.formatearFecha(empleado.fecha_nacimiento) }}</td>
        <td>{{ empleado.sexo }}</td>
        <td>{{ helperServices.empleadoHelper.formatearFecha(empleado.fecha_contratacion) }}</td>
        <td>
<!--          <v-btn color="white" @click="editEmpleado(empleado)">
            <edit-icon></edit-icon>
          </v-btn>

          -->

          <v-btn color="error" @click="openDeleteDialog(empleado)">
            <delete-icon></delete-icon>
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- Dialogo de confirmacion para eliminar -->

  <v-dialog v-model="deleteDialog" max-width="500px">
  <v-card>
    <v-card-title class="headline">Confirmación de eliminación</v-card-title>
    <v-card-text>
      ¿Estás seguro de que deseas eliminar al empleado con ID <span v-if="empleadoToDelete">{{ empleadoToDelete.id_empleado }}</span>?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="deleteDialog = false"
        >No</v-btn
      >
      <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  <div class="button-spacing"></div>

  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          color="white"
          elevation="8"
          rounded
          :large="true"
          class="mx-auto"
          v-bind="props"
        >
          <v-icon icon="mdi-checkbox-marked-circle"></v-icon>
          Dar de alta empleado
        </v-btn>
      </template>
      <empleado-dialog
        :showDialog="showDialog"
        @close="showDialog = false"
        @addEmpleado="addEmpleado"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { onMounted, ref } from 'vue';
//import apiService from '@/services/apiServices';
//import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import EmpleadoDialog from '@/components/EmpleadoDialog.vue';
import useEmpleados from '@/composables/useEmpleados';
import helperServices from '@/services/helperServices.js';

export default {
  name: 'Empleado_view',
  components: {
 // EditIcon,
    DeleteIcon,
    EmpleadoDialog,
  },
  setup() {
    const showDialog =  ref(false);
    const deleteDialog = ref(false);
    const empleadoToDelete = ref(null);
    const {empleados, addEmpleado, deleteEmpleado, fetchEmpleados } = useEmpleados();

   onMounted(fetchEmpleados);

    const openDeleteDialog = (empleado) => {
      empleadoToDelete.value = empleado;
      console.log(empleadoToDelete.value); // debug logging
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      console.log(empleadoToDelete); // debug logging
      deleteEmpleado(empleadoToDelete.value);
      empleadoToDelete.value = null; // o empleadoToDelete.value = {};
      deleteDialog.value = false;
    };

    return {
      showDialog,
      empleados,
      addEmpleado,
      deleteDialog,
      openDeleteDialog,
      confirmDelete,
      empleadoToDelete,
      helperServices
    };
  },
};
</script>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f5f5f5;
}

.button-spacing {
  padding-top: 30px;
}
</style>
