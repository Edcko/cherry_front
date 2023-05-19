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
          <th class="text-left">Tipo</th>
          <th class="text-left">Email</th>
          <th class="text-left">Teléfono</th>
          <th class="text-left">Fecha de Nacimiento</th>
          <th class="text-left">Sexo</th>
          <th class="text-left">Fecha de Contratación</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleados" :key="empleado.id_empleado">
          <td>{{ empleado.id_empleado }}</td>
          <td>{{ empleado.nombre_empleado }}</td>
          <td>{{ empleado.apellido_paterno }}</td>
          <td>{{ empleado.apellido_materno }}</td>
          <td>{{ empleado.tipo_empleado }}</td>
          <td>{{ empleado.email }}</td>
          <td>{{ empleado.telefono_empleado }}</td>
          <td>{{ new Date(empleado.fecha_nacimiento).toLocaleDateString() }}</td>
          <td>{{ empleado.sexo }}</td>
          <td>{{ new Date(empleado.fecha_contratacion).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import apiService from '@/services/apiServices';
  
  export default {
    name: 'Empleado_view',
    setup() {
      const empleados = ref([]);
  
      onMounted(async () => {
        try {
          empleados.value = await apiService.getEmpleados();
        } catch (error) {
          console.error(error);
        }
      });
  
      return {
        empleados,
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
  