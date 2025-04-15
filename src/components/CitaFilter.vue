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
      rounded="lg"
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
        label: 'Buscar por cliente...', 
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
.d-flex.flex-column.align-center {
  margin-top: 24px;
}

.search-input {
  width: 400px;
  max-width: 90%;
  border-radius: 20px !important; /* Redondeo de esquinas */
  overflow: hidden; /* Asegura que las esquinas se apliquen correctamente */
}
</style>
