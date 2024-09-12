<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="teal" dark>
        <v-toolbar-title class="white--text">Búsqueda</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-row justify="center"> <!-- Centrar los filtros -->
            <v-col v-for="(filter, index) in filters" :key="index" cols="12" md="6" class="mb-3 d-flex justify-center">
              <v-autocomplete
                v-if="filter.label === 'Buscar nombre del cliente'"
                outlined
                v-model="filter.value"
                :items="clienteOptions"
                :label="filter.label"
                class="cliente-filter"
              ></v-autocomplete>
              <v-text-field
                v-else
                outlined
                v-model="filter.value"
                :type="filter.type || 'text'"
                :label="filter.label"
                class="input-field"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-center button-row">
        <v-btn
          color="teal"
          elevation="4"
          rounded
          class="mx-3"
          @click="applyFilters"
        >Aplicar</v-btn>

        <v-btn
          color="teal"
          elevation="4"
          rounded
          class="mx-3"
          @click="resetFilters"
        >Restablecer</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  setup(_, { emit }) {
    const clientes = ref([]);
    const idSpa = store.getters.idSpa;

    onMounted(async () => {
      clientes.value = await apiService.getClientes({
        idSpa: idSpa,
      });
    });

    const clienteOptions = computed(() => {
      return clientes.value.map(
        cliente => `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
      );
    });

    const filters = reactive([
      { value: ref(''), label: 'Buscar nombre del cliente', type: 'autocomplete', emitOnApply: 'clientIdFilterChange' },
    ]);

    const applyFilters = () => {
      filters.forEach(filter => {
        emit(filter.emitOnApply, filter.value);
      });
    };

    const resetFilters = () => {
      filters.forEach(filter => {
        filter.value = filter.type === 'autocomplete' ? '' : filter.value;
      });

      const today = new Date();
      emit('newDateFilterChange', today);
      applyFilters();
    };

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
.v-card {
  border-radius: 15px;
}
.v-toolbar {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.input-field {
  max-width: 300px;
  width: 100%;
  margin-left: 10px;
}

.button-row {
  margin-top: 0px;  
  margin-bottom: 15px;  
}

.cliente-filter {
  max-width: 400px; /* Aumentar el tamaño del filtro */
  width: 100%;
  font-size: 16px; /* Hacer el texto más grande */
}

.v-row {
  justify-content: center; /* Asegurar que el contenido esté centrado */
}
</style>
