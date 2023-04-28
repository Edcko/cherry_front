<template>
    <div class="services-view">
      <h1>Servicios</h1>
      <ul>
        <li v-for="(service, index) in services" :key="index">
          <h2>{{ service.name }}</h2>
          <p>{{ service.description }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Services_view',

    data() {
      return {
        services: [
          {
            name: "Servicio 1",
            description: "Descripción del servicio 1",
          },
          {
            name: "Servicio 2",
            description: "Descripción del servicio 2",
          },
          // Agrega más servicios aquí
        ],
      };
    },
  };
  </script>
  
  <style scoped>
 
  </style>
  