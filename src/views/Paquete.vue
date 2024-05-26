<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3" v-for="paquete in filteredPaquetes" :key="paquete.id_paquete">
      <v-card class="mx-auto" max-width="344">
        <v-img v-if="paquete.Paquete && paquete.Paquete.imagen_paquete" height="200px" :src="paquete.Paquete.imagen_paquete" :alt="paquete.Paquete.nombre_paquete" cover></v-img>
        <v-card-title v-if="paquete.Paquete">{{ paquete.Paquete.nombre_paquete }}</v-card-title>
        <v-card-subtitle v-if="paquete.Paquete">${{ paquete.Paquete.precio }}</v-card-subtitle>
        <v-card-actions>
          <v-btn :icon="showDescription[paquete.id_paquete] ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="toggleDescription(paquete.id_paquete)"></v-btn>
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="openDeleteDialog(paquete)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="showDescription[paquete.id_paquete]">
            <v-divider></v-divider>
            <v-card-text>
              <div v-if="showFullDescription[paquete.id_paquete] && paquete.Paquete">
                {{ paquete.Paquete.descripcion }}
              </div>
              <div v-else-if="paquete.Paquete">
                {{ truncateDescription(paquete.Paquete.descripcion) }}
              </div>
              <v-btn v-if="paquete.Paquete" variant="plain" size="x-small" @click="toggleFullDescription(paquete.id_paquete)">
                {{ showFullDescription[paquete.id_paquete] ? "Mostrar menos" : "Mostrar más" }}
              </v-btn>
            </v-card-text>
            <v-card-text v-if="paquete.Paquete">Fecha de inicio: {{ paquete.Paquete.fecha_inicio }}</v-card-text>
            <v-card-text v-if="paquete.Paquete">Fecha de fin: {{ paquete.Paquete.fecha_fin }}</v-card-text>
            <v-card-text v-if="paquete.Paquete">Estado del paquete: {{ paquete.Paquete.estado_paquete }}</v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
  
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirmación de eliminación</v-card-title>
      <v-card-text>
        ¿Estás seguro de que deseas eliminar el paquete <span v-if="paqueteToDelete">{{ paqueteToDelete.nombre_paquete }}</span>?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="deleteDialog = false">No</v-btn>
        <v-btn color="red darken-1" text @click="confirmDelete">Sí</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="button-spacing"></div>

  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-plus" color="white" elevation="12" size="x-large" :large="true" class="mx-auto" v-bind="props"></v-btn>
      </template>
      <paquete-dialog :showDialog="showDialog" @close="showDialog = false" @addPaquete="handleAddPaquete" />
    </v-dialog>
  </v-row>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import usePaquetes from "@/composables/usePaquetes";
import PaqueteDialog from "@/components/PaqueteDialog.vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  name: "Paquete_view",
  components: {
    PaqueteDialog,
  },
  setup() {
    const showDialog = ref(false);
    const showDescription = ref({});
    const showFullDescription = ref({});
    const deleteDialog = ref(false);
    const paqueteToDelete = ref(null);
    const { paquetes, addPaquete, deletePaquete, fetchPaquetes } = usePaquetes();
    const search = ref("");

    const idSpa = store.getters.idSpa;

    const toggleDescription = (id_paquete) => {
      showDescription.value[id_paquete] = !showDescription.value[id_paquete];
    };

    const toggleFullDescription = (id_paquete) => {
      showFullDescription.value[id_paquete] = !showFullDescription.value[id_paquete];
    };

    const truncateDescription = (descripcion) => {
      return descripcion.length > 25 ? descripcion.substring(0, 25) + "..." : descripcion;
    };

    const filteredPaquetes = computed(() => {
      if (!search.value) return paquetes.value;
      return paquetes.value.filter(paquete =>
        paquete.nombre_paquete.toLowerCase().includes(search.value.toLowerCase()) ||
        paquete.descripcion.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    onMounted(fetchPaquetes);

    const openDeleteDialog = (paquete) => {
      paqueteToDelete.value = paquete;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      deletePaquete(paqueteToDelete.value);
      paqueteToDelete.value = null;
      deleteDialog.value = false;
    };

    const handleAddPaquete = async (newPaquete) => {
      try {
        const addedPaquete = await addPaquete(newPaquete);
        console.log("Added package", addedPaquete);
        if (!addedPaquete) {
          throw new Error("Failed to add package");
        }
        await apiService.addPerteneceA({ id_spa: idSpa, id_paquete: addedPaquete.id_paquete });
        paquetes.value.push(addedPaquete);
        await fetchPaquetes();
      } catch (error) {
        console.error("Error adding package", error);
      }
    };

    return {
      showDialog,
      showDescription,
      showFullDescription,
      truncateDescription,
      toggleDescription,
      toggleFullDescription,
      filteredPaquetes,
      handleAddPaquete,
      addPaquete,
      deleteDialog,
      openDeleteDialog,
      confirmDelete,
      paqueteToDelete,
      search,
    };
  },
};
</script>

<style scoped>
.button-spacing {
  padding-top: 30px;
}
</style>
