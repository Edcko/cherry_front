<template>
  <div>
    <!-- Ejemplo de Calendario -->
    <valoracion-calendar
      :valoraciones="valoraciones"
      @citaClicked="handleCitaClicked"
      @dayClicked="handleDayClicked"
    />

    <!-- Lista de Valoraciones existente -->
    <v-col cols="12">
      <v-card class="mx-auto my-4" max-width="1000" elevation="10">
        <v-card-title class="custom-button">
          Evaluación
          <v-spacer />
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            label="Buscar evaluaciones"
            single-line
            hide-details
            @input="searchValoraciones"
          />
        </v-card-title>
        <v-divider />

        <!-- Lista de valoraciones -->
        <v-virtual-scroll :items="filteredValoraciones" height="400" item-height="48">
          <template v-slot:default="{ item }">
            <v-list-item
              :title="`Evaluación: ${formatDateToDayMonthYear(item.fecha_valoracion)} | 
                      Cliente: ${item.Cliente.nombre_cliente} ${item.Cliente.apellido_paterno} ${item.Cliente.apellido_materno}`"
              :subtitle="`Evaluador: ${item.Empleado.nombre_empleado} ${item.Empleado.apellido_paterno} 
                          ${item.Empleado.apellido_materno} | Estado: ${item.estado}`"
            >
              <template v-slot:prepend>
                <v-icon class="custom-button">mdi-star</v-icon>
              </template>

              <template v-slot:append>
                <!-- Botón para editar la valoración -->
                <v-btn class="custom-button" icon @click="openEditDialog(item)">
                  <v-icon>mdi-transfer</v-icon>
                </v-btn>
                <div class="button-spacing"></div>
                <!-- Botón para eliminar la valoración -->
                <v-btn class="custom-button" icon @click="openDeleteDialog(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>

        <v-row justify="center" class="button-container">
          <!-- Botón para abrir el diálogo de agregar/editar valoración (oculto) -->
          <v-dialog v-model="showDialog" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn
                elevation="8"
                rounded
                :large="true"
                class="custom-button hidden-add-dialog"
                v-bind="props"
                icon
                @click="openAddDialog"
              >
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </template>
            <valoracion-dialog
              :showDialog="showDialog"
              :valoracionParaEditar="valoracionAEditar"
              @close="showDialog = false"
              @addValoracion="addValoracion"
              @updateValoracion="updateValoracion"
            />
          </v-dialog>

          <!-- Botón para iniciar el Wizard de registro y agendamiento de evaluación -->
          <div class="button-spacing"></div>
          <v-btn class="custom-button" elevation="8" rounded large @click="openMultiStepDialog = true">
            <v-icon left>mdi-calendar-check</v-icon>
            Registrar Evaluación
          </v-btn>

          <!-- Nuevo botón para empezar evaluación -->
          <div class="button-spacing"></div>
          <v-btn class="custom-button"  elevation="8" rounded large @click="openStartEvaluationDialog = true">
            <v-icon left>mdi-play-circle</v-icon>
            Empezar Evaluación
          </v-btn>
        </v-row>
      </v-card>
    </v-col>

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
    <v-dialog v-model="openMultiStepDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>{{ currentStepObject.title }}</v-card-title>
        <v-card-text>
          <div class="mb-4">{{ currentStepObject.description }}</div>
          <v-progress-linear
            :value="progressValue"
            height="6"
            color="primary"
            class="my-4"
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
    <v-dialog v-model="openStartEvaluationDialog" persistent max-width="600px">
  <v-card>
    <v-card-title>{{ currentStartStepObject.title }}</v-card-title>
    <v-card-text>
      <div class="mb-4">{{ currentStartStepObject.description }}</div>
      <v-progress-linear
        :value="progressStartValue"
        height="6"
        color="secondary"
        class="my-4"
      />
      
      <!-- Paso para seleccionar el cliente -->
      <div v-if="currentStartStepObject.isSelectClient">
        <v-select
          label="Seleccione un cliente"
          v-model="evaluationData.id_cliente"
          :items="clienteOptions"
          :rules="[rules.required]"
        />
      </div>
      
      <!-- Paso del formulario de evaluación -->
      <div v-else-if="currentStartStepObject.isEvaluationForm">
        <v-form ref="evaluationFormRef" v-model="formEvaluationIsValid">
          <v-text-field
            label="¿Por qué quieres bajar de peso?"
            v-model="evaluationData.motivo_bajar"
            :rules="[rules.required]"
          />
          <v-text-field
            label="¿Cuánto te gustaría bajar (kg)?"
            v-model="evaluationData.cantidad_bajar"
            type="number"
            :rules="[rules.required]"
          />
          <v-text-field
            label="Peso Actual (kg)"
            v-model="evaluationData.peso_actual"
            type="number"
            :rules="[rules.required]"
          />
          <v-text-field
            label="Estatura (m)"
            v-model="evaluationData.estatura"
            type="number"
            :rules="[rules.required]"
          />
          <v-text-field
            label="Cintura (cm)"
            v-model="evaluationData.cintura"
            type="number"
            :rules="[rules.required]"
          />
          <v-text-field
            label="Cadera (cm)"
            v-model="evaluationData.cadera"
            type="number"
            :rules="[rules.required]"
          />
        </v-form>
      </div>
      
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
        Comenzar Evaluación
        <v-icon right>mdi-play-circle</v-icon>
      </v-btn>
      <v-btn v-else color="secondary" @click="handleNextStartStep">
        Siguiente
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </div>
</template>

<script>
import { onMounted } from "vue";
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

    return {
      // Propiedades y métodos de la lista de valoraciones
      ...valoracionesManagement,
      // Propiedades y métodos del wizard de registro de evaluación
      ...registroEvaluacionWizard,
      // Propiedades y métodos del wizard de empezar evaluación
      ...empezarEvaluacionWizard,
      // Utilidad para formatear fechas
      formatDateToDayMonthYear,
    };
  },
};
</script>

<style scoped>
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
</style>
