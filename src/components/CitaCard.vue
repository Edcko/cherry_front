<template>
  <v-card class="custom-card" :class="{ 'highlight-estado': highlight }">
    <!-- Cabecera con icono grande y gradiente de estado -->
    <div class="card-header-gradient" :style="{ background: estadoGradient }">
      <v-icon class="header-icon" size="38">mdi-calendar-clock</v-icon>
      <div class="header-info">
        <div class="header-estado">{{ cita.estado }}</div>
        <div class="header-fecha">{{ formattedFecha }}</div>
      </div>
    </div>

    <v-card-text>
      <div class="info-list">
        <!-- Cliente -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-account</v-icon>
            Cliente:
          </span>
          <span class="info-value truncate" :title="clientFullName">
            {{ clientFullName }}
          </span>
        </div>
        <!-- Agendó -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-calendar-check</v-icon>
            Agendó:
          </span>
          <span class="info-value truncate" :title="agendoFullName">
            {{ agendoFullName }}
          </span>
        </div>
        <!-- Turno y estado cabina -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-hospital-building</v-icon>
            Turno:
          </span>
          <span class="info-value">
            {{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}
          </span>
        </div>
        <!-- Terapeuta -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-account-heart</v-icon>
            Terapeuta:
          </span>
          <span class="info-value truncate" :title="terapeutaFullName">
            {{ terapeutaFullName }}
          </span>
        </div>
        <!-- Paquete -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-package-variant-closed</v-icon>
            Paquete:
          </span>
          <span class="info-value truncate" :title="paqueteName">
            {{ paqueteName }}
          </span>
        </div>
        <!-- Número de cita -->
        <div class="info-row">
          <span class="info-label">
            <v-icon small class="mr-1">mdi-pound</v-icon>
            No. de cita:
          </span>
          <span class="info-value">{{ numeroCita }}</span>
        </div>
      </div>
    </v-card-text>

    <!-- Acciones flotantes -->
    <v-card-actions class="card-actions-float">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-if="['Administrador', 'Gerente', 'Desarrollador'].includes(user.tipo_empleado)"
            icon
            color="error"
            v-bind="attrs"
            v-on="on"
            @click="handleDeleteCita(cita)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Eliminar cita</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-if="['Administrador', 'Gerente', 'Desarrollador', 'Manager'].includes(user.tipo_empleado)"
            icon
            color="success"
            v-bind="attrs"
            v-on="on"
            @click="changeEstado(cita)"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Cambiar estado</span>
      </v-tooltip>
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
import chroma from "chroma-js";

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
    const { user, loadUser } = useUser();
    const highlight = ref(false);

    // Detectar cambio de estado y activar animación highlight
    watch(() => props.cita.estado, () => {
      highlight.value = false;
      setTimeout(() => { highlight.value = true; }, 10);
      setTimeout(() => { highlight.value = false; }, 400);
    });

    onMounted(async () => {
      await loadUser();
    });



    const formattedFecha = computed(() => {
      return format(new Date(props.cita.fecha), "EE dd/MMM/yy HH:mm", { locale: es });
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
        "por confirmar": "#f18933",
        "cita programada": "#9754af",
        "cita realizada": "#77dd77",
        "cita perdida": "#84b6f4",
        "reagendo cita": "#eeca06",
        adeudo: "#a62520",
      };
      const color = colors[props.cita.estado.toLowerCase()] || "#9e9e9e";
      return chroma(color).hex();
    });

    function getEstadoGradient(estado) {
      const gradients = {
        "por confirmar": "linear-gradient(90deg, #f18933 0%, #fbbf24 100%)",
        "cita programada": "linear-gradient(90deg, #9754af 0%, #7f9cf5 100%)",
        "cita realizada": "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
        "cita perdida": "linear-gradient(90deg, #84b6f4 0%, #60a5fa 100%)",
        "cita cancelada": "linear-gradient(90deg, #bdbdbd 0%, #e0e0e0 100%)",
        "reagendo cita": "linear-gradient(90deg, #eeca06 0%, #fbbf24 100%)",
        "adeudo": "linear-gradient(90deg, #a62520 0%, #f43f5e 100%)",
      };
      return gradients[estado.toLowerCase()] || "linear-gradient(90deg, #9e9e9e 0%, #cbd5e1 100%)";
    }

    const estadoGradient = computed(() => getEstadoGradient(props.cita.estado));

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
      // eslint-disable-next-line
      changeEstado: props.changeEstado,
      estadoGradient,
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
.custom-card {
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  margin-bottom: 28px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255,255,255,0.18);
  transition: transform 0.18s, box-shadow 0.18s, border 0.18s;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
  position: relative;
  overflow: hidden;
}
.custom-card:hover {
  transform: translateY(-6px) scale(1.025);
  box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.22);
  border: 1.5px solid #7f9cf5;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: none; }
}

.card-header-gradient {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 24px 12px 24px;
  border-radius: 22px 22px 0 0;
  box-shadow: 0 2px 12px rgba(31,38,135,0.08);
  color: white;
  min-height: 70px;
  position: relative;
  margin-bottom: 8px;
  background-blend-mode: multiply;
}
.header-icon {
  background: rgba(255,255,255,0.18);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(31,38,135,0.10);
  color: white !important;
}
.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.header-estado {
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.10);
  color: white;
}
.header-fecha {
  font-size: 1.01rem;
  font-weight: 500;
  color: #f1f5f9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.10);
}

.info-list {
  margin-top: 2px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  transition: background 0.2s;
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  font-weight: 700;
  color: var(--v-on-surface-variant, #64748b);
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  gap: 4px;
}
.info-value {
  color: var(--v-on-surface, #334155);
  font-size: 1.05rem;
  font-weight: 500;
}
.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions-float {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: -32px;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}
.v-btn[icon] {
  transition: background 0.2s, box-shadow 0.2s;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(31,38,135,0.10);
  background: rgba(255,255,255,0.18);
  position: relative;
  overflow: hidden;
}
.v-btn[icon]:hover {
  background: linear-gradient(90deg, #7f9cf5 0%, #5eead4 100%) !important;
  box-shadow: 0 4px 16px rgba(31,38,135,0.18);
}
.v-btn[icon] .v-icon {
  font-size: 1.5rem;
  color: #3b3b3b;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));
}
.v-btn[icon]:hover .v-icon {
  color: white;
}

.highlight-estado {
  animation: highlightFade 0.4s cubic-bezier(.23,1.01,.32,1) both;
  box-shadow: 0 0 0 0.5rem rgba(255,255,255,0.13);
}
@keyframes highlightFade {
  0% {
    box-shadow: 0 0 0 0.8rem #fff, 0 0 0 0.5rem rgba(255,255,255,0.13);
    filter: brightness(1.12);
  }
  60% {
    box-shadow: 0 0 0 1.2rem #fff, 0 0 0 1.5rem rgba(255,255,255,0.10);
    filter: brightness(1.18);
  }
  100% {
    box-shadow: 0 0 0 0.5rem rgba(255,255,255,0.13);
    filter: brightness(1.0);
  }
}

@media (max-width: 600px) {
  .custom-card {
    padding: 8px;
  }
  .info-label, .info-value {
    font-size: 0.98rem;
  }
  .header-estado {
    font-size: 1.05rem;
  }
  .header-fecha {
    font-size: 0.92rem;
  }
  .card-header-gradient {
    padding: 12px 10px 8px 10px;
    min-height: 54px;
  }
  .card-actions-float {
    margin-top: -24px;
  }
}
</style>
