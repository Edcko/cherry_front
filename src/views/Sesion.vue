<template>
    <v-table
      fixed-header
      height="500px"
    >
      <thead>
        <tr>
          <th class="text-left">ID Sesion</th>
          <th class="text-left">ID Empleado</th>
          <th class="text-left">Número de Sesion</th>
          <th class="text-left">Descripción</th>
          <th class="text-left">Duración</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sesion in sesiones" :key="sesion.id_sesion">
          <td>{{ sesion.id_sesion }}</td>
          <td>{{ sesion.id_empleado }}</td>
          <td>{{ sesion.numero_sesion }}</td>
          <td>{{ sesion.descripcion }}</td>
          <td>{{ sesion.duracion }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import apiService from '@/services/apiServices';
  
  export default {
    name: 'Sesion_view',
    setup() {
      const sesiones = ref([]);
  
      onMounted(async () => {
        try {
          sesiones.value = await apiService.getSesiones();
        } catch (error) {
          console.error(error);
        }
      });
  
      return {
        sesiones,
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
  