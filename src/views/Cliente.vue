<template>
  <v-table fixed-header height="500px">
    <thead>
      <tr>
        <th class="text-left">ID Cliente</th>
        <th class="text-left">Nombre</th>
        <th class="text-left">Apellido Paterno</th>
        <th class="text-left">Apellido Materno</th>
        <th class="text-left">Email</th>
        <th class="text-left">Teléfono</th>
        <th class="text-left">Fecha de Nacimiento</th>
        <th class="text-left">Sexo</th>
        <th class="text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cliente in clientes" :key="cliente.id_cliente">
        <td>{{ cliente.id_cliente }}</td>
        <td>{{ cliente.nombre_cliente }}</td>
        <td>{{ cliente.apellido_paterno }}</td>
        <td>{{ cliente.apellido_materno }}</td>
        <td>{{ cliente.email }}</td>
        <td>{{ cliente.telefono_cliente }}</td>
        <td>{{ new Date(cliente.fecha_nacimiento).toLocaleDateString() }}</td>
        <td>{{ cliente.sexo }}</td>
        <td>
          <v-btn color="white" @click="editCliente(cliente)">
            <edit-icon></edit-icon>
          </v-btn>

          <v-btn color="error" @click="openDeleteDialog(cliente)">
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
        ¿Estás seguro de que deseas eliminar el cliente con ID
        {{ clientToDelete.id_cliente }}?
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
          Dar de alta cliente
        </v-btn>
      </template>
      <cliente-dialog
        :showDialog="showDialog"
        @close="showDialog = false"
        @addCliente="addCliente"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { onMounted, ref } from "vue";
import apiService from "@/services/apiServices";
import ClienteDialog from "@/components/ClienteDialog.vue";
import useClientes from "@/composables/useClientes";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import EditIcon from "@/components/icons/EditIcon.vue";

export default {
  name: "ClientesComponent",
  components: {
    ClienteDialog,
    DeleteIcon,
    EditIcon,
  },
  setup() {
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const clientToDelete = ref(null);
    const { clientes, addCliente, deleteCliente } = useClientes();

    onMounted(async () => {
      try {
        clientes.value = await apiService.getClientes();
      } catch (error) {
        console.error(error);
        // Agrega aquí el manejo de errores, como mostrar una alerta
      }
    });

    const openDeleteDialog = (cliente) => {
      clientToDelete.value = cliente;
      console.log(clientToDelete.value);
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      deleteCliente(clientToDelete.value);
      deleteDialog.value = false;
    };

    return {
      openDeleteDialog,
      confirmDelete,
      clientes,
      addCliente,
      showDialog,
      deleteDialog, // retorna deleteDialog
      clientToDelete, // retorna clientToDelete
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
