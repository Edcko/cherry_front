<template>
  <v-card class="modern-card" :class="{ 'status-changed': highlight }">
    <!-- Header con estado y fecha -->
    <div class="card-header" :style="{ borderLeftColor: estadoColor }">
      <div class="status-badge" :style="{ backgroundColor: estadoColor }">
        <v-icon size="16" color="white">mdi-circle</v-icon>
        <span>{{ cita.estado.toUpperCase() }}</span>
      </div>
      <div class="date-time">
        <v-icon size="18" color="grey">mdi-clock-outline</v-icon>
        <span>{{ formattedFecha }}</span>
      </div>
    </div>

    <!-- Contenido principal -->
    <v-card-text class="card-content">
      <!-- Información del cliente destacada -->
      <div class="client-section">
        <div class="avatar-placeholder">
          <v-icon size="24" color="primary">mdi-account-circle</v-icon>
        </div>
        <div class="client-info">
          <h3 class="client-name">{{ clientFullName }}</h3>
          <p class="client-detail">Paciente</p>
        </div>
      </div>

      <!-- Grid de información -->
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="primary">mdi-calendar-check</v-icon>
          </div>
          <div class="info-content">
            <label>Agendó</label>
            <span>{{ agendoFullName }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="secondary">mdi-hospital-building</v-icon>
          </div>
          <div class="info-content">
            <label>Turno</label>
            <span>{{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="success">mdi-account-heart</v-icon>
          </div>
          <div class="info-content">
            <label>Terapeuta</label>
            <span>{{ terapeutaFullName }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="warning">mdi-package-variant-closed</v-icon>
          </div>
          <div class="info-content">
            <label>Paquete</label>
            <span>{{ paqueteName }}</span>
          </div>
        </div>
      </div>

      <!-- Número de cita -->
      <div class="cita-number">
        <v-chip
          size="small"
          color="primary"
          variant="outlined"
          class="cita-chip"
        >
          <v-icon size="16" class="mr-1">mdi-pound</v-icon>
          Cita #{{ numeroCita }}
        </v-chip>
      </div>
    </v-card-text>

    <!-- Acciones en la parte inferior -->
    <v-card-actions class="card-actions">
      <div class="action-buttons">
        <v-btn
          v-show="user && ['Administrador', 'Gerente', 'Desarrollador'].includes(user.tipo_empleado)"
          variant="text"
          color="error"
          size="small"
          @click="handleDeleteCita(cita)"
          class="action-btn"
        >
          <v-icon size="18">mdi-delete-outline</v-icon>
          <span class="btn-text">Eliminar</span>
        </v-btn>

        <v-btn
          v-show="user && ['Administrador', 'Gerente', 'Desarrollador', 'Manager'].includes(user.tipo_empleado)"
          variant="text"
          color="success"
          size="small"
          @click="changeEstado(cita)"
          class="action-btn"
        >
          <v-icon size="18">mdi-check-circle-outline</v-icon>
          <span class="btn-text">Cambiar Estado</span>
        </v-btn>
      </div>
    </v-card-actions>

    <!-- Diálogo para editar cita -->
    <cita-edit-dialog
      v-model="showEditDialog"
      :cita="currentCita"
      @update="updateCitaFromForm"
      @closeDialog="showEditDialog = false"
    />

    <!-- Diálogo de confirmación para eliminar cita -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de eliminar la cita #{{ citaToDelete.id_cita }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" text @click="deleteCita">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useUser from "@/composables/useUser";
import CitaEditDialog from "@/components/CitaEditDialog.vue";

export default {
  name: "CitaCard",
  components: {
    CitaEditDialog,
  },
  props: ["cita", "changeEstado"],
  setup(props, { emit }) {
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const confirmDeleteDialog = ref(false);
    const citaToDelete = ref(null);
    const { user } = useUser();
    const highlight = ref(false);

    // Detectar cambio de estado y activar animación highlight
    watch(() => props.cita.estado, () => {
      highlight.value = false;
      setTimeout(() => { highlight.value = true; }, 10);
      setTimeout(() => { highlight.value = false; }, 400);
    });

    onMounted(() => {
      console.log('🔍 CitaCard: Componente montado, usuario:', user.value);
    });

    const formattedFecha = computed(() => {
      const fecha = new Date(props.cita.fecha);
      const dia = format(fecha, "EEEE dd 'de' MMMM", { locale: es });
      
      // Formatear hora en formato 12 horas (AM/PM)
      const hours = fecha.getHours();
      const minutes = fecha.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12;
      const hoursDisplay = hours12 === 0 ? 12 : hours12;
      const minutesDisplay = minutes.toString().padStart(2, '0');
      const horaFormateada = `${hoursDisplay}:${minutesDisplay} ${ampm}`;
      
      return `${dia} a las ${horaFormateada}`;
    });

    const clientFullName = computed(() => {
      return `${props.cita.Cliente.nombre_cliente} ${props.cita.Cliente.apellido_paterno} ${props.cita.Cliente.apellido_materno}`;
    });

    const agendoFullName = computed(() => {
      return props.cita.Empleado
        ? `${props.cita.Empleado.nombre_empleado} ${props.cita.Empleado.apellido_paterno} ${props.cita.Empleado.apellido_materno}`
        : "";
    });

    const terapeutaFullName = computed(() => {
      return `${props.cita.Cabina.Empleado.nombre_empleado} ${props.cita.Cabina.Empleado.apellido_paterno} ${props.cita.Cabina.Empleado.apellido_materno}`;
    });

    const paqueteName = computed(() => {
      return props.cita.Paquete.nombre_paquete;
    });

    const numeroCita = computed(() => {
      return props.cita.numero_visita;
    });

    const estadoColor = computed(() => {
      const colors = {
        "por confirmar": "#ff9800",
        "cita programada": "#9c27b0",
        "cita realizada": "#87CEEB", // Azul cielo
        "cita perdida": "#E91E63", // Rosa mexicano
        "reagendo cita": "#ffc107",
        "adeudo": "#f44336",
        "cancelada": "#9e9e9e",
      };
      return colors[props.cita.estado.toLowerCase()] || "#9e9e9e";
    });

    const handleDeleteCita = (cita) => {
      citaToDelete.value = cita;
      confirmDeleteDialog.value = true;
    };

    const deleteCita = () => {
      emit("deleteCita", citaToDelete.value);
      confirmDeleteDialog.value = false;
    };

    const editCita = (cita) => {
      currentCita.value = cita;
      showEditDialog.value = true;
    };

    const updateCitaFromForm = (cita) => {
      emit("updateCita", cita);
    };

    return {
      formattedFecha,
      clientFullName,
      agendoFullName,
      terapeutaFullName,
      paqueteName,
      numeroCita,
      estadoColor,
      showEditDialog,
      currentCita,
      updateCitaFromForm,
      handleDeleteCita,
      confirmDeleteDialog,
      citaToDelete,
      deleteCita,
      editCita,
      user,
      highlight,
    };
  },
  methods: {
    truncateName(name, limit = 30) {
      return name.length > limit ? name.substring(0, limit) + "..." : name;
    },
  },
};
</script>

<style scoped>
.modern-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  background: white;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.modern-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #e0e0e0;
}

.status-changed {
  animation: statusChange 0.6s ease-in-out;
}

@keyframes statusChange {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Header */
.card-header {
  padding: 20px 24px 16px 24px;
  background: #fafafa;
  border-left: 4px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.date-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Contenido */
.card-content {
  padding: 20px 24px;
}

.client-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.client-detail {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

/* Grid de información */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-content label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content span {
  font-size: 0.875rem;
  color: #1a1a1a;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Número de cita */
.cita-number {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.cita-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Acciones */
.card-actions {
  padding: 16px 24px 20px 24px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.3px;
}

.btn-text {
  margin-left: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .client-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .info-content span {
    font-size: 0.8rem;
    line-height: 1.3;
  }
  
  .client-name {
    font-size: 1rem;
    line-height: 1.2;
  }
}

@media (max-width: 480px) {
  .modern-card {
    margin: 8px;
    border-radius: 12px;
    max-width: calc(100vw - 16px);
  }
  
  .card-header,
  .card-content,
  .card-actions {
    padding: 12px;
  }
  
  .client-name {
    font-size: 0.95rem;
    line-height: 1.1;
  }
  
  .info-content span {
    font-size: 0.75rem;
    line-height: 1.2;
  }
  
  .info-content label {
    font-size: 0.7rem;
  }
  
  .status-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
  
  .date-time {
    font-size: 0.8rem;
  }
}
</style>
