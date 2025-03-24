<template>
  <div class="employee-container">
    <!-- Progress circular cuando los datos están cargando -->
    <v-row v-if="isLoading" justify="center" align="center" class="full-height">
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="mx-auto my-4" max-width="1000" elevation="10">
          <v-card-title class="custom-button">
            Lista de Empleados
            <v-spacer></v-spacer>
            <!-- Campo de búsqueda -->
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Buscar empleados"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-divider></v-divider>

          <!-- Lista de empleados con scroll virtual -->
          <v-virtual-scroll :items="filteredEmpleados" height="400" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item
                :title="`${item.nombre_empleado} ${item.apellido_paterno} ${item.apellido_materno}`"
              >
                <template v-slot:subtitle>
                  <div>
                    Email: {{ item.email }} | Teléfono: {{ item.telefono_empleado }} | Puesto: {{ item.tipo_empleado }}
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

          <!-- Botón para agregar empleado -->
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
      icon="mdi-account-plus"
    >
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

          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al empleado con ID {{ empleadoToDelete?.id_empleado }}?
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
        filteredEmpleados.value = empleados.value; // Copia inicial de los empleados
        isLoading.value = false;
      } catch (error) {
        console.error(error);
        isLoading.value = false;
      }
    });

    // Actualizar lista filtrada según la búsqueda
    watch(searchQuery, (newValue) => {
      if (newValue === "") {
        filteredEmpleados.value = empleados.value;
      } else {
        filteredEmpleados.value = empleados.value.filter((empleado) =>
          `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.toLowerCase().includes(newValue.toLowerCase())
        );
      }
    });

    const openEditDialog = (empleado) => {
  empleadoToEdit.value = { ...empleado }; // Clona el empleado a editar
  console.log("Editando empleado:", empleadoToEdit.value); // Verificar los datos
  showDialog.value = true;
};

const openAddDialog = () => {
  empleadoToEdit.value = null; // Limpia el empleado a editar para modo creación
  showDialog.value = true;
};

const toggleActivo = async (empleado) => {
  console.log("Empleado:", empleado);
  console.log("Tipo de empleado:", user.tipo_empleado);
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
        const index = empleados.value.findIndex((e) => e.id_empleado === empleadoToDelete.value.id_empleado);
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
.employee-container {
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
  margin-right: 8px;
}

.custom-button:last-child {
  margin-right: 0;
}

.full-height {
  height: 80vh;
}

.activo {
  color: green;
  font-weight: bold;
}

.inactivo {
  color: red;
  font-weight: bold;
}

.switch-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 40px; /* Espacio entre el switch y los botones */
  margin-top: 0px; /* Ajusta según sea necesario */
}
</style>
