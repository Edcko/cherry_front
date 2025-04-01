<template>
  <!-- Contenedor principal a pantalla completa -->
  <v-container fluid class="full-screen d-flex flex-column">
    <!-- Muestra el spinner mientras carga -->
    <v-row
      v-if="isLoading"
      align="center"
      justify="center"
      class="flex-grow-1"
    >
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>

    <!-- Contenido cuando ya cargó -->
    <v-row
      v-else
      class="flex-grow-1"
    >
      <v-col cols="12" class="d-flex flex-column">
        <!-- Card que llena todo el espacio vertical disponible -->
        <v-card class="d-flex flex-column fill-height" elevation="10">
          <!-- Encabezado: Título y Botón Agregar en la misma línea -->
          <v-card-title class="custom-button">
            <div style="display: flex; align-items: center; width: 100%;">
              <span>Lista de Empleados</span>
              <v-spacer></v-spacer>
              <!-- Botón para agregar empleado en la esquina contraria al título -->
              <v-dialog v-model="showDialog" persistent width="1024">
                <template v-slot:activator="{ props }">
                  <v-btn
                    elevation="0"
                    rounded
                    size="x-large"
                    class="custom-button"
                    v-bind="props"
                    @click="openAddDialog"
                  >
                    <v-icon>mdi-account-plus</v-icon>
                  </v-btn>
                </template>
                <empleado-dialog
                  v-model:showDialog="showDialog"
                  @close="showDialog = false"
                  @addEmpleado="addEmpleado"
                  @updateEmpleado="updateEmpleado"
                  :empleadoEdit="empleadoToEdit"
                />
              </v-dialog>
            </div>
          </v-card-title>

          <!-- Campo de búsqueda debajo del título -->
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Buscar empleados..."
              single-line
              hide-details
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Contenedor flexible para la lista -->
          <div class="employee-list flex-grow-1 d-flex flex-column">
            <!-- Lista de empleados con scroll virtual -->
            <v-virtual-scroll
              class="flex-grow-1"
              style="overflow-y: auto;"
              :items="filteredEmpleados"
              item-height="48"
            >
              <template v-slot:default="{ item }">
                <v-list-item
                  :title="`${item.nombre_empleado} ${item.apellido_paterno} ${item.apellido_materno}`"
                >
                  <template v-slot:subtitle>
                    <div>
                      Email: {{ item.email }} |
                      Teléfono: {{ item.telefono_empleado }} |
                      Puesto: {{ item.tipo_empleado }}
                    </div>
                  </template>
                  <template v-slot:prepend>
                    <v-icon class="custom-button">mdi-account</v-icon>
                  </template>
                  <template v-slot:append>
                    <div class="switch-section">
                      <!-- Switch solo visible para Administradores -->
                      <v-switch
                        v-if="user.tipo_empleado === 'Desarrollador'"
                        v-model="item.activo"
                        @change="toggleActivo(item)"
                        inset
                        color="teal"
                        label="Activo"
                      ></v-switch>
                    </div>
                    <v-btn
                      class="custom-button mx-1"
                      icon
                      @click="openEditDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      class="custom-button mx-1"
                      icon
                      @click="openDeleteDialog(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al empleado con ID
          {{ empleadoToDelete?.id_empleado }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >No</v-btn
          >
          <v-btn color="red darken-1" text @click="confirmDelete"
            >Sí</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import EmpleadoDialog from "@/components/EmpleadoDialog.vue";
import useEmpleados from "@/composables/useEmpleados";
import useUser from "@/composables/useUser";
import helperServices from "@/services/helperServices.js";

export default {
  name: "Empleado_view",
  components: {
    EmpleadoDialog,
  },
  setup() {
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const empleadoToDelete = ref(null);
    const empleadoToEdit = ref(null);
    const searchQuery = ref("");
    const isLoading = ref(true);
    const { empleados, addEmpleado, updateEmpleado, deleteEmpleado, fetchEmpleados } = useEmpleados();
    const { user, loadUser } = useUser();
    const filteredEmpleados = ref([]);

    onMounted(async () => {
      try {
        await fetchEmpleados();
        await loadUser();
        filteredEmpleados.value = empleados.value; // Copia inicial
        isLoading.value = false;
      } catch (error) {
        console.error(error);
        isLoading.value = false;
      }
    });

    // Filtrar al cambiar la búsqueda
    watch(searchQuery, (newValue) => {
      if (!newValue) {
        filteredEmpleados.value = empleados.value;
      } else {
        filteredEmpleados.value = empleados.value.filter((empleado) =>
          `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
            .toLowerCase()
            .includes(newValue.toLowerCase())
        );
      }
    });

    const openEditDialog = (empleado) => {
      empleadoToEdit.value = { ...empleado }; // Clona el empleado a editar
      showDialog.value = true;
    };

    const openAddDialog = () => {
      empleadoToEdit.value = null; // Limpia para modo creación
      showDialog.value = true;
    };

    const toggleActivo = async (empleado) => {
      try {
        await updateEmpleado({ ...empleado, activo: empleado.activo });
        helperServices.showAlert("Estado actualizado correctamente.", "success");
      } catch (error) {
        console.error("Error actualizando el estado activo:", error);
        helperServices.showAlert("Error al actualizar el estado.", "error");
      }
    };

    const openDeleteDialog = (empleado) => {
      empleadoToDelete.value = empleado;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      try {
        await deleteEmpleado(empleadoToDelete.value);
        const index = empleados.value.findIndex(
          (e) => e.id_empleado === empleadoToDelete.value.id_empleado
        );
        if (index !== -1) {
          empleados.value.splice(index, 1);
        }
        deleteDialog.value = false;
      } catch (error) {
        console.error(error);
      }
    };

    return {
      showDialog,
      empleados,
      addEmpleado,
      updateEmpleado,
      deleteDialog,
      openEditDialog,
      openAddDialog,
      openDeleteDialog,
      confirmDelete,
      empleadoToDelete,
      empleadoToEdit,
      searchQuery,
      isLoading,
      filteredEmpleados,
      helperServices,
      toggleActivo,
      user,
      loadUser,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal a pantalla completa */
.full-screen {
  height: 100vh;      /* Ocupa todo el alto de la ventana */
  width: 100%;        /* Ocupa todo el ancho */
  margin: 0;
  padding: 0;
}

/* Permite que el card ocupe todo el espacio vertical */
.fill-height {
  height: 100%;
}

/* Botón de la parte superior */
.custom-button {
  color: teal;
  margin-right: 8px;
}

.custom-button:last-child {
  margin-right: 0;
}

/* Contenedor que hará crecer el scroll vertical de la lista 
.employee-list {
  flex-grow-1 se asigna en el template
}
   */

/* Estilos del switch */
.switch-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 40px;
  margin-top: 0px;
}
</style>
