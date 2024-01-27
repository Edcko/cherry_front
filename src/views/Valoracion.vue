<template>
      <div>
      <valoracion-calendar
        :valoraciones="valoraciones"
        @citaClicked="handleCitaClicked"
        @dayClicked="handleDayClicked"
        />
      </div>
    
    <v-col cols="12">
        <v-card class="mx-auto my-4" max-width="1000" elevation="10">
          <v-card-title class="custom-button">
            Valoraciones
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Buscar valoraciones"
              single-line
              hide-details
              @input="searchValoraciones"
            ></v-text-field>
          </v-card-title>
          <v-divider></v-divider>

          <!-- Lista de Valoraciones -->
          <v-virtual-scroll
            :items="filteredValoraciones"
            height="400"
            item-height="48"
          >
            <template v-slot:default="{ item }">
              <v-list-item
                :title="`Valoración: ${formatDateToDayMonthYear(item.fecha_valoracion)} | Cliente: ${item.Cliente.nombre_cliente} ${item.Cliente.apellido_paterno} ${item.Cliente.apellido_materno}`"
                :subtitle="`Valoradora: ${item.Empleado.nombre_empleado} ${item.Empleado.apellido_paterno} ${item.Empleado.apellido_materno} | Estado de valoración: ${item.estado}`"
              >
                <template v-slot:prepend>
                  <v-icon class="custom-button">mdi-star</v-icon>
                </template>
                <template v-slot:append>
                  <v-btn class="custom-button" icon @click="openChangeStatusDialog(item)">
    <v-icon>mdi-transfer</v-icon> <!-- Cambia esto por el icono que prefieras -->
  </v-btn>
                  <v-btn class="custom-button" icon @click="openDeleteDialog(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>

    <!-- Botón para agregar una nueva valoración -->
    <v-row justify="center">
          <v-dialog v-model="showDialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn elevation="8" rounded :large="true" class="custom-button" v-bind="props" icon>
            <v-icon>mdi-playlist-plus</v-icon>
          </v-btn>
        </template>
        <valoracion-dialog :showDialog="showDialog" @close="showDialog = false" @addValoracion="addValoracion" />
      </v-dialog>

      <!-- Botón para agregar un nuevo cliente -->
      <div class="button-spacing"></div>
      <v-dialog v-model="showPosibleClienteDialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn elevation="8" rounded :large="true" class="custom-button" v-bind="props" icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <posible-cliente-dialog :showPosibleClienteDialog="showPosibleClienteDialog" @close="showPosibleClienteDialog = false" />
      </v-dialog>

    </v-row>

    <div class="button-spacing"></div>

        </v-card>
      </v-col>

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
  
  </template>
  
  <script>
  import { onMounted, ref, watch } from 'vue';
  import { format } from 'date-fns';
  import { es } from 'date-fns/locale';
//  import DeleteIcon from '@/components/icons/DeleteIcon.vue';
  import ValoracionDialog from '@/components/ValoracionDialog.vue';
  import ValoracionCalendar from '@/components/ValoracionCalendar.vue';
  import PosibleClienteDialog from '@/components/PosibleClienteDialog.vue';
  import useValoraciones from '@/composables/useValoraciones';
  
  export default {
    name: 'Valoracion_view',
    components: {
//      DeleteIcon,
      ValoracionDialog,
      ValoracionCalendar,
      PosibleClienteDialog,
    },
    setup() {
      const showDialog = ref(false);
      const showPosibleClienteDialog = ref(false);
      const deleteDialog = ref(false);
      const valoracionToDelete = ref(null);
      const { valoraciones, filteredValoraciones, searchQuery, addValoracion, deleteValoracion, fetchValoraciones } = useValoraciones();
  
      onMounted(fetchValoraciones);

      watch(searchQuery, (newValue) => {
      if (newValue === '') {
        filteredValoraciones.value = valoraciones.value;
      } else {
        filteredValoraciones.value = valoraciones.value.filter((val) =>
          val.fecha_valoracion.toLowerCase().includes(newValue.toLowerCase()) ||
          val.Empleado.nombre_empleado.toLowerCase().includes(newValue.toLowerCase())
        );
      }
    });

      const openDeleteDialog = (valoracion) => {
        valoracionToDelete.value = valoracion;
        deleteDialog.value = true;
      };
  
      const confirmDelete = () => {
        deleteValoracion(valoracionToDelete.value);
        valoracionToDelete.value = null;
        deleteDialog.value = false;
      };

      const formatDateToDayMonthYear = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, dd/MMM/yyyy h:mm aa', { locale: es });
      };
  
      return {
        showDialog,
        showPosibleClienteDialog,
        valoraciones,
        filteredValoraciones,
        searchQuery,
        fetchValoraciones,
        addValoracion,
        deleteDialog,
        openDeleteDialog,
        confirmDelete,
        formatDateToDayMonthYear,
        valoracionToDelete,
      };
    },
  };
  </script>
  
  <style scoped>

.button-spacing {
  padding-top: 30px;
  padding-left: 30px;
}

</style>
  