<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="teal" dark>
        <v-toolbar-title class="white--text">Búsqueda</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
    <v-container>
      <v-row>
        <v-col v-for="(filter, index) in filters" :key="index" cols="12" md="6" class="mb-3 d-flex justify-center">
          <v-text-field
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
import { ref, reactive } from "vue";

export default {
  setup(_, { emit }) {
    const filters = reactive([
      { value: ref(null), label: 'Buscar por fecha y hora', type: 'datetime-local', emitOnApply: 'dateFilterChange' },
      { value: ref(''), label: 'Buscar nombre del cliente', type: 'text', emitOnApply: 'clientIdFilterChange' },
         // Nuevo filtro agregado para búsqueda por fecha
      { value: ref(null), label: 'Buscar por fecha', type: 'date', emitOnApply: 'newDateFilterChange' },
    ]);

    const applyFilters = () => {
      filters.forEach(filter => {
        emit(filter.emitOnApply, filter.value);
      });
    };

    const resetFilters = () => {
      filters.forEach(filter => {
        filter.value = filter.type === 'datetime-local' ? null : '';
      });
      applyFilters();
    };

    return {
      filters,
      applyFilters,
      resetFilters,
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

input-field {
  max-width: 300px;
  width: 100%;
}

.button-row {
  margin-top: 20px;  /* ajusta este valor como prefieras */
}

</style>
