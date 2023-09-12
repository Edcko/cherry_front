<template>
    <v-card class="mb-2">
      <v-card-title>
        Valoración - {{ valoracion.id_valoracion }}
      </v-card-title>
      <v-card-text>
        <div>
          Cliente ID: {{ valoracion.id_cliente }}
        </div>
        <div>
          Fecha: {{ valoracion.fecha_valoracion }}
        </div>
        <div>
          Observaciones: {{ valoracion.observaciones }}
        </div>
        <div>
          Recomendaciones: {{ valoracion.recomendaciones }}
        </div>
        <div>
          Resultado: {{ valoracion.resultado ? 'Positivo' : 'Negativo' }}
        </div>
        <div>
          Paquete Recomendado: {{ valoracion.paquete_recomendado }}
        </div>
      </v-card-text>
      <v-card-actions>
        <!-- Aquí puedes agregar acciones como editar o eliminar la valoración -->
        <v-btn @click="$emit('updateValoracion', valoracion)">Editar</v-btn>
        <v-btn @click="$emit('deleteValoracion', valoracion)">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      valoracion: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos específicos para el componente */
  </style>
  