<template>
  <div class="cabina-container">
    <!-- Progress circular cuando los datos están cargando -->
    <v-row v-if="isLoading" justify="center" align="center" class="full-height">
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="mx-auto my-4" max-width="1000" elevation="10">
          <v-card-title class="custom-button">
            Lista de Cabinas
            <v-spacer></v-spacer>
            <!-- Campo de búsqueda -->
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Buscar cabinas"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-divider></v-divider>

          <!-- Lista de cabinas con scroll virtual -->
          <v-virtual-scroll :items="filteredCabinas" height="400" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item
                :title="`Cabina #${item.numero_cabina}`"
                :subtitle="`Turno: ${item.turno} | Estado: ${item.estado_cabina} | Terapeuta: ${item.Empleado.nombre_empleado}`"
              >
                <template v-slot:prepend>
                  <v-icon class="custom-button">mdi-office-chair</v-icon>
                </template>
                <template v-slot:append>
                  <v-btn class="custom-button mx-1" icon @click="openEditDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn class="custom-button mx-1" icon @click="openDeleteDialog(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>

          <!-- Botón para agregar cabina -->
          <v-row justify="center" class="my-2">
            <v-dialog v-model="showDialog" persistent width="1024">
              <template v-slot:activator="{ props }">
                <v-btn
                  elevation="8"
                  rounded
                  :large="true"
                  class="custom-button"
                  v-bind="props"
                  @click="openAddDialog"
                >
                <v-icon>mdi-alpha-c-circle</v-icon>
                </v-btn>
              </template>
              <cabina-dialog
                v-model:showDialog="showDialog"
                @close="showDialog = false"
                @addCabina="addCabina"
                @updateCabina="updateCabina"
                :cabinaEdit="cabinaToEdit"
              />
            </v-dialog>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la cabina con ID {{ cabinaToDelete?.id_cabina }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">No</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import CabinaDialog from "@/components/CabinaDialog.vue";
import useCabinas from "@/composables/useCabinas";
import useUser from "@/composables/useUser";
import helperServices from "@/services/helperServices.js";

export default {
  name: "Cabina_view",
  components: {
    CabinaDialog,
  },
  setup() {
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const cabinaToDelete = ref(null);
    const cabinaToEdit = ref(null);
    const searchQuery = ref("");
    const isLoading = ref(true);
    const { cabinas, addCabina, updateCabina, deleteCabina, fetchCabinas } = useCabinas();
    const { user, loadUser } = useUser();
    const filteredCabinas = ref([]);

    onMounted(async () => {
      try {
        await fetchCabinas();
        await loadUser();
        filteredCabinas.value = cabinas.value; // Copia inicial de las cabinas
        isLoading.value = false;
      } catch (error) {
        console.error(error);
        isLoading.value = false;
      }
    });

    // Actualizar lista filtrada según la búsqueda
    watch(searchQuery, (newValue) => {
      if (newValue === "") {
        filteredCabinas.value = cabinas.value;
      } else {
        filteredCabinas.value = cabinas.value.filter((cabina) =>
          cabina.numero_cabina.toString().includes(newValue)
        );
      }
    });

    const openEditDialog = (cabina) => {
      cabinaToEdit.value = { ...cabina }; // Cargar datos para edición
      showDialog.value = true;
    };

    const openAddDialog = () => {
      cabinaToEdit.value = null; // Limpia la cabina a editar para modo creación
      showDialog.value = true;
    };

    const openDeleteDialog = (cabina) => {
      cabinaToDelete.value = cabina;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      try {
        await deleteCabina(cabinaToDelete.value);
        helperServices.showAlert("La cabina se eliminó correctamente.", "success");
        cabinaToDelete.value = null;
        deleteDialog.value = false;
      } catch (error) {
        console.error("Error al eliminar la cabina:", error);
        helperServices.showAlert("Hubo un error al eliminar la cabina.", "error");
      }
    };

    return {
      showDialog,
      cabinas,
      addCabina,
      updateCabina,
      deleteDialog,
      openEditDialog,
      openAddDialog,
      openDeleteDialog,
      confirmDelete,
      cabinaToDelete,
      cabinaToEdit,
      filteredCabinas,
      isLoading,
      user,
      loadUser,
    };
  },
};
</script>

<style scoped>
.cabina-container {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.button-spacing {
  padding-top: 30px;
  text-align: center;
}

.custom-button {
  color: teal;
}
</style>
