<template>
  <div class="client-container">
    <!-- Progress circular cuando los datos están cargando -->
    <v-row v-if="isLoading" justify="center" align="center" class="full-height">
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="6">
      <v-card class="mx-auto my-4" max-width="1000" elevation="10">
        <v-card-title class="custom-button">
  Lista de Clientes
  <v-spacer></v-spacer> <!-- Espaciador para alinear el campo de búsqueda a la derecha -->
  <v-text-field
    v-model="searchQuery"
    append-icon="mdi-magnify"
    label="Buscar clientes"
    single-line
    hide-details
  ></v-text-field>
 
</v-card-title>
        <v-divider></v-divider>

        <v-virtual-scroll
          :items="filteredClientes"
          height="400"
          item-height="48"
        >
          <template v-slot:default="{ item }">
            <v-list-item
              :title="`${item.nombre_cliente} ${item.apellido_paterno} ${item.apellido_materno}`"
              :subtitle="`Email: ${item.email} | Teléfono: ${item.telefono_cliente}`"
            >
              <template v-slot:prepend>
                <v-icon class="custom-button">mdi-account</v-icon>
              </template>
              <template v-slot:append>
                <v-btn class="custom-button" icon @click="openDeleteDialog(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
        
        <v-row justify="center" class="my-2">
        <v-dialog v-model="showDialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn elevation="8" rounded :large="true" class="custom-button" v-bind="props" icon="mdi-account-plus">

            </v-btn>
          </template>
          <cliente-dialog :showDialog="showDialog" @close="showDialog = false" @addCliente="addCliente" />
        </v-dialog>
      </v-row>


      </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <compras-list :compras="compras" :isLoading="isLoading"  @addCompra="addCompra" @deleteCompra="handleDeleteCompra"/>
      </v-col>
    </v-row>

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
</template>

<script>
import { onMounted, ref, watch } from "vue";
import apiService from "@/services/apiServices";
import ClienteDialog from "@/components/ClienteDialog.vue";
import useClientes from "@/composables/useClientes";
import useCompras from "@/composables/useCompras";
import helperServices from "@/services/helperServices.js";
import ComprasList from "@/components/ComprasList.vue";
import store from "@/store";

export default {
  name: "ClientesComponent",
  components: {
    ClienteDialog,
    ComprasList
  },
  setup() {
//    const page = ref(1); // Estado para la página actual
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const clientToDelete = ref(null);
    const idSpa = store.getters.idSpa;
//    const compras = ref(null);
    const isLoading = ref(true); // Para controlar la visualización del progress circular
    const { compras, addCompra, updateCompra, deleteCompra } = useCompras();
    const { clientes, addCliente, deleteCliente } = useClientes();
    const searchQuery = ref(""); // Estado para la consulta de la busqueda
    
    //Filtrado de ccleintes basado en el texto de busqueda
    const filteredClientes = ref([]);

    onMounted(async () => {
      try {
        const fechedClientes = await apiService.getClientes({idSpa: idSpa});
        clientes.value = fechedClientes;
        filteredClientes.value = fechedClientes;
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

    const handleDeleteCompra = async (compra) => {
      
      try {
        await deleteCompra(compra);
        const index = compras.value.findIndex((c) => c.id_compra === compra.id_compra);
        if(index !== -1) {
          compras.value.splice(index, 1);
        }
      }catch (error) {
        this.$showAlert("Ha ocurrido un error al eliminar la cita.", "error");
        console.error(error);
      }

};



     // Observa cambios en el camop de busqueda y filtra los clientes
     watch(searchQuery, (newValue) => {
    if (newValue === '') {
      filteredClientes.value = clientes.value; // Si no hay búsqueda, muestra todos los clientes
    } else {
      filteredClientes.value = clientes.value.filter((cliente) =>
        cliente.nombre_cliente.toLowerCase().includes(newValue.toLowerCase()) ||
        cliente.apellido_paterno.toLowerCase().includes(newValue.toLowerCase()) ||
        cliente.apellido_materno.toLowerCase().includes(newValue.toLowerCase()) ||
        cliente.email.toLowerCase().includes(newValue.toLowerCase()) ||
        cliente.telefono_cliente.toLowerCase().includes(newValue.toLowerCase()) 
      );
    }
  });

//    const displayedClientes = computed(() => {
///      const startIndex = (page.value - 1) * 6; 
//      return clientes.value.slice(startIndex, startIndex + 6);
//    });

//    const totalPages = computed(() => Math.ceil(clientes.value.length / 6));

    return {
      openDeleteDialog,
      confirmDelete,
      clientes,
      addCliente,
      showDialog,
      deleteDialog,
      clientToDelete,
      helperServices,
      filteredClientes,
  //    page,
  //    displayedClientes,
  //    totalPages,
      isLoading,
      compras,
      addCompra,
      updateCompra,
      deleteCompra,
      searchQuery,
      handleDeleteCompra,
    };
  },
};
</script>

<style scoped>
.client-container {
  padding: 16px;
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
  color: teal;
}

.my-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.full-height {
  height: 80vh;
}
</style>
