<template>
    <v-table fixed-header height="500px">
      <thead>
        <tr>
          <th class="text-left">Número de Cabina</th>
          <th class="text-left">Turno</th>
          <th class="text-left">Estado de la Cabina</th>
          <th class="text-left">Terapeuta asignado</th>
          <th class="text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cabina in cabinas" :key="cabina.id_cabina">
          <td>{{ cabina.numero_cabina }}</td>
          <td>{{ cabina.turno }}</td>
          <td>{{ cabina.estado_cabina }}</td>
          <td>{{ cabina.Empleado.nombre_empleado }}</td>
          <td>
            <v-btn color="error" @click="openDeleteDialog(cabina)">
              <delete-icon></delete-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la cabina con ID <span v-if="cabinaToDelete">{{ cabinaToDelete.id_cabina }}</span>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">No</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="button-spacing"></div>
  
    <v-row justify="center">
      <v-dialog v-model="showDialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn color="white" elevation="8" rounded :large="true" class="mx-auto" v-bind="props">
            <v-icon icon="mdi-checkbox-marked-circle"></v-icon>
            Crear una nueva cabina
        </v-btn>
        </template>
        <cabina-dialog :showDialog="showDialog" @close="showDialog = false" @addCabina="addCabina" />
      </v-dialog>
    </v-row>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import DeleteIcon from '@/components/icons/DeleteIcon.vue';
  import CabinaDialog from '@/components/CabinaDialog.vue';
  import useCabinas from '@/composables/useCabinas';
  
  export default {
    name: 'Cabina_view',
    components: {
      DeleteIcon,
      CabinaDialog,
    },
    setup() {
      const showDialog =  ref(false);
      const deleteDialog = ref(false);
      const cabinaToDelete = ref(null);
      const {cabinas, addCabina, deleteCabina, fetchCabinas } = useCabinas();
  
      onMounted(fetchCabinas);
  
      const openDeleteDialog = (cabina) => {
        cabinaToDelete.value = cabina;
        deleteDialog.value = true;
      };
  
      const confirmDelete = () => {
        deleteCabina(cabinaToDelete.value);
        cabinaToDelete.value = null;
        deleteDialog.value = false;
      };
  
      return {
        showDialog,
        cabinas,
        fetchCabinas,
        addCabina,
        deleteDialog,
        openDeleteDialog,
        confirmDelete,
        cabinaToDelete,
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