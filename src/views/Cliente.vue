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
  
    <v-btn color="green" @click="createCliente">Registrar Cliente</v-btn>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import apiService from '@/services/apiServices';
  import useClientes from '@/composables/useClientes';
  
  export default {
    name: 'Cliente_view',
    setup() {
      const clientes = ref([]);

      const {
        addCliente
      } = useClientes();
  
      onMounted(async () => {
        try {
          clientes.value = await apiService.getClientes();
        } catch (error) {
          console.error(error);
        }
      });
  
     
      const editCliente = () => {
        // Aquí puedes abrir un modal con el formulario de edición del cliente, pasando el cliente actual como prop
      };
  
      const deleteCliente = async (id_cliente) => {
        // Aquí puedes agregar una confirmación antes de borrar el cliente
        try {
          await apiService.deleteCliente(id_cliente);
          clientes.value = clientes.value.filter(cliente => cliente.id_cliente !== id_cliente);
        } catch (error) {
          console.error(error);
        }
      };
  
      return {
        clientes,
        addCliente,
        editCliente,
        deleteCliente
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
  