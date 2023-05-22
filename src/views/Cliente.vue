<template>
    <v-table
      fixed-header
      height="500px"
    >
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Nombre</th>
          <th class="text-left">Apellido Paterno</th>
          <th class="text-left">Apellido Materno</th>
          <th class="text-left">Email</th>
          <th class="text-left">Teléfono</th>
          <th class="text-left">Fecha de Nacimiento</th>
          <th class="text-left">Sexo</th>
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
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import apiService from '@/services/apiServices';
  
  export default {
    name: 'Cliente_view',
    setup() {
      const clientes = ref([]);
  
      onMounted(async () => {
        try {
          clientes.value = await apiService.getClientes();
        } catch (error) {
          console.error(error);
        }
      });
  
      return {
        clientes,
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
  