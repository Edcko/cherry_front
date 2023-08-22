<template>
  <div class="client-container">
    <!-- Progress circular cuando los datos están cargando -->
    <v-row v-if="isLoading" justify="center" align="center" class="full-height">
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>

    <!-- Contenido cuando los datos ya están cargados -->
    <v-row v-else>
      <v-col 
        v-for="cliente in displayedClientes"
        :key="cliente.id_cliente"
        cols="12" sm="6" md="4"
      >
        <v-card 
          class="mx-auto mb-4" 
          max-width="344" 
          variant="outlined"
        >
          <v-card-item>
            <div>
              <div class="text-h6 mb-1">
                {{ cliente.nombre_cliente }} {{ cliente.apellido_paterno }} {{ cliente.apellido_materno }}
              </div>
              <div class="text-caption">
                {{ cliente.email }} | {{ cliente.telefono_cliente }}
              </div>
              <div class="text-caption">
                Nacimiento: {{ helperServices.clienteHelper.formatearFecha(cliente.fecha_nacimiento) }}
              </div>
              <div class="text-caption">
                Genero: {{ cliente.sexo }}
              </div>
            </div>
          </v-card-item>
          <v-card-actions>
            <v-btn variant="outlined" color="error" @click="openDeleteDialog(cliente)">
              <delete-icon></delete-icon> Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Paginación -->
    <div class="text-center pagination-spacing">
      <v-pagination
        v-model="page"
        :length="totalPages"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el cliente con ID {{ clientToDelete.id_cliente }}?
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
            <v-btn elevation="8" rounded :large="true" class="custom-button" v-bind="props">
              Dar de alta cliente
            </v-btn>
          </template>
          <cliente-dialog :showDialog="showDialog" @close="showDialog = false" @addCliente="addCliente" />
        </v-dialog>
      </v-row>
    </div>

  <div class="compras-spacing">

  <!-- Buscador de compras -->
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="searchQuery"
        append-icon="mdi-magnify"
        label="Buscar compras"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-col>

  </v-row>

  <!-- Listado de compras -->
 <v-row v-if="!isLoading" class="compras-spacing">
    <v-col 
      v-for="compra in filteredCompras" 
      :key="compra.id_cliente" 
      cols="12"
    >
      <v-card>
        <v-card-item>
          <div>
            <div class="text-h6">
              {{ compra.Cliente.nombre_cliente }} {{ compra.Cliente.apellido_paterno }} {{ compra.Cliente.apellido_materno }}
            </div>
            <div class="text-caption">
              Paquete: {{ compra.Paquete.nombre_paquete }}
            </div>
            <div class="text-caption">
              Fecha de Compra: {{ compra.fecha_compra }}
            </div>
            <div class="text-caption">
              Estado: {{ compra.estado_compra }}
            </div>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</div>


</template>

<script>
import { onMounted, ref, computed } from "vue";
import apiService from "@/services/apiServices";
import ClienteDialog from "@/components/ClienteDialog.vue";
import useClientes from "@/composables/useClientes";
import helperServices from "@/services/helperServices.js";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";

export default {
  name: "ClientesComponent",
  components: {
    ClienteDialog,
    DeleteIcon
  },
  setup() {
    const page = ref(1); // Estado para la página actual
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const clientToDelete = ref(null);
    const compras = ref(null);
    const isLoading = ref(true); // Para controlar la visualización del progress circular
    const { clientes, addCliente, deleteCliente } = useClientes();
    const searchQuery = ref(""); // Estado para la consulta de la busqueda

    const filteredCompras = computed(() => {
      return compras.value.filter((compra) => {
        return (
          compra.Cliente.nombre_cliente
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          compra.Cliente.apellido_paterno
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          compra.Cliente.apellido_materno
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          compra.Paquete.nombre_paquete
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          compra.fecha_compra
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          compra.estado_compra
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        );
      });
    }); 

    onMounted(async () => {
      try {
        clientes.value = await apiService.getClientes();
        compras.value = await apiService.getCompras();
        isLoading.value = false; // Oculta el progress circular una vez que los datos están cargados
      } catch (error) {
        console.error(error);
        isLoading.value = false;
      }
    });

    const openDeleteDialog = (cliente) => {
      clientToDelete.value = cliente;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      deleteCliente(clientToDelete.value);
      deleteDialog.value = false;
    };

    const displayedClientes = computed(() => {
      const startIndex = (page.value - 1) * 6; 
      return clientes.value.slice(startIndex, startIndex + 6);
    });

    const totalPages = computed(() => Math.ceil(clientes.value.length / 6));

    return {
      openDeleteDialog,
      confirmDelete,
      clientes,
      addCliente,
      showDialog,
      deleteDialog,
      clientToDelete,
      helperServices,
      page,
      displayedClientes,
      totalPages,
      isLoading,
      compras,
      searchQuery,
      filteredCompras
    };
  },
};
</script>

<style scoped>
.client-container {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.button-spacing {
  padding-top: 30px;
  text-align: center;
}

.compras-spacing {
  padding-top: 30px;
}

.pagination-spacing {
  padding-top: 20px;
}

.custom-button {
  background-color: white;
  color: teal;
}

.full-height {
  height: 80vh;
}
</style>
