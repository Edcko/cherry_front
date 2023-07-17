<template>
  <v-row>
    <v-col cols="12">
      <v-expansion-panels>
        <v-expansion-panel>
            <v-toolbar-title class="toolbar-title">Búsqueda</v-toolbar-title>
            <v-row>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localSearch"
                  label="Buscar por número de cabina"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localDateFilter"
                  type="datetime-local"
                  label="Buscar por fecha"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localClientIdFilter"
                  label="Buscar nombre de cliente"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-3 mb-3">
              <v-col cols="12" md="3" class="text-center">
                <v-btn
                  color="white"
                  elevation="8"
                  rounded
                  :large="true"
                  class="mx-auto"
                  @click="applyFilters"
                  >Aplicar</v-btn
                >
              </v-col>
              <v-col cols="12" md="3" class="text-center">
                <v-btn
                  color="white"
                  elevation="8"
                  rounded
                  :large="true"
                  class="mx-auto"
                  @click="resetFilters"
                  >Restablecer</v-btn
                >
              </v-col>
            </v-row>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from "vue";

export default {
  setup(_, { emit }) {
    const localSearch = ref("");
    const localDateFilter = ref(null);
    const localClientIdFilter = ref("");

    const applyFilters = () => {
      emit("searchChange", localSearch.value);
      emit("dateFilterChange", localDateFilter.value);
      emit("clientIdFilterChange", localClientIdFilter.value);
    };

    const resetFilters = () => {
      localSearch.value = "";
      localDateFilter.value = null;
      localClientIdFilter.value = "";
      applyFilters();
    };

    return {
      localSearch,
      localDateFilter,
      localClientIdFilter,
      applyFilters,
      resetFilters,
    };
  },
};
</script>

<style scoped>
  .toolbar-title {
    text-align: center;
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 16px;
  }
</style>
