<template>
    <v-table
      fixed-header
      height="500px"
    >
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
          <th class="text-left">Dirección</th>
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
          <td>{{ cliente.direccion }}</td>
          <td>
            <v-btn color="primary" @click="editCliente(cliente)">Editar</v-btn>
            <v-btn color="error" @click="deleteCliente(cliente.id_cliente)">Borrar</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  
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
            Crear Cliente
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
  
  export default {
    name: "ClientesComponent",
    components: {
      ClienteDialog
    },
    setup() {
      const showDialog = ref(false);
      const { clientes, addCliente } = useClientes();
  
      onMounted(async () => {
        try {
          clientes.value = await apiService.getClientes();
        } catch (error) {
          console.error(error);
          // Agrega aquí el manejo de errores, como mostrar una alerta
        }
      });
  
      return {
        clientes,
        addCliente,
        showDialog
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
  </style>
  