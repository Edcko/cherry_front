<template>
  <v-row>
    <v-col cols="12">
      <v-expansion-panels>
        <v-expansion-panel>
            <v-toolbar-title class="toolbar-title">Filtros</v-toolbar-title>
            <v-row>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localSearch"
                  label="Buscar por número de cita"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localDateFilter"
                  type="datetime-local"
                  label="Filtrar por fecha"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mb-3">
                <v-text-field
                  v-model="localClientIdFilter"
                  label="Filtrar por ID de cliente"
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
                  >Aplicar filtros</v-btn
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
                  >Restablecer filtros</v-btn
                >
              </v-col>
            </v-row>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      localSearch: "",
      localDateFilter: null,
      localClientIdFilter: "",
    };
  },
  methods: {
    applyFilters() {
      this.$emit("searchChange", this.localSearch);
      this.$emit("dateFilterChange", this.localDateFilter);
      this.$emit("clientIdFilterChange", this.localClientIdFilter);
    },
    resetFilters() {
      this.localSearch = "";
      this.localDateFilter = null;
      this.localClientIdFilter = "";
      this.applyFilters();
    },
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
