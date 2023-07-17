<template>
  <v-table fixed-header height="500px">
    <thead>
      <tr>
        <th class="text-left">Nombre del Paquete</th>
        <th class="text-left">Descripción</th>
        <th class="text-left">Precio</th>
        <th class="text-left">Fecha Inicio</th>
        <th class="text-left">Fecha Fin</th>
        <th class="text-left">Estado</th>
        <th class="text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="paquete in paquetes" :key="paquete.id_paquete">
        <td>{{ paquete.nombre_paquete }}</td>
        <td>{{ paquete.descripcion }}</td>
        <td>{{ paquete.precio }}</td>
        <td>{{ new Date(paquete.fecha_inicio).toLocaleDateString() }}</td>
        <td>{{ new Date(paquete.fecha_fin).toLocaleDateString() }}</td>
        <td>{{ paquete.estado_paquete }}</td>
        <td>
          <v-btn color="error" @click="openDeleteDialog(paquete)">
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
      ¿Estás seguro de que deseas eliminar el paquete con ID <span v-if="paqueteToDelete">{{ paqueteToDelete.id_paquete }}</span>?
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
          Crear un nuevo paquete
        </v-btn>
      </template>
      <paquete-dialog
        :showDialog="showDialog"
        @close="showDialog = false"
        @addPaquete="addPaquete"
      />
    </v-dialog>
  </v-row>

</template>

<script>
import { onMounted, ref } from 'vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import usePaquetes from '@/composables/usePaquetes';
import PaqueteDialog from '@/components/PaqueteDialog.vue'

export default {
  name: 'Paquete_view',
  components: {
    DeleteIcon,
    PaqueteDialog,
  },
  setup() {
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const paqueteToDelete = ref(null);
    const {paquetes, addPaquete, deletePaquete, fetchPaquetes } = usePaquetes();

   onMounted(fetchPaquetes);

    const openDeleteDialog = (paquete) => {
      paqueteToDelete.value = paquete;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      deletePaquete(paqueteToDelete.value);
      paqueteToDelete.value = null; // o paqueteToDelete.value = {};
      deleteDialog.value = false;
    };

    return {
      showDialog,
      paquetes,
      addPaquete,
      deleteDialog,
      openDeleteDialog,
      confirmDelete,
      paqueteToDelete,
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
