<template>
  <v-container fluid class="d-flex flex-column align-center py-6">
    <!-- Título centrado -->
    <h1 class="text-center mb-4">Gestión de Citas</h1>

    <!-- Campo de búsqueda centrado -->
    <v-autocomplete
      v-model="filters[0].value"
      :items="clienteOptions"
      :label="filters[0].label"
      prepend-inner-icon="mdi-magnify"
      outlined
      dense
      class="search-input"
      @keyup.enter="applyFilters"
    ></v-autocomplete>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from "vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  setup(_, { emit }) {
    const clientes = ref([]);
    const idSpa = store.getters.idSpa;

    onMounted(async () => {
      clientes.value = await apiService.getClientes({ idSpa });
    });

    // Opciones para el autocomplete
    const clienteOptions = computed(() => {
      return clientes.value.map(cliente =>
        `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
      );
    });

    // Filtros reactivos
    const filters = reactive([
      { 
        value: ref(''), 
        label: 'Buscar por cliente, fecha, terapeuta, paquete o estado...', 
        type: 'autocomplete', 
        emitOnApply: 'clientIdFilterChange' 
      },
    ]);

    // Aplica los filtros (se invoca al presionar Enter)
    const applyFilters = () => {
      filters.forEach(filter => {
        emit(filter.emitOnApply, filter.value);
      });
    };

    // Restablece los filtros y emite el filtro para las citas del día
    const resetFilters = () => {
      filters.forEach(filter => {
        filter.value = filter.type === 'autocomplete' ? '' : filter.value;
      });
      const today = new Date();
      emit('newDateFilterChange', today);
      applyFilters();
    };

    // Observa si el campo de búsqueda queda vacío para resetear automáticamente
    watch(filters[0].value, (newVal) => {
      if (!newVal) {
        resetFilters();
      }
    });

    return {
      filters,
      applyFilters,
      resetFilters,
      clienteOptions,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal centrado */
.d-flex.flex-column.align-center {
  /* Puedes ajustar el margen o padding para separarlo del resto de la página */
  margin-top: 24px;
}

/* Título */
h2 {
  font-weight: 600;
  /* Ajusta el tamaño a tu gusto */
}

/* Campo de búsqueda */
.search-input {
  width: 400px; /* Un ancho razonable para hacerlo más pequeño */
  max-width: 90%; /* Para que sea responsive en pantallas pequeñas */
}
</style>
