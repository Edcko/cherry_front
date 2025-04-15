<template>
    <v-container>
      <h2 class="text-center mb-4">Gestión de Bloqueos de Cabinas</h2>
      
      <!-- Formulario para agregar un bloqueo -->
      <v-form @submit.prevent="crearBloqueo">
        <v-text-field
          label="ID Cabina"
          v-model="form.id_cabina"
          type="number"
          required
        />
        <v-text-field
          label="Fecha de Bloqueo"
          v-model="form.fecha_bloqueo"
          type="datetime-local"
          required
        />
        <v-text-field
          label="Motivo"
          v-model="form.motivo"
        />
        <v-btn type="submit" color="primary">Crear Bloqueo</v-btn>
      </v-form>
  
      <v-divider class="my-4"></v-divider>
  
      <!-- Listado de bloqueos -->
      <v-list two-line>
        <v-list-item
          v-for="bloqueo in bloqueos"
          :key="bloqueo.id_bloqueo"
        >
          <v-list-item-content>
            <v-list-item-title>
              Cabina: {{ bloqueo.id_cabina }} – Fecha: {{ formatearFecha(bloqueo.fecha_bloqueo) }}
            </v-list-item-title>
            <v-list-item-subtitle>Motivo: {{ bloqueo.motivo }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <!-- Botón para editar (puedes implementar un diálogo de edición similar al de citas) -->
            <v-btn icon @click="editarBloqueo(bloqueo)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="eliminarBloqueo(bloqueo.id_bloqueo)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import useBloqueoCabina from "@/composables/useBloqueoCabina";
  
  export default {
    name: "BloqueosCabinas",
    setup() {
      const { bloqueos, fetchBloqueos, createBloqueo, updateBloqueo, removeBloqueo } = useBloqueoCabina();
      
      // Objeto reactivo para el formulario
      const form = ref({
        id_cabina: "",
        fecha_bloqueo: "",
        motivo: ""
      });
      
      // Función para formatear la fecha (adaptable a tus necesidades)
      const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString();
      };
  
      // Cargar bloqueos al montar el componente
      onMounted(() => {
        fetchBloqueos();
      });
      
      // Función para crear el bloqueo
      const crearBloqueo = async () => {
        // Puedes agregar validaciones adicionales aquí
        await createBloqueo(form.value);
        // Limpiar el formulario
        form.value = { id_cabina: "", fecha_bloqueo: "", motivo: "" };
      };
  
      // Función para editar (en este ejemplo simplemente asigna el bloqueo al formulario)
      const editarBloqueo = (bloqueo) => {
        form.value = { ...bloqueo };
        // Aquí podrías abrir un diálogo para editar, similar a tus diálogos de cita.
      };
  
      // Función para eliminar un bloqueo
      const eliminarBloqueo = async (id_bloqueo) => {
        await removeBloqueo(id_bloqueo);
      };
  
      return {
        bloqueos,
        form,
        crearBloqueo,
        editarBloqueo,
        eliminarBloqueo,
        formatearFecha
      };
    },
  };
  </script>
  