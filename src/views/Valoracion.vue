<template>
  <div class="valoracion-container">
    <!-- Dashboard de Estadísticas -->
    <v-row class="mb-8">
      <v-col cols="12" md="3">
        <v-card class="text-center" color="primary" dark elevation="8" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold">
            {{ totalEvaluaciones }}
          </v-card-title>
          <v-card-subtitle class="text-h6">
            <v-icon left>mdi-clipboard-list</v-icon>
            Total Evaluaciones
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center" color="success" dark elevation="8" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold">
            {{ evaluacionesConfirmadas }}
          </v-card-title>
          <v-card-subtitle class="text-h6">
            <v-icon left>mdi-check-circle</v-icon>
            Confirmadas
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center" color="warning" dark elevation="8" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold">
            {{ evaluacionesPendientes }}
          </v-card-title>
          <v-card-subtitle class="text-h6">
            <v-icon left>mdi-clock</v-icon>
            Pendientes
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center" color="info" dark elevation="8" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold">
            {{ evaluacionesAdquiridas }}
          </v-card-title>
          <v-card-subtitle class="text-h6">
            <v-icon left>mdi-cart-check</v-icon>
            Adquiridas
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Calendario de Valoraciones -->
    <v-card class="mx-auto mb-8" elevation="12" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold bg-gradient-primary text-white">
        📅 Calendario de Evaluaciones
      </v-card-title>
      <valoracion-calendar
        :valoraciones="valoraciones"
        @citaClicked="handleCitaClicked"
        @dayClicked="handleDayClicked"
      />
    </v-card>

    <!-- Lista de Valoraciones Mejorada -->
    <v-card class="mx-auto mb-8" max-width="1400" elevation="12" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold bg-gradient-primary text-white d-flex align-center">
        <v-icon left class="mr-2">mdi-clipboard-list</v-icon>
        Panel de Evaluaciones
        <!-- Botones a la izquierda -->
        <v-btn color="primary" class="ml-6 mr-2" @click="openMultiStepDialog = true">
          <v-icon left>mdi-calendar-check</v-icon>
          Registrar
        </v-btn>
        <v-btn color="secondary" class="mr-6" @click="openStartEvaluationDialog = true">
          <v-icon left>mdi-play-circle</v-icon>
          Empezar
        </v-btn>
        <v-spacer />
        <!-- Campo de búsqueda a la derecha -->
        <v-text-field
          v-model="searchQuery"
          append-icon="mdi-magnify"
          label="Buscar evaluaciones"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="max-width-300 ml-2"
          @input="searchValoraciones"
        />
      </v-card-title>
      <v-divider />

      <!-- Lista de valoraciones mejorada -->
      <div class="pa-6">
        <div class="evaluations-scroll-panel">
          <v-row v-if="!filteredValoraciones || filteredValoraciones.length === 0" class="text-center py-12">
            <v-col>
              <v-icon size="80" color="grey">mdi-clipboard-remove</v-icon>
              <div class="text-h5 text-grey mt-6">No hay evaluaciones para mostrar</div>
              <div class="text-body-1 text-grey-lighten-1 mt-2">Comienza registrando una nueva evaluación</div>
            </v-col>
          </v-row>
          <v-row v-else class="evaluations-grid" justify="center">
            <v-col v-for="item in filteredValoraciones" :key="item.id_valoracion" cols="12" sm="6" md="4" lg="4">
              <v-card
                class="evaluation-card"
                elevation="6"
              >
                <v-card-title class="d-flex align-center">
                  <v-avatar 
                    :color="getEstadoColor(item.estado)" 
                    size="48" 
                    class="mr-4 client-avatar"
                  >
                    <span class="text-h6 font-weight-bold">
                      {{ (item.Cliente?.nombre_cliente || 'C').charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ item.Cliente?.nombre_cliente || 'Cliente' }} {{ item.Cliente?.apellido_paterno || '' }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ formatDateToDayMonthYear(item.fecha_valoracion) }}
                    </div>
                  </div>
                  <v-spacer />
                </v-card-title>
                
                <v-card-text>
                  <div class="d-flex align-center mb-3">
                    <v-icon size="18" color="primary" class="mr-3">mdi-account</v-icon>
                    <div>
                      <div class="text-body-2 font-weight-medium">Evaluador</div>
                      <div class="text-caption text-grey">
                        {{ item.Empleado?.nombre_empleado || 'Empleado' }} {{ item.Empleado?.apellido_paterno || '' }}
                      </div>
                    </div>
                  </div>
                  
                  <v-divider class="my-3"></v-divider>
                  
                  <div class="d-flex align-center mb-3">
                    <v-icon size="18" color="success" class="mr-3">mdi-calendar-check</v-icon>
                    <div>
                      <div class="text-body-2 font-weight-medium">Estado</div>
                      <v-chip 
                        :color="getEstadoColor(item.estado)" 
                        size="small" 
                        class="mt-1"
                        variant="elevated"
                      >
                        {{ item.estado }}
                      </v-chip>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                  <v-btn 
                    color="primary" 
                    variant="tonal" 
                    size="small"
                    @click="openEditDialog(item)"
                    prepend-icon="mdi-pencil"
                    class="action-btn-card"
                  >
                    Editar
                  </v-btn>
                  <v-spacer />
                  <v-btn 
                    color="error" 
                    variant="tonal" 
                    size="small"
                    @click="openDeleteDialog(item)"
                    prepend-icon="mdi-delete"
                    class="action-btn-card"
                  >
                    Eliminar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>

    <!-- Dialog de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la valoración con ID
          <span v-if="valoracionToDelete">{{ valoracionToDelete.id_valoracion }}</span>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="deleteDialog = false">
            No
          </v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">
            Sí
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Wizard multi-paso para registrar al posible cliente y agendar la evaluación -->
    <v-dialog v-model="openMultiStepDialog" persistent max-width="700px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold bg-gradient-primary text-white">
          <v-icon left>mdi-calendar-plus</v-icon>
          {{ currentStepObject.title }}
        </v-card-title>
        <v-card-text class="pa-6">
          <!-- Pasos numerados -->
          <div class="d-flex justify-space-between mb-6">
            <div v-for="(step, index) in steps" :key="index" class="text-center">
              <v-avatar 
                :color="currentStep >= index ? 'primary' : 'grey'" 
                size="40"
                class="mb-2"
              >
                <v-icon v-if="currentStep > index" color="white">mdi-check</v-icon>
                <span v-else class="text-white font-weight-bold">{{ index + 1 }}</span>
              </v-avatar>
              <div class="text-caption">{{ step.title }}</div>
            </div>
          </div>
          
          <div class="mb-4">{{ currentStepObject.description }}</div>
          <v-progress-linear
            :value="progressValue"
            height="8"
            color="primary"
            class="my-4"
            rounded
          />
          <!-- Paso de 'Alta de posible cliente' -->
          <div v-if="currentStepObject.isPosibleClienteStep">
            <posible-cliente-dialog
              ref="posibleClienteForm"
              :showDialog="true"
              @addCliente="handleAddPosibleCliente"
              @close="handleClosePosibleCliente"
            />
          </div>
          <!-- Paso del formulario de agendamiento de evaluación -->
          <div v-else-if="currentStepObject.isValoracionForm">
            <v-form ref="valoracionFormRef" v-model="formValoracionIsValid">
              <v-text-field
                label="Fecha evaluación"
                v-model="valoracion.fecha_valoracion"
                type="datetime-local"
                :rules="[rules.required]"
                variant="filled"
                color="teal"
                class="mb-4"
              />
              <v-autocomplete
                label="Nombre del cliente"
                v-model="valoracion.id_cliente"
                :rules="[rules.required]"
                :items="clienteOptions"
                variant="filled"
                color="teal"
                class="mb-4"
              />
              <v-autocomplete
                label="Nombre del terapeuta"
                v-model="valoracion.id_empleado"
                :rules="[rules.required]"
                :items="empleadoOptions"
                variant="filled"
                color="teal"
                class="mb-4"
              />
              <v-select
                label="Estado"
                v-model="valoracion.estado"
                :items="['Por confirmar', 'Confirmado','Adquirió', 'No adquirió', 'Cancelado']"
                :rules="[rules.required]"
                variant="filled"
                color="teal"
                class="mb-4"
              />
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" :disabled="currentStep === 0" @click="handlePrevious">
            <v-icon left>mdi-arrow-left</v-icon>
            Anterior
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="currentStepObject.isPosibleClienteStep"
            color="primary"
            @click="handleSavePosibleCliente"
          >
            Registrar Posible Cliente
            <v-icon right>mdi-content-save</v-icon>
          </v-btn>
          <v-btn v-else-if="isLastStep" color="primary" @click="handleFinish">
            Registrar Evaluación
            <v-icon right>mdi-calendar-check</v-icon>
          </v-btn>
          <v-btn v-else color="primary" @click="handleNextStep">
            Siguiente
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Wizard multi-paso para empezar la evaluación -->
    <v-dialog v-model="openStartEvaluationDialog" persistent max-width="700px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold bg-gradient-primary text-white">
          <v-icon left>mdi-play-circle</v-icon>
          {{ currentStartStepObject.title }}
        </v-card-title>
        <v-card-text class="pa-6">
          <!-- Pasos numerados -->
          <div class="d-flex justify-space-between mb-6">
            <div v-for="(step, index) in evaluationSteps" :key="index" class="text-center">
              <v-avatar 
                :color="currentStartStep >= index ? 'primary' : 'grey'" 
                size="40"
                class="mb-2"
              >
                <v-icon v-if="currentStartStep > index" color="white">mdi-check</v-icon>
                <span v-else class="text-white font-weight-bold">{{ index + 1 }}</span>
              </v-avatar>
              <div class="text-caption">{{ step.title }}</div>
            </div>
          </div>
          
          <div class="mb-4">{{ currentStartStepObject.description }}</div>
          <v-progress-linear
            :value="progressStartValue"
            height="8"
            color="primary"
            class="my-4"
            rounded
          />
      
      <!-- Paso para seleccionar el cliente -->
      <v-fade-transition>
        <div v-if="currentStartStepObject.isSelectClient">
          <v-autocomplete
            label="Seleccione un cliente"
            v-model="evaluationData.id_cliente"
            :items="clienteOptions"
            :rules="[rules.required]"
            variant="outlined"
            color="primary"
            class="mb-4"
            prepend-inner-icon="mdi-account-search"
          />
        </div>
      </v-fade-transition>
      
      <!-- Paso del formulario de evaluación -->
      <v-fade-transition>
        <div v-if="currentStartStepObject.isEvaluationForm">
          <v-form ref="evaluationFormRef" v-model="formEvaluationIsValid">
            <v-text-field
              label="¿Por qué quieres bajar de peso?"
              v-model="evaluationData.motivo_bajar"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-heart"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
            <v-text-field
              label="¿Cuánto te gustaría bajar (kg)?"
              v-model="evaluationData.cantidad_bajar"
              type="number"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-weight"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
            <v-text-field
              label="Peso Actual (kg)"
              v-model="evaluationData.peso_actual"
              type="number"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-weight"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
            <v-text-field
              label="Estatura (m)"
              v-model="evaluationData.estatura"
              type="number"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-human-male-height"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
            <v-text-field
              label="Cintura (cm)"
              v-model="evaluationData.cintura"
              type="number"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-human"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
            <v-text-field
              label="Cadera (cm)"
              v-model="evaluationData.cadera"
              type="number"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-human"
              variant="outlined"
              color="primary"
              class="mb-4"
            />
          </v-form>
        </div>
      </v-fade-transition>
      
      <!-- Puedes agregar condiciones para otros pasos si lo requieres -->
    </v-card-text>
    <v-card-actions>
      <v-btn variant="outlined" :disabled="currentStartStep === 0" @click="handlePreviousStartStep">
        <v-icon left>mdi-arrow-left</v-icon>
        Anterior
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="isLastStartStep"
        color="secondary"
        @click="handleFinishStartEvaluation"
      >
        Terminar Evaluación
        <v-icon right>mdi-check-circle</v-icon>
      </v-btn>
      <v-btn v-else color="secondary" @click="handleNextStartStep">
        Siguiente
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Agrega el <v-dialog> con ValoracionDialog al final del template, fuera de cualquier card de acciones -->
<v-dialog v-model="showDialog" persistent width="1024">
  <valoracion-dialog
    :showDialog="showDialog"
    :valoracionParaEditar="valoracionAEditar"
    @close="showDialog = false"
    @addValoracion="addValoracion"
    @updateValoracion="updateValoracion"
  />
</v-dialog>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import ValoracionCalendar from "@/components/ValoracionCalendar.vue";
import PosibleClienteDialog from "@/components/PosibleClienteDialog.vue";
import ValoracionDialog from "@/components/ValoracionDialog.vue";

// Importamos los composables creados
import useValoracionesManagement from "@/composables/useValoracionesManagement";
import useRegistroEvaluacionWizard from "@/composables/useRegistroEvaluacionWizard";
import useEmpezarEvaluacionWizard from "@/composables/useEmpezarEvaluacionWizard";
import { formatDateToDayMonthYear } from "@/utils/useDateUtils";

export default {
  name: "Valoracion_view",
  components: {
    ValoracionCalendar,
    ValoracionDialog,
    PosibleClienteDialog,
  },
  setup() {
    // Extraemos la lógica de cada parte en su respectivo composable
    const valoracionesManagement = useValoracionesManagement();
    
    // Pasamos addValoracion al inicializar el wizard de registro
    const registroEvaluacionWizard = useRegistroEvaluacionWizard({
      addValoracion: valoracionesManagement.addValoracion,
    });
    const empezarEvaluacionWizard = useEmpezarEvaluacionWizard({
      clientes: registroEvaluacionWizard.clientes,
    });

    // Al montar el componente, cargamos las valoraciones
    onMounted(() => {
      valoracionesManagement.fetchValoraciones();
    });

    // Funciones computadas para estadísticas
    const totalEvaluaciones = computed(() => {
      const valoraciones = valoracionesManagement.valoraciones;
      return Array.isArray(valoraciones) ? valoraciones.length : 0;
    });
    
    const evaluacionesConfirmadas = computed(() => {
      const valoraciones = valoracionesManagement.valoraciones;
      return Array.isArray(valoraciones) 
        ? valoraciones.filter(v => v.estado === 'Confirmado').length 
        : 0;
    });
    
    const evaluacionesPendientes = computed(() => {
      const valoraciones = valoracionesManagement.valoraciones;
      return Array.isArray(valoraciones) 
        ? valoraciones.filter(v => v.estado === 'Por confirmar').length 
        : 0;
    });
    
    const evaluacionesAdquiridas = computed(() => {
      const valoraciones = valoracionesManagement.valoraciones;
      return Array.isArray(valoraciones) 
        ? valoraciones.filter(v => v.estado === 'Adquirió').length 
        : 0;
    });

    // Función para obtener el color del estado
    const getEstadoColor = (estado) => {
      const colores = {
        'Por confirmar': 'warning',
        'Confirmado': 'success',
        'Adquirió': 'primary',
        'No adquirió': 'error',
        'Cancelado': 'grey'
      };
      return colores[estado] || 'grey';
    };

    // Reglas de validación
    const rules = {
      required: (value) => !!value || "Este campo es requerido",
    };

    return {
      // Propiedades y métodos de la lista de valoraciones
      ...valoracionesManagement,
      // Propiedades y métodos del wizard de registro de evaluación
      ...registroEvaluacionWizard,
      // Propiedades y métodos del wizard de empezar evaluación
      ...empezarEvaluacionWizard,
      // Utilidad para formatear fechas
      formatDateToDayMonthYear,
      // Estadísticas
      totalEvaluaciones,
      evaluacionesConfirmadas,
      evaluacionesPendientes,
      evaluacionesAdquiridas,
      // Función para colores de estado
      getEstadoColor,
      // Reglas de validación
      rules,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.valoracion-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.button-container {
  margin-top: 10px;
  margin-bottom: 10px;
}
.button-spacing {
  padding-top: 30px;
  padding-left: 15px;
}
.mb-4 {
  margin-bottom: 1rem;
}
.hidden-add-dialog {
  display: none;
}

/* Estilos para el dashboard */
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}

.max-width-300 {
  max-width: 300px;
}

/* Animaciones para las cards */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

/* Estilos para los avatares */
.v-avatar {
  transition: all 0.3s ease;
}

/* Estilos para los chips de estado */
.v-chip {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Estilos para el wizard */
.v-dialog .v-card {
  border-radius: 16px;
}

.v-progress-linear {
  border-radius: 4px;
}

/* Estilos para los campos de formulario */
.v-text-field {
  margin-bottom: 16px;
}

/* Estilos para los botones */
.v-btn {
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Estilos para el calendario */
.calendar-container {
  border-radius: 12px;
  overflow: hidden;
}

/* Estilos para las estadísticas */
.stats-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: scale(1.02);
}

/* Estilos para la lista vacía */
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-state .v-icon {
  opacity: 0.5;
}

/* Estilos para la grilla de evaluaciones */
.evaluations-grid {
  gap: 16px;
  margin: 0 -8px;
}

.evaluations-grid .v-col {
  padding: 8px;
}

/* Estilos para los botones de acción */
.action-buttons {
  gap: 16px;
}

.action-btn {
  height: 56px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.primary-btn {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
}

.secondary-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
}

/* Estilos para las cards de evaluación */
.evaluations-grid .v-col {
  padding: 12px;
}

/* Limpieza: solo deja estilos visuales, sin fondo ni color forzado en .evaluation-card */
.evaluation-card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.evaluation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
}

.evaluation-card .v-card-title {
  flex-shrink: 0;
  padding: 20px 20px 16px 20px;
}

.evaluation-card .v-card-text {
  flex-grow: 1;
  padding: 0 20px 16px 20px;
}

.evaluation-card .v-card-actions {
  flex-shrink: 0;
  margin-top: auto;
  padding: 16px 20px 20px 20px;
}

/* Estilos para los botones de acción en las cards */
.action-btn-card {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* Mejoras adicionales para las cards */
.evaluation-card {
  border: 1px solid rgba(0,0,0,0.05);
  background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
}

.evaluation-card:hover {
  border-color: rgba(25, 118, 210, 0.2);
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
}

/* Estilos para los iconos en las cards */
.evaluation-card .v-icon {
  transition: all 0.3s ease;
}

.evaluation-card:hover .v-icon {
  transform: scale(1.1);
}

/* Estilos para el divider */
.evaluation-card .v-divider {
  opacity: 0.6;
}

/* Estilos para el avatar del cliente */
.client-avatar {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.evaluation-card:hover .client-avatar {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .evaluations-grid .v-col {
    padding: 6px;
  }
  
  .evaluation-card {
    min-height: 280px;
  }
  
  .action-buttons .v-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .evaluations-grid .v-col {
    padding: 4px;
  }
  
  .evaluation-card {
    min-height: 260px;
  }
  
  .action-btn {
    height: 48px;
    font-size: 14px;
  }
}

.evaluations-scroll-panel {
  max-height: 70vh;
  min-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 8px;
  /* Opcional: para que el scroll se vea bonito */
  scrollbar-width: thin;
  scrollbar-color: #1976d2 #e3e3e3;
}

.evaluations-scroll-panel::-webkit-scrollbar {
  width: 8px;
}
.evaluations-scroll-panel::-webkit-scrollbar-thumb {
  background: #1976d2;
  border-radius: 8px;
}
.evaluations-scroll-panel::-webkit-scrollbar-track {
  background: #e3e3e3;
  border-radius: 8px;
}

/* Limpieza: elimina .evaluation-card-dark y cualquier background/color en .evaluation-card */

/* Si quieres máxima compatibilidad, puedes agregar: */
.theme--dark .evaluation-card {
  background: #23272e !important;
  color: #fff !important;
  border: 1px solid #333 !important;
}
</style>
