<template>
  <div class="employee-container">
    <v-row>
      <v-col v-for="empleado in empleados" :key="empleado.id_empleado" cols="12" md="4">
        <v-card class="mx-auto mb-4" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-h6 mb-1">
                {{ empleado.nombre_empleado }} {{ empleado.apellido_paterno }} {{ empleado.apellido_materno }}
              </div>
              <div class="text-caption">
                Puesto: {{ empleado.tipo_empleado }}
              </div>
              <div class="text-caption">
                Email: {{ empleado.email }} | Tel: {{ empleado.telefono_empleado }}
              </div>
              <div class="text-caption">
                Nacimiento: {{ helperServices.empleadoHelper.formatearFecha(empleado.fecha_nacimiento) }}
              </div>
              <div class="text-caption">
                Contratación: {{ helperServices.empleadoHelper.formatearFecha(empleado.fecha_contratacion) }}
              </div>
              <div class="text-caption">
                Genero: {{ empleado.sexo }}
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn color="error" @click="openDeleteDialog(empleado)">
              <delete-icon></delete-icon> Eliminar
            </v-btn>
<!--
            <v-btn color="primary" @click="openEditDialog(empleado)">
              <v-icon>mdi-pencil</v-icon> Editar
            </v-btn>
            -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al empleado con ID <span v-if="empleadoToDelete">{{ empleadoToDelete.id_empleado }}</span>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">No</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>

  <div class="button-spacing">
      <v-row justify="center">
        <v-dialog v-model="showDialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn  elevation="8" rounded :large="true" class="custom-button" v-bind="props">
              Dar de alta empleado
            </v-btn>
          </template>
          <empleado-dialog 
          v-model:showDialog="showDialog" 
          @close="showDialog = false"
          @addEmpleado="addEmpleado" 
          @updateEmpleado="updateEmpleado"
          :empleadoToEdit="empleadoToEdit"
          />
        </v-dialog>
      </v-row>
    </div>

</template>

<script>
import { onMounted, ref } from 'vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import EmpleadoDialog from '@/components/EmpleadoDialog.vue';
import useEmpleados from '@/composables/useEmpleados';
import helperServices from '@/services/helperServices.js';

export default {
  name: 'Empleado_view',
  components: {
    DeleteIcon,
    EmpleadoDialog,
  },
  setup() {
    const showDialog =  ref(false);
    const deleteDialog = ref(false);
    const empleadoToDelete = ref(null);
    const {empleados, addEmpleado, updateEmpleado, deleteEmpleado, fetchEmpleados } = useEmpleados();

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
      updateEmpleado,
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
.employee-container {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.button-spacing {
  padding-top: 30px;
  text-align: center;
}

.custom-button{
  color: teal;
}

</style>
