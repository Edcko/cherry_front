<template>
  <v-container fluid>
    <!-- Header con búsqueda -->
    <v-row class="mb-6">
      <v-col cols="12" md="8" lg="6" class="mx-auto">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar paquetes..."
          outlined
          rounded
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Grid de paquetes -->
    <v-row>
      <v-col
        v-for="paquete in filteredPaquetes"
        :key="paquete.Paquete.id_paquete"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card 
          class="paquete-card" 
          elevation="2" 
          rounded="xl"
          :class="{ 'expanded': expandedId === paquete.Paquete.id_paquete }"
        >
          <!-- Imagen del paquete -->
          <div class="image-container">
            <v-img
              v-if="paquete.Paquete.imagen_paquete"
              :src="paquete.Paquete.imagen_paquete"
              height="200"
              cover
              class="paquete-image"
            />
            <div v-else class="placeholder-image">
              <v-icon size="48" color="grey">mdi-package-variant</v-icon>
            </div>

            <!-- Overlay con precio -->
            <div class="price-overlay">
              <v-chip color="primary" dark>
                ${{ paquete.Paquete.precio }}
              </v-chip>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <v-card-text class="paquete-content">
            <!-- Título -->
            <h3 class="paquete-title">{{ paquete.Paquete.nombre_paquete }}</h3>

            <!-- Detalles siempre visibles -->
            <div class="details-grid">
              <div class="detail-item">
                <v-icon small color="primary">mdi-calendar-start</v-icon>
                <span class="detail-label">Inicio:</span>
                <span class="detail-value">{{ paquete.Paquete.fecha_inicio }}</span>
              </div>
              <div class="detail-item">
                <v-icon small color="primary">mdi-calendar-end</v-icon>
                <span class="detail-label">Fin:</span>
                <span class="detail-value">{{ paquete.Paquete.fecha_fin }}</span>
              </div>
              <div class="detail-item">
                <v-icon small color="primary">mdi-check-circle</v-icon>
                <span class="detail-label">Estado:</span>
                <v-chip :color="getStatusColor(paquete.Paquete.estado_paquete)" small text-color="white">
                  {{ paquete.Paquete.estado_paquete }}
                </v-chip>
              </div>
            </div>

            <!-- Descripción expandible -->
            <v-expand-transition>
              <div v-show="expandedId === paquete.Paquete.id_paquete" class="expanded-content">
                <p class="paquete-description">
                  {{ paquete.Paquete.descripcion }}
                </p>
              </div>
            </v-expand-transition>

            <!-- Botón expandir/colapsar -->
            <v-btn
              text
              small
              class="expand-btn"
              @click="toggleExpansion(paquete.Paquete.id_paquete)"
            >
              {{ expandedId === paquete.Paquete.id_paquete ? 'Ver menos' : 'Ver más' }}
              <v-icon right small>
                {{ expandedId === paquete.Paquete.id_paquete ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="paquete-actions">
            <v-spacer />
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn icon color="error" v-bind="attrs" v-on="on" @click="openDeleteDialog(paquete)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar paquete</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón flotante para agregar -->
    <v-btn fab color="primary" class="fab-add" @click="showDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Diálogo de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-icon color="error" left>mdi-alert-circle</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el paquete 
          <strong>{{ paqueteToDelete?.Paquete?.nombre_paquete }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para agregar paquete -->
    <v-dialog v-model="showDialog" persistent width="1024">
      <paquete-dialog :showDialog="showDialog" @close="showDialog = false" @addPaquete="handleAddPaquete" />
    </v-dialog>
  </v-container>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import usePaquetes from "@/composables/usePaquetes";
import PaqueteDialog from "@/components/PaqueteDialog.vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  name: "Paquete_view",
  components: { PaqueteDialog },
  setup() {
    const showDialog = ref(false);
    const expandedId = ref(null);
    const deleteDialog = ref(false);
    const paqueteToDelete = ref(null);
    const { paquetes, addPaquete, deletePaquete, fetchPaquetes } = usePaquetes();
    const search = ref("");
    const idSpa = store.getters.idSpa;

    const toggleExpansion = (id_paquete) => {
      expandedId.value =
        expandedId.value === id_paquete ? null : id_paquete;
    };

    const getStatusColor = (estado) => {
      const statusColors = {
        activo: "success",
        inactivo: "error",
        pendiente: "warning",
        finalizado: "grey",
      };
      return statusColors[estado?.toLowerCase()] || "primary";
    };

    const filteredPaquetes = computed(() => {
      if (!search.value) return paquetes.value;
      return paquetes.value.filter((paquete) =>
        paquete.Paquete.nombre_paquete
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        paquete.Paquete.descripcion
          .toLowerCase()
          .includes(search.value.toLowerCase())
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
        const added = await addPaquete(newPaquete);
        if (!added) throw new Error("Failed to add package");
        await apiService.addPerteneceA({
          id_spa: idSpa,
          id_paquete: added.id_paquete,
        });
        paquetes.value.push(added);
        await fetchPaquetes();
      } catch (error) {
        console.error("Error adding package", error);
      }
    };

    return {
      showDialog,
      expandedId,
      deleteDialog,
      paqueteToDelete,
      search,
      filteredPaquetes,
      toggleExpansion,
      getStatusColor,
      openDeleteDialog,
      confirmDelete,
      handleAddPaquete,
    };
  },
};
</script>

<style scoped>
.fab-add {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 10;
}

.paquete-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.paquete-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.paquete-card.expanded {
  box-shadow: 0 12px 30px rgba(0,0,0,0.2);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.paquete-image {
  transition: transform 0.3s ease;
}

.paquete-card:hover .paquete-image {
  transform: scale(1.05);
}

.placeholder-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.price-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.paquete-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.paquete-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.3;
}

.paquete-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.expand-btn {
  align-self: flex-start;
  margin-top: auto;
  font-weight: 500;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-weight: 500;
  color: #555;
  min-width: 60px;
}

.detail-value {
  color: #333;
  font-weight: 400;
}

.paquete-actions {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .paquete-content {
    padding: 16px;
  }
  
  .paquete-title {
    font-size: 1.1rem;
  }
}
</style>
