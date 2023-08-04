<template>
  <!--
 <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Buscar"
    single-line
    hide-details
  ></v-text-field>
-->

  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3" v-for="paquete in filteredPaquetes" :key="paquete.id_paquete">
      <v-card class="mx-auto" max-width="344">
        <v-img height="200px" :src="paquete.imagen_paquete" :alt="paquete.nombre_paquete" cover></v-img>

        <v-card-title>{{ paquete.nombre_paquete }}</v-card-title>

        <v-card-subtitle>${{ paquete.precio }}</v-card-subtitle>

        <v-card-actions>
          <!--
          <v-btn
            color="orange-lighten-2"
            variant="text"
            @click="showDescription = !showDescription"
          >
            Descripción
          </v-btn>
          -->

          <v-card-actions>
            <v-btn :icon="showDescription[paquete.id_paquete]
                ? 'mdi-chevron-up'
                : 'mdi-chevron-down'
              " @click="toggleDescription(paquete.id_paquete)"></v-btn>
          </v-card-actions>

          <v-spacer></v-spacer>

          <v-btn icon color="error" @click="openDeleteDialog(paquete)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="showDescription[paquete.id_paquete]">
            <v-divider></v-divider>

            <v-card-text>
              <div v-if="showFullDescription[paquete.id_paquete]">
                {{ paquete.descripcion }}
              </div>
              <div v-else>
                {{ truncateDescription(paquete.descripcion) }}
              </div>
              <v-btn variant="plain" size="x-small" @click="toggleFullDescription(paquete.id_paquete)">
                {{
                  showFullDescription[paquete.id_paquete]
                  ? "Mostrar menos"
                  : "Mostrar más"
                }}
              </v-btn>
            </v-card-text>

            <v-card-text>Fecha de inicio: {{ paquete.fecha_inicio }}</v-card-text>

            <v-card-text>Fecha de fin: {{ paquete.fecha_fin }}</v-card-text>

            <v-card-text>Estado del paquete: {{ paquete.estado_paquete }}</v-card-text>
            <!-- El resto de tu contenido de la tarjeta aquí -->
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
  <!-- Dialogo de confirmacion para eliminar -->

  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirmación de eliminación</v-card-title>
      <v-card-text>
        ¿Estás seguro de que deseas eliminar el paquete
        <span v-if="paqueteToDelete">{{ paqueteToDelete.nombre_paquete }}</span>?
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
        <v-btn icon="mdi-plus" color="white" elevation="12" size="x-large" :large="true" class="mx-auto" v-bind="props">
        </v-btn>
      </template>
      <paquete-dialog :showDialog="showDialog" @close="showDialog = false" @addPaquete="addPaquete" />
    </v-dialog>
  </v-row>
</template>

<script>
import { onMounted, ref, computed } from "vue";
//import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import usePaquetes from "@/composables/usePaquetes";
import helperServices from "@/services/helperServices.js";
import PaqueteDialog from "@/components/PaqueteDialog.vue";

export default {
  name: "Paquete_view",
  components: {
    // DeleteIcon,
    PaqueteDialog,
  },
  setup() {
    const showDialog = ref(false);
    const showDescription = ref({});
    const showFullDescription = ref({});
    const deleteDialog = ref(false);
    const paqueteToDelete = ref(null);
    const { paquetes, addPaquete, deletePaquete, fetchPaquetes } =
      usePaquetes();
    const search = ref("");


    const toggleDescription = (id_paquete) => {
      if (!showDescription.value[id_paquete]) {
        showDescription.value[id_paquete] = false;
      }
      showDescription.value[id_paquete] = !showDescription.value[id_paquete];
    };

    const toggleFullDescription = (id_paquete) => {
      if (!showFullDescription.value[id_paquete]) {
        showFullDescription.value[id_paquete] = false;
      }
      showFullDescription.value[id_paquete] =
        !showFullDescription.value[id_paquete];
    };

    const truncateDescription = (descripcion) => {
      if (descripcion.length > 25) {
        return descripcion.substring(0, 25) + "...";
      } else {
        return descripcion;
      }
    };

    const filteredPaquetes = computed(() => {
      if (!search.value) {
        return paquetes.value;
      }
      return paquetes.value.filter(
        (paquete) =>
          paquete.nombre_paquete
            .toLowerCase()
            .includes(search.value.toLowerCase()) ||
          paquete.descripcion.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    onMounted(fetchPaquetes,
      console.log(paquetes.value), );

    const openDeleteDialog = (paquete) => {
      paqueteToDelete.value = paquete;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      deletePaquete(paqueteToDelete.value);
      paqueteToDelete.value = null; // o paqueteToDelete.value = {};
      deleteDialog.value = false;
    };

    return {
      showDialog,
      showDescription,
      showFullDescription,
      truncateDescription,
      toggleDescription,
      toggleFullDescription,
      filteredPaquetes,
      addPaquete,
      deleteDialog,
      openDeleteDialog,
      confirmDelete,
      paqueteToDelete,
      helperServices,
      search,
    };
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f5f5f5;
}

.button-spacing {
  padding-top: 30px;
}
</style>
