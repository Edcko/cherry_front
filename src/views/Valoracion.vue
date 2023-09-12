<template>
    <v-table fixed-header height="500px">
      <thead>
        <tr>
          <th class="text-left">ID Valoración</th>
          <th class="text-left">ID Cliente</th>
          <th class="text-left">Fecha Valoración</th>
          <th class="text-left">Observaciones</th>
          <th class="text-left">Recomendaciones</th>
          <th class="text-left">Resultado</th>
          <th class="text-left">Paquete Recomendado</th>
          <th class="text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="valoracion in valoraciones" :key="valoracion.id_valoracion">
          <td>{{ valoracion.id_valoracion }}</td>
          <td>{{ valoracion.id_cliente }}</td>
          <td>{{ new Date(valoracion.fecha_valoracion).toLocaleDateString() }}</td>
          <td>{{ valoracion.observaciones }}</td>
          <td>{{ valoracion.recomendaciones }}</td>
          <td>{{ valoracion.resultado ? 'Verdadero' : 'Falso' }}</td>
          <td>{{ valoracion.paquete_recomendado }}</td>
          <td>
            <v-btn color="error" @click="openDeleteDialog(valoracion)">
              <delete-icon></delete-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  
    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la valoración con ID <span v-if="valoracionToDelete">{{ valoracionToDelete.id_valoracion }}</span>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">No</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Botón para agregar una nueva valoración -->
    <v-row justify="center">
      <v-dialog v-model="showDialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn elevation="8" rounded :large="true" class="custom-button" v-bind="props">
            Crear una nueva valoración
          </v-btn>
        </template>
        <valoracion-dialog :showDialog="showDialog" @close="showDialog = false" @addValoracion="addValoracion" />
      </v-dialog>
    </v-row>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import DeleteIcon from '@/components/icons/DeleteIcon.vue';
  import ValoracionDialog from '@/components/ValoracionDialog.vue';
  import useValoraciones from '@/composables/useValoraciones';
  
  export default {
    name: 'Valoracion_view',
    components: {
      DeleteIcon,
      ValoracionDialog,
    },
    setup() {
      const showDialog = ref(false);
      const deleteDialog = ref(false);
      const valoracionToDelete = ref(null);
      const { valoraciones, addValoracion, deleteValoracion, fetchValoraciones } = useValoraciones();
  
      onMounted(fetchValoraciones);
  
      const openDeleteDialog = (valoracion) => {
        valoracionToDelete.value = valoracion;
        deleteDialog.value = true;
      };
  
      const confirmDelete = () => {
        deleteValoracion(valoracionToDelete.value);
        valoracionToDelete.value = null;
        deleteDialog.value = false;
      };
  
      return {
        showDialog,
        valoraciones,
        fetchValoraciones,
        addValoracion,
        deleteDialog,
        openDeleteDialog,
        confirmDelete,
        valoracionToDelete,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos similares al componente Cabina.vue */
  </style>
  