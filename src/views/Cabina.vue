<template>
  <div class="cabina-hero">
    <!-- Hero Section con Parallax -->
    <div class="hero-background">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">Gestión de Cabinas</span>
          </h1>
          <p class="hero-subtitle">
            Administra y optimiza el uso de tus cabinas de terapia
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <v-icon size="32" color="white">mdi-office-chair</v-icon>
            <div class="stat-info">
              <span class="stat-number">{{ cabinas.length }}</span>
              <span class="stat-label">Cabinas Totales</span>
            </div>
          </div>
          <div class="stat-card">
            <v-icon size="32" color="white">mdi-check-circle</v-icon>
            <div class="stat-info">
              <span class="stat-number">{{ cabinas.filter(c => c.estado_cabina === 'Disponible').length }}</span>
              <span class="stat-label">Disponibles</span>
            </div>
          </div>
          <div class="stat-card">
            <v-icon size="32" color="white">mdi-clock</v-icon>
            <div class="stat-info">
              <span class="stat-number">{{ cabinas.filter(c => c.estado_cabina === 'Ocupada').length }}</span>
              <span class="stat-label">En Uso</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="main-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-card">
          <v-progress-circular 
            indeterminate 
            size="64" 
            width="6"
            color="primary"
            class="mb-4"
          ></v-progress-circular>
          <h3 class="loading-text">Cargando cabinas...</h3>
          <p class="loading-subtitle">Preparando la información de tus cabinas</p>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div v-else class="content-wrapper">
        <!-- Header con búsqueda -->
        <div class="search-header">
          <div class="search-container">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Buscar cabinas por número..."
              variant="outlined"
              hide-details
              class="search-input"
              color="primary"
              bg-color="white"
              elevation="2"
            ></v-text-field>
          </div>
          <v-btn
            @click="openAddDialog"
            color="primary"
            size="large"
            elevation="8"
            class="add-button"
            prepend-icon="mdi-plus"
          >
            Nueva Cabina
          </v-btn>
        </div>

        <!-- Lista de Cabinas -->
        <div class="cabinas-grid">
          <div 
            v-for="cabina in filteredCabinas" 
            :key="cabina.id_cabina"
            class="cabina-card"
            :class="getCabinaStatusClass(cabina.estado_cabina)"
          >
            <div class="cabina-header">
              <div class="cabina-number">
                <v-icon size="24" :color="getStatusColor(cabina.estado_cabina)">
                  mdi-office-chair
                </v-icon>
                <span class="cabina-title">Cabina #{{ cabina.numero_cabina }}</span>
              </div>
              <div class="cabina-status" :class="getStatusClass(cabina.estado_cabina)">
                {{ cabina.estado_cabina }}
              </div>
            </div>

            <div class="cabina-details">
              <div class="detail-item">
                <v-icon size="16" color="grey">mdi-clock-outline</v-icon>
                <span class="detail-text">Turno: {{ cabina.turno }}</span>
              </div>
              <div class="detail-item">
                <v-icon size="16" color="grey">mdi-account</v-icon>
                <span class="detail-text">Terapeuta: {{ cabina.Empleado?.nombre_empleado || 'Sin asignar' }}</span>
              </div>
            </div>

            <div class="cabina-actions">
              <v-btn
                @click="openEditDialog(cabina)"
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-pencil"
                class="action-btn"
              >
                Editar
              </v-btn>
              <v-btn
                @click="openDeleteDialog(cabina)"
                color="error"
                variant="tonal"
                size="small"
                prepend-icon="mdi-delete"
                class="action-btn"
              >
                Eliminar
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredCabinas.length === 0 && !isLoading" class="empty-state">
          <v-icon size="64" color="grey-lighten-1">mdi-office-chair-off</v-icon>
          <h3 class="empty-title">No se encontraron cabinas</h3>
          <p class="empty-subtitle">
            {{ searchQuery ? 'No hay cabinas que coincidan con tu búsqueda' : 'Aún no hay cabinas registradas' }}
          </p>
          <v-btn
            v-if="!searchQuery"
            @click="openAddDialog"
            color="primary"
            size="large"
            class="mt-4"
            prepend-icon="mdi-plus"
          >
            Agregar Primera Cabina
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Diálogo de Cabina -->
    <v-dialog v-model="showDialog" persistent max-width="800px">
      <cabina-dialog
        v-model:showDialog="showDialog"
        @close="showDialog = false"
        @addCabina="addCabina"
        @updateCabina="updateCabina"
        :cabinaEdit="cabinaToEdit"
      />
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card class="delete-dialog">
        <v-card-title class="delete-title">
          <v-icon color="error" class="mr-3">mdi-alert-circle</v-icon>
          Confirmar Eliminación
        </v-card-title>
        <v-card-text class="delete-content">
          <p>¿Estás seguro de que deseas eliminar la <strong>Cabina #{{ cabinaToDelete?.numero_cabina }}</strong>?</p>
          <p class="delete-warning">Esta acción no se puede deshacer.</p>
        </v-card-text>
        <v-card-actions class="delete-actions">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text" 
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            @click="confirmDelete"
            prepend-icon="mdi-delete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import CabinaDialog from "@/components/CabinaDialog.vue";
import useCabinas from "@/composables/useCabinas";
import useUser from "@/composables/useUser";
import helperServices from "@/services/helperServices.js";

export default {
  name: "Cabina_view",
  components: {
    CabinaDialog,
  },
  setup() {
    const showDialog = ref(false);
    const deleteDialog = ref(false);
    const cabinaToDelete = ref(null);
    const cabinaToEdit = ref(null);
    const searchQuery = ref("");
    const isLoading = ref(true);
    const { cabinas, addCabina, updateCabina, deleteCabina, fetchCabinas } = useCabinas();
    const { user } = useUser();
    const filteredCabinas = ref([]);

    onMounted(async () => {
      try {
        await fetchCabinas();
        filteredCabinas.value = cabinas.value;
        isLoading.value = false;
      } catch (error) {
        console.error(error);
        isLoading.value = false;
      }
    });

    // Actualizar lista filtrada según la búsqueda
    watch(searchQuery, (newValue) => {
      if (newValue === "") {
        filteredCabinas.value = cabinas.value;
      } else {
        filteredCabinas.value = cabinas.value.filter((cabina) =>
          cabina.numero_cabina.toString().includes(newValue)
        );
      }
    });

    const openEditDialog = (cabina) => {
      cabinaToEdit.value = { ...cabina };
      showDialog.value = true;
    };

    const openAddDialog = () => {
      cabinaToEdit.value = null;
      showDialog.value = true;
    };

    const openDeleteDialog = (cabina) => {
      cabinaToDelete.value = cabina;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      try {
        await deleteCabina(cabinaToDelete.value);
        helperServices.showAlert("La cabina se eliminó correctamente.", "success");
        cabinaToDelete.value = null;
        deleteDialog.value = false;
      } catch (error) {
        console.error("Error al eliminar la cabina:", error);
        helperServices.showAlert("Hubo un error al eliminar la cabina.", "error");
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Disponible': return 'success';
        case 'Ocupada': return 'warning';
        case 'Mantenimiento': return 'error';
        default: return 'grey';
      }
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 'Disponible': return 'status-available';
        case 'Ocupada': return 'status-occupied';
        case 'Mantenimiento': return 'status-maintenance';
        default: return 'status-default';
      }
    };

    const getCabinaStatusClass = (status) => {
      switch (status) {
        case 'Disponible': return 'cabina-available';
        case 'Ocupada': return 'cabina-occupied';
        case 'Mantenimiento': return 'cabina-maintenance';
        default: return 'cabina-default';
      }
    };

    return {
      showDialog,
      cabinas,
      addCabina,
      updateCabina,
      deleteDialog,
      openEditDialog,
      openAddDialog,
      openDeleteDialog,
      confirmDelete,
      cabinaToDelete,
      cabinaToEdit,
      filteredCabinas,
      isLoading,
      user,
      searchQuery,
      getStatusColor,
      getStatusClass,
      getCabinaStatusClass,
    };
  },
};
</script>

<style scoped>
.cabina-hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-background {
  position: relative;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.main-content {
  background: #f8f9fa;
  min-height: 60vh;
  padding: 2rem 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-card {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-text {
  color: #333;
  margin-bottom: 0.5rem;
}

.loading-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  border-radius: 12px;
}

.add-button {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

.cabinas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cabina-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #e0e0e0;
}

.cabina-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.cabina-available {
  border-left-color: #4caf50;
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
}

.cabina-occupied {
  border-left-color: #ff9800;
  background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
}

.cabina-maintenance {
  border-left-color: #f44336;
  background: linear-gradient(135deg, #fff0f0 0%, #ffffff 100%);
}

.cabina-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cabina-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cabina-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.cabina-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-available {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-occupied {
  background: #fff3e0;
  color: #ef6c00;
}

.status-maintenance {
  background: #ffebee;
  color: #c62828;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

.cabina-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.detail-text {
  color: #666;
  font-size: 0.9rem;
}

.cabina-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-title {
  color: #333;
  margin: 1rem 0 0.5rem;
  font-size: 1.5rem;
}

.empty-subtitle {
  color: #666;
  margin-bottom: 1rem;
}

.delete-dialog {
  border-radius: 16px;
}

.delete-title {
  display: flex;
  align-items: center;
  color: #d32f2f;
  font-weight: 600;
}

.delete-content {
  padding: 1.5rem;
}

.delete-warning {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.delete-actions {
  padding: 1rem 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-card {
    min-width: 250px;
  }
  
  .search-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .cabinas-grid {
    grid-template-columns: 1fr;
  }
  
  .cabina-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .content-wrapper {
    padding: 0 10px;
  }
  
  .cabina-card {
    padding: 1rem;
  }
}
</style>
